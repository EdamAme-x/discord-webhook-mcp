import { parseArgs } from "node:util";
import { loadConfig } from "./config/loader.js";
import { startStdioServer, startHttpServer } from "./server.js";
import { runSetup } from "./config/setup.js";

function printHelp() {
  console.log(`
  discord-webhook-mcp - MCP server for Discord Webhook notifications

  Usage:
    discord-webhook-mcp [options]           Start in stdio mode (default)
    discord-webhook-mcp serve [options]     Start HTTP server
    discord-webhook-mcp --setup             Interactive setup wizard

  Options:
    --webhook <url>     Discord Webhook URL
    --port <port>       HTTP server port (default: 3000)
    --username <name>   Bot display name
    --avatar-url <url>  Bot avatar URL
    --setup             Run setup wizard
    --help              Show this help
`);
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      webhook: { type: "string" },
      port: { type: "string" },
      username: { type: "string" },
      "avatar-url": { type: "string" },
      setup: { type: "boolean", default: false },
      help: { type: "boolean", default: false },
    },
  });

  if (values.help) {
    printHelp();
    process.exit(0);
  }

  if (values.setup) {
    await runSetup();
    process.exit(0);
  }

  const subcommand = positionals[0];

  let config;
  try {
    config = loadConfig({
      webhook: values.webhook,
      port: values.port,
      username: values.username,
      avatarUrl: values["avatar-url"],
    });
  } catch (e) {
    console.error(
      "Error: Webhook URL is required.\n" +
        "Pass --webhook <url>, set DWM_WEBHOOK_URL, or run --setup first."
    );
    process.exit(1);
  }

  if (subcommand === "serve") {
    await startHttpServer(config);
  } else {
    await startStdioServer(config);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
