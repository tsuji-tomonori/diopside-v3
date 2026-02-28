import { execFileSync } from "node:child_process";

try {
  execFileSync("git", ["ls-files", "--error-unmatch", "openapi/openapi.v1.json"], {
    cwd: process.cwd(),
    stdio: "ignore",
  });
  execFileSync("git", ["diff", "--exit-code", "--", "openapi/openapi.v1.json"], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  console.log("OpenAPI diff check passed.");
} catch {
  console.error("OpenAPI diff detected. Run 'npm run openapi:generate' and commit openapi/openapi.v1.json.");
  process.exit(1);
}
