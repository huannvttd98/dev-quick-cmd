import Fuse from "fuse.js";
import type { Command } from "../types";

const FUSE_OPTIONS = {
  keys: [
    { name: "title", weight: 2 },
    { name: "command", weight: 1.5 },
    { name: "tags", weight: 1 },
    { name: "description", weight: 0.5 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  includeScore: true,
};

export type CommandSearcher = Fuse<Command>;

export function createSearcher(commands: Command[]): CommandSearcher {
  return new Fuse(commands, FUSE_OPTIONS);
}

export function searchWith(
  searcher: CommandSearcher,
  query: string,
  fallback: Command[],
): Command[] {
  const q = query.trim();
  if (!q) return fallback;
  return searcher.search(q).map((r) => r.item);
}
