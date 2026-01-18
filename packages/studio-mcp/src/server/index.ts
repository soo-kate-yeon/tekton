/**
 * Server Entry Point
 * Starts the Archetype MCP server
 *
 * @module server
 */

import { createMCPServer, TOOLS } from "./mcp-server.js";
import type { Server } from "http";

// Get port from environment or use default
const PORT = parseInt(process.env.MCP_PORT || "3000", 10);

// Start server (async initialization)
let server: Server;

async function startServer() {
  server = await createMCPServer({ port: PORT });
  return server;
}

// Initialize server
startServer().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n⏹️  Shutting down MCP server...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("\n⏹️  Shutting down MCP server...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

export { server, TOOLS };
