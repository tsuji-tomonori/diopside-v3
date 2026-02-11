function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri === "/docs" || uri === "/docs/") {
    request.uri = "/RQ-HM-001.html";
    return request;
  }

  if (uri.startsWith("/docs/")) {
    uri = uri.substring(5);
  }

  if (uri === "/") {
    request.uri = "/RQ-HM-001.html";
    return request;
  }

  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
    return request;
  }

  var lastSlash = uri.lastIndexOf("/");
  var lastSegment = uri.substring(lastSlash + 1);

  if (lastSegment.indexOf(".") === -1) {
    request.uri = uri + ".html";
    return request;
  }

  return request;
}
