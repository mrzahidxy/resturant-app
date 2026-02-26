import { TMenuItem } from "@/types/category";
import { TProduct } from "@/types/product";
import { createRequestId, createTimer, logger, serializeError } from "@/utils/logger";

export type Fetcher = typeof fetch;

type FetchJsonOptions = {
  fetcher?: Fetcher;
  init?: RequestInit;
  revalidate?: number;
};

type ApiErrorDetails = {
  status?: number;
  url?: string;
  body?: string;
};

const DEFAULT_REVALIDATE = 3600;
const DEFAULT_NO_CACHE = 0;
const apiLogger = logger.child({ scope: "lib/api" });

const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return baseUrl.replace(/\/+$/, "");
};

const safeReadText = async (res: Response) => {
  try {
    return await res.text();
  } catch {
    return "";
  }
};

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).length > 0) {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export class ApiError extends Error {
  status?: number;
  url?: string;
  body?: string;

  constructor(message: string, details?: ApiErrorDetails) {
    super(message);
    this.name = "ApiError";
    this.status = details?.status;
    this.url = details?.url;
    this.body = details?.body;
  }
}

const fetchJson = async <T>(path: string, options: FetchJsonOptions = {}) => {
  const { fetcher = fetch, init, revalidate = DEFAULT_REVALIDATE } = options;
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const requestId = createRequestId();
  const getDuration = createTimer();
  const method = init?.method ?? "GET";

  apiLogger.info("api.request.start", {
    requestId,
    method,
    path,
    url,
    revalidate,
  });

  const res = await fetcher(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-request-id": requestId,
      ...(init?.headers ?? {}),
    },
    next: { revalidate },
  });

  if (!res.ok) {
    const body = await safeReadText(res);
    apiLogger.warn("api.request.error_response", {
      requestId,
      method,
      path,
      url,
      status: res.status,
      durationMs: getDuration(),
      bodyPreview: body.slice(0, 300),
    });
    throw new ApiError("Failed to fetch data", {
      status: res.status,
      url,
      body,
    });
  }
  try {
    const data = (await res.json()) as T;
    apiLogger.info("api.request.success", {
      requestId,
      method,
      path,
      url,
      status: res.status,
      durationMs: getDuration(),
    });
    return data;
  } catch (error) {
    apiLogger.error("api.request.parse_failed", {
      requestId,
      method,
      path,
      url,
      status: res.status,
      durationMs: getDuration(),
      error: serializeError(error),
    });
    throw error;
  }
};

export const createApiClient = (fetcher: Fetcher = fetch) => ({
  getMenuCategories: (revalidate?: number) =>
    fetchJson<TMenuItem[]>("/categories", { fetcher, revalidate }),
  getProductsByCategory: (category: string, revalidate?: number) =>
    fetchJson<TProduct[] | { data: TProduct[] }>(
      `/products?cat=${encodeURIComponent(category)}`,
      { fetcher, revalidate },
    ),
  getProductById: (id: string, revalidate?: number) =>
    fetchJson<TProduct>(`/products/${encodeURIComponent(id)}`, {
      fetcher,
      revalidate,
    }),
  getProducts: (params?: { limit?: number }, revalidate?: number) =>
    fetchJson<TProduct[] | { data: TProduct[] }>(
      `/products${buildQuery({ limit: params?.limit })}`,
      {
        fetcher,
        revalidate,
      },
    ),
  getAdminProducts: (params?: { page?: string }, revalidate = DEFAULT_NO_CACHE) =>
    fetchJson<{ data?: TProduct[]; totalPages?: number }>(
      `/products${buildQuery({ page: params?.page })}`,
      { fetcher, revalidate },
    ),
  getAdminOrders: (
    params: { page?: string; session: unknown },
    revalidate = DEFAULT_NO_CACHE,
  ) =>
    fetchJson<{ data?: any[]; totalPages?: number; currentPage?: number }>(
      `/orders${buildQuery({ page: params.page })}`,
      {
        fetcher,
        revalidate,
        init: {
          headers: {
            "Content-Type": "application/json",
            session: JSON.stringify(params.session ?? {}),
          },
        },
      },
    ),
});

export const getMenuCategories = (revalidate?: number) =>
  createApiClient().getMenuCategories(revalidate);

export const getProductsByCategory = (category: string, revalidate?: number) =>
  createApiClient().getProductsByCategory(category, revalidate);

export const getProductById = (id: string, revalidate?: number) =>
  createApiClient().getProductById(id, revalidate);

export const getProducts = (params?: { limit?: number }, revalidate?: number) =>
  createApiClient().getProducts(params, revalidate);

export const getAdminProducts = (
  params?: { page?: string },
  revalidate?: number,
) => createApiClient().getAdminProducts(params, revalidate);

export const getAdminOrders = (
  params: { page?: string; session: unknown },
  revalidate?: number,
) => createApiClient().getAdminOrders(params, revalidate);
