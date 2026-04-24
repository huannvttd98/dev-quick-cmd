import { useEffect, useMemo, useRef, useState } from "react";
import { CategoryGrid } from "./components/CategoryGrid";
import { CategoryHeader } from "./components/CategoryHeader";
import { CategoryTabs, type TabId } from "./components/CategoryTabs";
import { CommandList } from "./components/CommandList";
import { DetailDialog } from "./components/DetailDialog";
import { EmptyState } from "./components/EmptyState";
import { PlaceholderDialog } from "./components/PlaceholderDialog";
import { SearchBar } from "./components/SearchBar";
import { Toast } from "./components/Toast";
import { UploadButton } from "./components/UploadButton";
import { useCommands } from "./hooks/useCommands";
import { useFavorites } from "./hooks/useFavorites";
import { useHistory } from "./hooks/useHistory";
import { useTheme } from "./hooks/useTheme";
import type { Command, CategoryId } from "../types";
import {
  applyPlaceholders,
  copyToClipboard,
  hasPlaceholders,
} from "../lib/clipboard";
import { searchWith } from "../lib/search";

interface AppProps {
  mode?: "popup" | "sidepanel";
}

export default function App({ mode = "popup" }: Readonly<AppProps>) {
  useTheme();

  const {
    commands,
    categories,
    categoryById,
    searcher,
    loading,
    error,
    reload,
  } = useCommands();
  const { favorites, toggle: toggleFavorite, isFavorite } = useFavorites();
  const { history, push: pushHistory } = useHistory();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [pendingCommand, setPendingCommand] = useState<Command | null>(null);
  const [detailCommand, setDetailCommand] = useState<Command | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchInput = useRef<HTMLInputElement>(null);

  const countsByCategory = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    for (const c of commands) {
      counts[c.category] = (counts[c.category] ?? 0) + 1;
    }
    return counts;
  }, [commands]);

  const baseList = useMemo<Command[]>(() => {
    if (activeTab === "all") return commands;
    if (activeTab === "favorites") {
      return commands.filter((c) => favorites.includes(c.id));
    }
    if (activeTab === "recent") {
      const byId = new Map(commands.map((c) => [c.id, c]));
      return history
        .map((h) => byId.get(h.id))
        .filter((c): c is Command => !!c);
    }
    return commands.filter((c) => c.category === activeTab);
  }, [commands, favorites, history, activeTab]);

  const filtered = useMemo<Command[]>(() => {
    if (!query.trim()) return baseList;
    if (activeTab === "all") {
      return searchWith(searcher, query, baseList);
    }
    const scopedIds = new Set(baseList.map((c) => c.id));
    return searchWith(searcher, query, commands).filter((c) =>
      scopedIds.has(c.id),
    );
  }, [searcher, query, activeTab, baseList, commands]);

  const showGrid = activeTab === "all" && !query.trim();
  const isCategoryTab =
    activeTab !== "all" && activeTab !== "favorites" && activeTab !== "recent";

  useEffect(() => {
    setActiveIndex(0);
  }, [filtered]);

  const handleSelect = async (cmd: Command, rawCopy = false) => {
    if (!rawCopy && hasPlaceholders(cmd.command)) {
      setPendingCommand(cmd);
      return;
    }
    try {
      await copyToClipboard(cmd.command);
      pushHistory(cmd.id);
      setToastMessage(`Copied: ${cmd.title}`);
    } catch {
      setToastMessage("Copy failed");
    }
  };

  const handleSubmitPlaceholders = async (values: Record<string, string>) => {
    if (!pendingCommand) return;
    const resolved = applyPlaceholders(pendingCommand.command, values);
    try {
      await copyToClipboard(resolved);
      pushHistory(pendingCommand.id);
      setToastMessage(`Copied: ${pendingCommand.title}`);
    } catch {
      setToastMessage("Copy failed");
    }
    setPendingCommand(null);
    searchInput.current?.focus();
  };

  const handlePickCategory = (cat: CategoryId) => {
    setActiveTab(cat);
    searchInput.current?.focus();
  };

  const handleCopyText = async (text: string, label: string) => {
    try {
      await copyToClipboard(text);
      setToastMessage(`Copied: ${label}`);
    } catch {
      setToastMessage("Copy failed");
    }
  };

  const openSidepanel = async () => {
    try {
      const win = await chrome.windows.getCurrent();
      if (win.id !== undefined) {
        await chrome.sidePanel.open({ windowId: win.id });
        window.close();
      }
    } catch (err) {
      setToastMessage("Cannot open sidebar");
      console.error(err);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (pendingCommand || detailCommand) return;
      if (showGrid) {
        if (e.key === "Escape" && query) {
          e.preventDefault();
          setQuery("");
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" || e.key === "?") {
        e.preventDefault();
        const cmd = filtered[activeIndex];
        if (cmd) setDetailCommand(cmd);
      } else if (e.key === "Escape") {
        if (query) {
          e.preventDefault();
          setQuery("");
        } else if (activeTab !== "all") {
          e.preventDefault();
          setActiveTab("all");
        }
      }
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, activeIndex, pendingCommand, detailCommand, query, activeTab, showGrid]);

  const emptyProps = () => {
    if (activeTab === "favorites" && !favorites.length) {
      return {
        icon: "⭐",
        title: "No favorites yet",
        hint: "Click ☆ on any command to save it.",
      };
    }
    if (activeTab === "recent" && !history.length) {
      return {
        icon: "🕘",
        title: "No recent commands",
        hint: "Commands you copy will appear here.",
      };
    }
    return {
      icon: "🔍",
      title: "No commands found",
      hint: query ? "Try a different search." : undefined,
    };
  };

  const hintFooter = () => {
    if (showGrid) {
      return (
        <>
          Pick a category · type to search across all ·{" "}
          {commands.length} commands total
        </>
      );
    }
    return (
      <>
        <kbd className="rounded bg-slate-200 px-1 dark:bg-slate-700">↑↓</kbd>{" "}
        <kbd className="rounded bg-slate-200 px-1 dark:bg-slate-700">↵</kbd>{" "}
        details ·{" "}
        <kbd className="rounded bg-slate-200 px-1 dark:bg-slate-700">Esc</kbd>{" "}
        back · {filtered.length} / {commands.length}
      </>
    );
  };

  const renderBody = () => {
    if (loading && commands.length === 0) {
      return (
        <EmptyState icon="⏳" title="Loading commands…" hint="Calling API" />
      );
    }
    if (error && commands.length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
          <div className="text-4xl">⚠️</div>
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
            Cannot load commands
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {error}
          </div>
          <button
            onClick={() => void reload()}
            className="mt-2 rounded bg-blue-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      );
    }
    if (showGrid) {
      return (
        <CategoryGrid
          categories={categories}
          counts={countsByCategory}
          onSelect={handlePickCategory}
        />
      );
    }
    if (filtered.length === 0) {
      return <EmptyState {...emptyProps()} />;
    }
    return (
      <CommandList
        commands={filtered}
        categoryById={categoryById}
        activeIndex={activeIndex}
        isFavorite={isFavorite}
        onOpenDetail={(cmd) => setDetailCommand(cmd)}
        onToggleFavorite={toggleFavorite}
      />
    );
  };

  return (
    <div className="flex h-full w-full flex-col bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <SearchBar
        ref={searchInput}
        value={query}
        onChange={setQuery}
        action={
          <div className="flex items-center gap-0.5">
            <UploadButton
              onStatus={setToastMessage}
              onUploaded={() => void reload()}
            />
            {mode === "popup" && (
              <button
                onClick={() => void openSidepanel()}
                className="rounded p-1.5 text-sm text-slate-400 hover:bg-slate-100 hover:text-blue-500 dark:hover:bg-slate-700"
                title="Pin as sidebar"
                aria-label="Pin as sidebar"
              >
                📌
              </button>
            )}
          </div>
        }
      />
      <CategoryTabs active={activeTab} onChange={setActiveTab} />
      {isCategoryTab && (
        <CategoryHeader
          category={categoryById[activeTab]}
          count={baseList.length}
          onBack={() => setActiveTab("all")}
        />
      )}
      {renderBody()}
      <div className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        {hintFooter()}
      </div>
      <DetailDialog
        command={detailCommand}
        category={
          detailCommand ? categoryById[detailCommand.category] : undefined
        }
        onCopy={(cmd) => {
          setDetailCommand(null);
          void handleSelect(cmd);
        }}
        onCopyText={handleCopyText}
        onClose={() => setDetailCommand(null)}
      />
      <PlaceholderDialog
        command={pendingCommand}
        onSubmit={handleSubmitPlaceholders}
        onCancel={() => setPendingCommand(null)}
      />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
