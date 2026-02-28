function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri === "/") {
    return {
      statusCode: 302,
      statusDescription: "Found",
      headers: {
        location: {
          value: "/web/",
        },
      },
    };
  }

  return request;
}
