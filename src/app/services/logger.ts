import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Logger {
  private logs: string[] = [];

  public log(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    this.logs.push(logMessage);
  }

  public error(message: string): void {
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] ERROR: ${message}`;
    console.error(errorMessage);
    this.logs.push(errorMessage);
  }

  public warn(message: string): void {
    const timestamp = new Date().toISOString();
    const warnMessage = `[${timestamp}] WARN: ${message}`;
    console.warn(warnMessage);
    this.logs.push(warnMessage);
  }

  public getLogs(): string[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }
}
