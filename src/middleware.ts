import { NextRequest, NextResponse } from "next/server";

const createRequestId = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  }
};

export function middleware(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? createRequestId();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", requestId);

  console.info({
    timestamp: new Date().toISOString(),
    level: "info",
    message: "http.request",
    service: "restaurant-app",
    scope: "middleware",
    requestId,
    method: request.method,
    path: request.nextUrl.pathname,
    search: request.nextUrl.search,
  });

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-request-id", requestId);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
