import { fetchCategories, fetchCommands } from "../lib/api";
import { createSearcher, searchWith } from "../lib/search";
import { storageGet, storageSet } from "../lib/storage";
import type { Category, Command } from "../types";

const CACHE_KEY = "api_cache_v1";

interface CacheShape {
  commands: Command[];
  categories: Category[];
  fetchedAt: number;
}

let commandsPromise: Promise<Command[]> | null = null;

async function loadCommands(): Promise<Command[]> {
  const cached = await storageGet<CacheShape | null>("local", CACHE_KEY, null);
  if (cached?.commands?.length) return cached.commands;

  const [categories, commands] = await Promise.all([
    fetchCategories(),
    fetchCommands(),
  ]);
  await storageSet<CacheShape>("local", CACHE_KEY, {
    commands,
    categories,
    fetchedAt: Date.now(),
  });
  return commands;
}

function getCommands(): Promise<Command[]> {
  commandsPromise ??= loadCommands().catch((err) => {
    commandsPromise = null;
    throw err;
  });
  return commandsPromise;
}

chrome.runtime.onInstalled.addListener(() => {
  void getCommands();
});

chrome.runtime.onStartup.addListener(() => {
  void getCommands();
});

const OFFSCREEN_URL = "src/offscreen/clipboard.html";

async function ensureOffscreen(): Promise<void> {
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT" as chrome.runtime.ContextType],
  });
  if (contexts.length > 0) return;
  await chrome.offscreen.createDocument({
    url: OFFSCREEN_URL,
    reasons: ["CLIPBOARD" as chrome.offscreen.Reason],
    justification: "Write command to clipboard from omnibox selection",
  });
}

async function copyViaOffscreen(text: string): Promise<boolean> {
  await ensureOffscreen();
  try {
    const response = await chrome.runtime.sendMessage({
      target: "offscreen",
      type: "copy",
      text,
    });
    return Boolean(response?.ok);
  } catch {
    return false;
  }
}

function escapeXml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

chrome.omnibox.setDefaultSuggestion({
  description: "Search CLI commands — type keyword then Enter to copy",
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  void (async () => {
    try {
      const commands = await getCommands();
      const searcher = createSearcher(commands);
      const results = searchWith(searcher, text, commands).slice(0, 8);
      const suggestions: chrome.omnibox.SuggestResult[] = results.map((c) => ({
        content: c.command,
        description: `<match>${escapeXml(c.title)}</match> — <dim>${escapeXml(c.command)}</dim>`,
      }));
      suggest(suggestions);
    } catch {
      suggest([]);
    }
  })();
});

chrome.omnibox.onInputEntered.addListener(async (text) => {
  const ok = await copyViaOffscreen(text);
  let title = "Command";
  try {
    const commands = await getCommands();
    title = commands.find((c) => c.command === text)?.title ?? title;
  } catch {
    // leave default title
  }

  try {
    await chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon-128.png",
      title: ok ? "CLI Toolbox — Copied!" : "CLI Toolbox — Copy failed",
      message: ok ? `${title}: ${text}` : text,
    });
  } catch {
    // notifications permission may be absent; silent fail
  }
});
