import type { Command } from "../../types";
import { CommandItem } from "./CommandItem";

interface Props {
  commands: Command[];
  activeIndex: number;
  isFavorite: (id: string) => boolean;
  onOpenDetail: (cmd: Command) => void;
  onToggleFavorite: (id: string) => void;
}

export function CommandList({
  commands,
  activeIndex,
  isFavorite,
  onOpenDetail,
  onToggleFavorite,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      {commands.map((cmd, i) => (
        <CommandItem
          key={cmd.id}
          command={cmd}
          active={i === activeIndex}
          isFavorite={isFavorite(cmd.id)}
          onOpenDetail={() => onOpenDetail(cmd)}
          onToggleFavorite={() => onToggleFavorite(cmd.id)}
        />
      ))}
    </div>
  );
}
