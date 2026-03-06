import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildApp } from "../src/app.js";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..", "..");
const docsDir = resolve(repoRoot, "docs/2.基本設計(BD)/03.アプリ(APP)/32.OpenAPI IF(IF)");
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

const docsEndpoints = new Map<string, { endpoint: string; refs: string[] }>();

for (const file of (await readdir(docsDir)).filter((f) => /^BD-APP-OAS-\d{3}\.md$/.test(f)).sort()) {
  const filePath = resolve(docsDir, file);
  const content = await readFile(filePath, "utf8");
  const methodMatch = content.match(/^openapi_method:\s*([A-Z]+)$/m);
  const pathMatch = content.match(/^openapi_path:\s*(\/api\/v1\/[^\n]+)$/m);
  if (!methodMatch || !pathMatch) {
    continue;
  }

  const method = methodMatch[1] as HttpMethod;
  const path = pathMatch[1].trim();
  const endpoint = `${method} ${path}`;
  const ref = `${file}:frontmatter`;
  const key = toKey(method, path);
  const current = docsEndpoints.get(key);
  if (current) {
    current.refs.push(ref);
  } else {
    docsEndpoints.set(key, { endpoint, refs: [ref] });
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
  "- compared_scope: /api/v1/* in OpenAPI and BD-APP-OAS-*.md",
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
