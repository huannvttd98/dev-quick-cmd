import type { Category, Command } from "../../types";
import { CommandItem } from "./CommandItem";

interface Props {
  commands: Command[];
  categoryById: Record<string, Category>;
  activeIndex: number;
  isFavorite: (id: string) => boolean;
  onOpenDetail: (cmd: Command) => void;
  onToggleFavorite: (id: string) => void;
}

export function CommandList({
  commands,
  categoryById,
  activeIndex,
  isFavorite,
  onOpenDetail,
  onToggleFavorite,
}: Readonly<Props>) {
  return (
    <div className="flex-1 overflow-y-auto">
      {commands.map((cmd, i) => (
        <CommandItem
          key={cmd.id}
          command={cmd}
          category={categoryById[cmd.category]}
          active={i === activeIndex}
          isFavorite={isFavorite(cmd.id)}
          onOpenDetail={() => onOpenDetail(cmd)}
          onToggleFavorite={() => onToggleFavorite(cmd.id)}
        />
      ))}
    </div>
  );
}
