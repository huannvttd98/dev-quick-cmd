export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

export function hasPlaceholders(command: string): boolean {
  return /\{\{\w+\}\}/.test(command);
}

export function applyPlaceholders(
  command: string,
  values: Record<string, string>,
): string {
  return command.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    values[key] ? values[key] : `{{${key}}}`,
  );
}
