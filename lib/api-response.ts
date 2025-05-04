import { NextResponse } from "next/server";

export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export function success<T>(
  data: T,
  message = "OK",
  code = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ code, message, data }, { status: code });
}

export function failure<T = Record<string, never>>(
  message = "Internal Server Error",
  code = 500,
  data: T = {} as T,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ code, message, data }, { status: code });
}

export function unauthorized<T = Record<string, never>>(
  message = "Unauthorized",
  code = 401,
  data: T = {} as T,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ code, message, data }, { status: code });
}

export function notFound<T = Record<string, never>>(
  message = "Not Found",
  code = 404,
  data: T = {} as T,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ code, message, data }, { status: code });
}

export function badRequest<T = Record<string, never>>(
  message = "Bad Request",
  code = 400,
  data: T = {} as T,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ code, message, data }, { status: code });
}

export function forbidden<T = Record<string, never>>(
  message = "Forbidden",
  code = 403,
  data: T = {} as T,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ code, message, data }, { status: code });
}

export function conflict<T = Record<string, never>>(
  message = "Conflict",
  code = 409,
  data: T = {} as T,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ code, message, data }, { status: code });
}

export function internalServerError<T = Record<string, never>>(
  message = "Internal Server Error",
  code = 500,
  data: T = {} as T,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ code, message, data }, { status: code });
}

export function serviceUnavailable<T = Record<string, never>>(
  message = "Service Unavailable",
  code = 503,
  data: T = {} as T,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ code, message, data }, { status: code });
}

export function gatewayTimeout<T = Record<string, never>>(
  message = "Gateway Timeout",
  code = 504,
  data: T = {} as T,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ code, message, data }, { status: code });
}

export function tooManyRequests<T = Record<string, never>>(
  message = "Too Many Requests",
  code = 429,
  data: T = {} as T,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ code, message, data }, { status: code });
}
