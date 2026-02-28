import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildApp } from "../src/app.js";

process.env.JWT_DEV_BYPASS = process.env.JWT_DEV_BYPASS ?? "1";

const outPath = process.env.OPENAPI_OUT ?? path.resolve(process.cwd(), "openapi/openapi.v1.json");

const app = buildApp();
const res = await app.request("/openapi/v1/openapi.json", {
  headers: {
    authorization: "Bearer dev-token",
  },
});

if (!res.ok) {
  throw new Error(`Failed to fetch OpenAPI document: ${res.status}`);
}

const json = await res.json();
await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(json, null, 2)}\n`, "utf-8");
console.log(`Generated OpenAPI: ${outPath}`);
