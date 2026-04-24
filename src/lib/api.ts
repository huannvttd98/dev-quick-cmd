import type { Category, Command } from "../types";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://45.251.115.151:8787";

export interface ApiError {
  status: number;
  message: string;
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
    throw { status: res.status, message } as ApiError;
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
