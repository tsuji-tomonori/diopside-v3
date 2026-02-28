import { randomUUID } from "node:crypto";

export const newId = () => randomUUID();
export const nowIso = () => new Date().toISOString();

export const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
