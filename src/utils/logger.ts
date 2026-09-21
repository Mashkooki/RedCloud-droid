import { LogEntry } from '../types';

type LogListener = (logs: LogEntry[]) => void;

class LoggerService {
  private logs: LogEntry[] = [];
  private listeners: Set<LogListener> = new Set();
  private maxLogs = 500;

  constructor() {
    this.log("SYSTEM", "RedCloud VPN Initialized (Web Engine).");
  }

  public log(tag: string, message: string, isError = false) {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      time: new Date(),
      tag,
      message,
      isError,
    };

    if (this.logs.length >= this.maxLogs) {
      this.logs.shift();
    }
    this.logs.push(entry);
    this.notify();
  }

  public addNativeLog(rawLine: string) {
    const isErr =
      rawLine.toLowerCase().includes("error") ||
      rawLine.toLowerCase().includes("fail") ||
      rawLine.toLowerCase().includes("crash") ||
      rawLine.toLowerCase().includes("aborted");

    this.log("NATIVE", rawLine, isErr);
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clear() {
    this.logs = [];
    this.notify();
  }

  public subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    listener(this.getLogs());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const copy = this.getLogs();
    this.listeners.forEach((listener) => listener(copy));
  }

  public formatAll(): string {
    return this.logs
      .map((e) => {
        const h = String(e.time.getHours()).padStart(2, '0');
        const m = String(e.time.getMinutes()).padStart(2, '0');
        const s = String(e.time.getSeconds()).padStart(2, '0');
        const ms = String(e.time.getMilliseconds()).padStart(3, '0');
        return `[${h}:${m}:${s}.${ms}] [${e.tag}] ${e.message}`;
      })
      .join('\n');
  }
}

export const appLogger = new LoggerService();
