import { loadCommands } from "../data";
import { createSearcher, searchWith } from "../lib/search";
import type { Command } from "../types";

const commands = loadCommands();
const searcher = createSearcher(commands);

const commandByContent = new Map<string, Command>(
  commands.map((c) => [c.command, c]),
);

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
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

chrome.omnibox.setDefaultSuggestion({
  description: "Search CLI commands — type keyword then Enter to copy",
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const results = searchWith(searcher, text, commands).slice(0, 8);
  const suggestions: chrome.omnibox.SuggestResult[] = results.map((c) => ({
    content: c.command,
    description: `<match>${escapeXml(c.title)}</match> — <dim>${escapeXml(c.command)}</dim>`,
  }));
  suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener(async (text) => {
  const ok = await copyViaOffscreen(text);
  const cmd = commandByContent.get(text);
  const title = cmd?.title ?? "Command";

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
