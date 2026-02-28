import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { stringify } from "yaml";
import { buildApp } from "../src/app.js";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "..", "openapi");
const outJson = resolve(outDir, "openapi.v1.generated.json");
const outYaml = resolve(outDir, "openapi.v1.generated.yaml");

const app = buildApp();
const document = app.getOpenAPIDocument({
  openapi: "3.0.0",
  info: {
    title: "diopside backend api",
    version: "1.0.0",
    description: "Backend API aligned with DD-APP-API-002..015",
  },
});

await mkdir(outDir, { recursive: true });
await writeFile(outJson, `${JSON.stringify(document, null, 2)}\n`, "utf8");
await writeFile(outYaml, `${stringify(document)}\n`, "utf8");

console.log(`generated: ${outYaml}`);
console.log(`generated: ${outJson}`);
