type LogLevel = "error" | "warn" | "info" | "debug";
type LogMeta = Record<string, unknown>;
type LoggerLike = Record<LogLevel, (message: string, meta?: LogMeta) => void> & {
  child: (meta: LogMeta) => LoggerLike;
};

const SERVICE_NAME = "restaurant-app";
const DEFAULT_LEVEL = process.env.NODE_ENV === "development" ? "debug" : "info";
const LOG_LEVEL = process.env.LOG_LEVEL ?? DEFAULT_LEVEL;

let nodeLoggerInstance: any | null = null;

const isNodeRuntime = () =>
  typeof process !== "undefined" &&
  !!process.versions?.node &&
  typeof (globalThis as { EdgeRuntime?: unknown }).EdgeRuntime === "undefined";

const randomId = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  }
};

const getNodeLogger = () => {
  if (!isNodeRuntime()) return null;
  if (nodeLoggerInstance) return nodeLoggerInstance;

  try {
    // eslint-disable-next-line no-eval
    const requireFn = eval("require") as NodeRequire;
    const winston = requireFn("winston");

    nodeLoggerInstance = winston.createLogger({
      level: LOG_LEVEL,
      defaultMeta: {
        service: SERVICE_NAME,
        env: process.env.NODE_ENV ?? "development",
      },
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      transports: [new winston.transports.Console()],
    });
  } catch {
    nodeLoggerInstance = null;
  }

  return nodeLoggerInstance;
};

const writeConsoleLog = (level: LogLevel, message: string, meta: LogMeta) => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    service: SERVICE_NAME,
    ...meta,
  };

  if (level === "error") return console.error(payload);
  if (level === "warn") return console.warn(payload);
  if (level === "debug") return console.debug(payload);
  return console.info(payload);
};

const buildLogger = (baseMeta: LogMeta = {}): LoggerLike => {
  const log = (level: LogLevel, message: string, meta: LogMeta = {}) => {
    const payload = { ...baseMeta, ...meta };
    const nodeLogger = getNodeLogger();

    if (nodeLogger) {
      nodeLogger.log(level, message, payload);
      return;
    }

    writeConsoleLog(level, message, payload);
  };

  return {
    error: (message, meta) => log("error", message, meta),
    warn: (message, meta) => log("warn", message, meta),
    info: (message, meta) => log("info", message, meta),
    debug: (message, meta) => log("debug", message, meta),
    child: (meta) => buildLogger({ ...baseMeta, ...meta }),
  };
};

export const logger = buildLogger();

export const createRequestId = () => randomId();

export const getRequestIdFromHeaders = (
  headers?: Headers | { get?: (name: string) => string | null } | null,
) => {
  if (!headers) return createRequestId();

  const getter =
    typeof (headers as { get?: unknown }).get === "function"
      ? (headers as { get: (name: string) => string | null }).get.bind(headers)
      : null;

  if (!getter) return createRequestId();

  return (
    getter("x-request-id") ||
    getter("x-correlation-id") ||
    getter("x-vercel-id") ||
    createRequestId()
  );
};

export const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: typeof error === "string" ? error : "Unknown error",
    value: error,
  };
};

export const createTimer = () => {
  const start = Date.now();
  return () => Date.now() - start;
};

export const sanitizeSessionForLog = (session: any) => {
  if (!session) return null;

  return {
    hasSession: true,
    user: session.user
      ? {
          id: session.user.id ?? null,
          email: session.user.email ?? null,
          isAdmin: session.user.isAdmin ?? null,
          name: session.user.name ?? null,
        }
      : null,
    expires: session.expires ?? null,
  };
};
