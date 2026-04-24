import { useRef, useState } from "react";
import { uploadJson } from "../../lib/api";

interface Props {
  onStatus: (message: string) => void;
  onUploaded?: () => void;
}

export function UploadButton({ onStatus, onUploaded }: Readonly<Props>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setBusy(true);
    onStatus(`Uploading ${file.name}…`);
    try {
      await uploadJson(file);
      onStatus(`Uploaded: ${file.name}`);
      onUploaded?.();
    } catch (err) {
      const message = (err as { message?: string })?.message ?? "Upload failed";
      onStatus(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleChange}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="rounded p-1.5 text-sm text-slate-400 hover:bg-slate-100 hover:text-blue-500 disabled:cursor-wait disabled:opacity-50 dark:hover:bg-slate-700"
        title="Upload JSON file"
        aria-label="Upload JSON file"
      >
        {busy ? "⏳" : "📤"}
      </button>
    </>
  );
}
