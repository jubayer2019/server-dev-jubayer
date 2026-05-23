export function applyAuthHeaders(res, headers) {
  if (!headers) {
    return;
  }

  const setCookie = [];
  for (const [key, value] of headers.entries()) {
    if (key.toLowerCase() === "set-cookie") {
      setCookie.push(value);
      continue;
    }

    res.setHeader(key, value);
  }

  if (setCookie.length > 0) {
    res.setHeader("Set-Cookie", setCookie);
  }
}

export function asyncHandler(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next);
  };
}
