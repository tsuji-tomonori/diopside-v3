import * as fs from "fs";
import * as path from "path";
import * as vm from "vm";

type CloudFrontRequest = {
  uri: string;
};

function loadHandler(): (event: { request: CloudFrontRequest }) => CloudFrontRequest {
  const filePath = path.join(__dirname, "../functions/web-spa-rewrite.js");
  const source = fs.readFileSync(filePath, "utf-8");
  const context = {
    module: { exports: {} as { handler?: (event: { request: CloudFrontRequest }) => CloudFrontRequest } },
    exports: {},
  };

  vm.runInNewContext(`${source}\nmodule.exports = { handler };`, context);

  if (!context.module.exports.handler) {
    throw new Error("handler export not found");
  }

  return context.module.exports.handler;
}

describe("web-spa-rewrite", () => {
  const handler = loadHandler();

  test.each(["/web", "/web/", "/web/index.html"])("serves the SPA entrypoint for %s", (uri) => {
    const request = handler({ request: { uri } });
    expect(request.uri).toBe("/web/index.html");
  });

  test.each(["/web/videos/abc123", "/web/tags/chat/", "/web/filters/date"])(
    "rewrites extensionless route %s to the SPA entrypoint",
    (uri) => {
      const request = handler({ request: { uri } });
      expect(request.uri).toBe("/web/index.html");
    },
  );

  test.each(["/web/bootstrap.json", "/web/tag_master.json", "/web/assets/main.js"])(
    "keeps asset request %s untouched",
    (uri) => {
      const request = handler({ request: { uri } });
      expect(request.uri).toBe(uri);
    },
  );
});
