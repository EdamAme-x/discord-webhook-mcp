import { Hono } from "hono";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { toFetchResponse, toReqRes } from "fetch-to-node";
import { serve } from "@hono/node-server";
import type { Config } from "./config/schema.js";
import { DiscordClient } from "./discord/client.js";
import { registerAllTools } from "./tools/index.js";

const SERVER_NAME = "discord-webhook-mcp";
const SERVER_VERSION = "1.0.0";

function createMcpServer(discord: DiscordClient): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { logging: {} } }
  );
  registerAllTools(server, discord);
  return server;
}

export async function startStdioServer(config: Config): Promise<void> {
  const discord = new DiscordClient(config);
  const server = createMcpServer(discord);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

export async function startHttpServer(config: Config): Promise<void> {
  const discord = new DiscordClient(config);
  const app = new Hono();

  app.post("/mcp", async (c) => {
    const { req, res } = toReqRes(c.req.raw);
    const server = createMcpServer(discord);

    try {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, await c.req.json());

      res.on("close", () => {
        transport.close();
        server.close();
      });

      return toFetchResponse(res);
    } catch (e) {
      return c.json(
        {
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        },
        { status: 500 }
      );
    }
  });

  app.get("/health", (c) => c.json({ status: "ok" }));

  console.log(`${SERVER_NAME} HTTP server listening on port ${config.port}`);
  console.log(`MCP endpoint: http://localhost:${config.port}/mcp`);

  serve({ fetch: app.fetch, port: config.port });
}
