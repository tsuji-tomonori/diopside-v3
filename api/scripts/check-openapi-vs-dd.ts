import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildApp } from "../src/app.js";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const docsDir = resolve(repoRoot, "docs/3.詳細設計(DD)/02.アプリ(APP)/21.API詳細(API)");
const reportsDir = resolve(repoRoot, "reports");
const reportPath = resolve(reportsDir, "api_openapi_contract_check.md");

const normalizePath = (path: string) => path.replace(/\{[^}]+\}/g, "{}");
const toKey = (method: string, path: string) => `${method.toUpperCase()} ${normalizePath(path)}`;

const app = buildApp();
const openapi = app.getOpenAPIDocument({
  openapi: "3.0.0",
  info: {
    title: "diopside backend api",
    version: "1.0.0",
    description: "Backend API aligned with DD-APP-API-002..015",
  },
});

const methods = new Set(["get", "post", "patch", "put", "delete"]);
const codeEndpoints = new Map<string, string>();
for (const [path, pathItem] of Object.entries(openapi.paths ?? {})) {
  for (const [method, value] of Object.entries(pathItem ?? {})) {
    if (!methods.has(method)) continue;
    if (!path.startsWith("/api/v1/")) continue;
    if (!value) continue;
    const key = toKey(method, path);
    codeEndpoints.set(key, `${method.toUpperCase()} ${path}`);
  }
}

const endpointPattern = /`(GET|POST|PATCH|PUT|DELETE)\s+(\/api\/v1\/[^`\s]+)`/g;
const docsEndpoints = new Map<string, { endpoint: string; refs: string[] }>();

for (const file of (await readdir(docsDir)).filter((f) => /^DD-APP-API-\d{3}\.md$/.test(f)).sort()) {
  const filePath = resolve(docsDir, file);
  const content = await readFile(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.includes("/api/v1/")) continue;

    for (const match of line.matchAll(endpointPattern)) {
      const method = match[1] as HttpMethod;
      const path = match[2];
      const endpoint = `${method} ${path}`;
      const ref = `${file}:${i + 1}`;
      const key = toKey(method, path);
      const current = docsEndpoints.get(key);
      if (current) {
        current.refs.push(ref);
      } else {
        docsEndpoints.set(key, { endpoint, refs: [ref] });
      }
    }
  }
}

const onlyInCode = [...codeEndpoints.entries()]
  .filter(([key]) => !docsEndpoints.has(key))
  .map(([, endpoint]) => endpoint)
  .sort();

const onlyInDocs = [...docsEndpoints.entries()]
  .filter(([key]) => !codeEndpoints.has(key))
  .map(([, value]) => `${value.endpoint} (${value.refs[0]})`)
  .sort();

const now = new Date().toISOString();
const onlyInOpenApiLines = onlyInCode.length === 0 ? ["- none"] : onlyInCode.map((v) => `- ${v}`);
const onlyInDocsLines = onlyInDocs.length === 0 ? ["- none"] : onlyInDocs.map((v) => `- ${v}`);
const passed = onlyInCode.length === 0 && onlyInDocs.length === 0;

const reportLines = [
  "# API OpenAPI-Docs Contract Check",
  "",
  `- generated_at: ${now}`,
  `- openapi_endpoint_count: ${codeEndpoints.size}`,
  `- docs_endpoint_count: ${docsEndpoints.size}`,
  "- compared_scope: /api/v1/* in OpenAPI and DD-APP-API-*.md",
  "",
  "## Only In OpenAPI",
  ...onlyInOpenApiLines,
  "",
  "## Only In Docs",
  ...onlyInDocsLines,
  "",
  "## Result",
  passed ? "- PASS" : "- FAIL",
  "",
];

await mkdir(reportsDir, { recursive: true });
await writeFile(reportPath, reportLines.join("\n"), "utf8");

if (!passed) {
  console.error(`contract mismatch detected. see: ${reportPath}`);
  process.exit(1);
}

console.log(`contract check passed. report: ${reportPath}`);
