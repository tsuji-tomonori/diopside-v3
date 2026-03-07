function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri === "/web" || uri === "/web/") {
    request.uri = "/web/index.html";
    return request;
  }

  if (!uri.startsWith("/web/")) {
    return request;
  }

  var webPath = uri.substring(5);
  if (webPath === "" || webPath === "index.html") {
    request.uri = "/web/index.html";
    return request;
  }

  if (webPath.endsWith("/")) {
    request.uri = "/web/index.html";
    return request;
  }

  var lastSlash = webPath.lastIndexOf("/");
  var lastSegment = webPath.substring(lastSlash + 1);

  if (lastSegment.indexOf(".") === -1) {
    request.uri = "/web/index.html";
  }

  return request;
}
