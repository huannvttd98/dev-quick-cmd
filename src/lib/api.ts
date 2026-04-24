import type { Category, Command } from "../types";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://45.251.115.151:8787";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // body is not JSON — keep default message
    }
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as T;
}

interface CategoriesResponse {
  data: Array<{ id: string; label: string; emoji: string; count: number }>;
  version: string;
}

interface CommandsResponse {
  data: Command[];
  meta: { page: number; per_page: number; total: number; version: string };
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await request<CategoriesResponse>("/api/v1/categories");
  return res.data.map(({ id, label, emoji }) => ({ id, label, emoji }));
}

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

export type ImportJobStatus = "pending" | "processing" | "done" | "failed";

export interface ImportQueueJob {
  jobId: string;
  status: ImportJobStatus;
  queueFile: string;
  category?: string;
  commandCount?: number;
  importedCommands?: number;
  attempts?: number;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
  error?: string;
}

export interface UploadJsonResponse {
  message: string;
  fileName: string;
  savedTo: string;
  category: string;
  database: { driver: string; status: string; importedCommands: number };
  queue: { jobId: string; status: ImportJobStatus; file: string };
}

export async function uploadJson(file: File): Promise<UploadJsonResponse> {
  if (!file.name.toLowerCase().endsWith(".json")) {
    throw new ApiError(0, "Only .json files are allowed");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ApiError(0, "File exceeds 2MB limit");
  }
  try {
    JSON.parse(await file.text());
  } catch {
    throw new ApiError(0, "File is not valid JSON");
  }

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/v1/upload-json`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    let message = `Upload failed: ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // body is not JSON — keep default message
    }
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as UploadJsonResponse;
}

export async function fetchImportQueue(): Promise<ImportQueueJob[]> {
  const res = await request<{ data: ImportQueueJob[]; version: string }>(
    "/api/v1/import-queue",
  );
  return res.data;
}

export async function pollImportJob(
  jobId: string,
  onUpdate: (job: ImportQueueJob) => void,
  { intervalMs = 2000, timeoutMs = 60000 }: {
    intervalMs?: number;
    timeoutMs?: number;
  } = {},
): Promise<ImportQueueJob> {
  const deadline = Date.now() + timeoutMs;
  let last: ImportQueueJob | undefined;
  while (Date.now() < deadline) {
    const jobs = await fetchImportQueue();
    const job = jobs.find((j) => j.jobId === jobId);
    if (job) {
      if (job.status !== last?.status) onUpdate(job);
      last = job;
      if (job.status === "done" || job.status === "failed") return job;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new ApiError(0, "Import job timed out");
}

export async function fetchCommands(): Promise<Command[]> {
  const PAGE_SIZE = 500;
  const first = await request<CommandsResponse>(
    `/api/v1/commands?page=1&per_page=${PAGE_SIZE}`,
  );
  if (first.data.length >= first.meta.total) return first.data;
  const result = [...first.data];
  const pages = Math.ceil(first.meta.total / PAGE_SIZE);
  for (let page = 2; page <= pages; page++) {
    const r = await request<CommandsResponse>(
      `/api/v1/commands?page=${page}&per_page=${PAGE_SIZE}`,
    );
    result.push(...r.data);
  }
  return result;
}
