export type CategoryId =
  | "git"
  | "docker"
  | "laravel"
  | "linux"
  | "mysql"
  | "nginx"
  | "node"
  | "ssh";

export interface Placeholder {
  key: string;
  hint: string;
  default?: string;
}

export interface Command {
  id: string;
  category: CategoryId;
  title: string;
  command: string;
  description?: string;
  tags?: string[];
  placeholders?: Placeholder[];
  examples?: string[];
  docs?: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
}

export interface HistoryEntry {
  id: string;
  usedAt: number;
}

export type RawCommand = Omit<Command, "category">;

export interface CategoryDataset {
  category: CategoryId;
  commands: RawCommand[];
}
