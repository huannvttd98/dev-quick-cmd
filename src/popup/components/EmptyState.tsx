interface Props {
  icon: string;
  title: string;
  hint?: string;
}

export function EmptyState({ icon, title, hint }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-500">
      <div className="mb-3 text-4xl">{icon}</div>
      <div className="text-sm font-medium">{title}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}
