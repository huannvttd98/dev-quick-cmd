import { useMemo } from "react";
import { loadCommands } from "../../data";
import { createSearcher } from "../../lib/search";

export function useCommands() {
  const commands = useMemo(() => loadCommands(), []);
  const searcher = useMemo(() => createSearcher(commands), [commands]);
  return { commands, searcher };
}
