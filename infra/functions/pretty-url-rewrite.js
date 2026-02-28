function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri === "/docs") {
    request.uri = "/docs/index.html";
    return request;
  }

  if (uri === "/docs/") {
    request.uri = "/docs/index.html";
    return request;
  }

  if (!uri.startsWith("/docs/")) {
    return request;
  }

  var docsPath = uri.substring(5);

  if (docsPath === "") {
    request.uri = "/docs/index.html";
    return request;
  }

  if (docsPath.endsWith("/")) {
    request.uri = uri + "index.html";
    return request;
  }

  var lastSlash = docsPath.lastIndexOf("/");
  var lastSegment = docsPath.substring(lastSlash + 1);

  if (lastSegment.indexOf(".") === -1) {
    request.uri = uri + ".html";
    return request;
  }

  return request;
}
