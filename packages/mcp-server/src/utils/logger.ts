/**
 * Logger utility for MCP server
 * All output goes to stderr to keep stdout clean for MCP protocol
 */

export function info(message: string, ...args: unknown[]): void {
  console.error(`[INFO] ${message}`, ...args);
}

export function error(message: string, ...args: unknown[]): void {
  console.error(`[ERROR] ${message}`, ...args);
}

export function debug(message: string, ...args: unknown[]): void {
  console.error(`[DEBUG] ${message}`, ...args);
}
