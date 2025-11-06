/**
 * Logger utility for consistent logging across the application
 * Provides different log levels: info, warn, error, debug
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LoggerConfig {
  enableInProduction?: boolean;
  enableDebugInDevelopment?: boolean;
}

class Logger {
  private config: LoggerConfig;

  constructor(config: LoggerConfig = {}) {
    this.config = {
      enableInProduction: false,
      enableDebugInDevelopment: true,
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    const isDevelopment = process.env.NODE_ENV !== "production";
    const isProduction = process.env.NODE_ENV === "production";

    // In production, only log if explicitly enabled
    if (isProduction && !this.config.enableInProduction) {
      return false;
    }

    // In development, don't log debug if disabled
    if (isDevelopment && level === "debug" && !this.config.enableDebugInDevelopment) {
      return false;
    }

    return true;
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (data !== undefined) {
      return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`;
    }

    return `${prefix} ${message}`;
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog("info")) {
      console.log(this.formatMessage("info", message, data));
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, data));
    }
  }

  error(message: string, data?: unknown): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, data));
    }
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, data));
    }
  }
}

// Export singleton instance
const logger = new Logger();

export default logger;
