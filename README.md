# discord-webhook-mcp

AI コーディングエージェント（Claude Code / Codex CLI）から Discord Webhook で通知を送信する MCP サーバー。

## セットアップ

### 1. Discord Webhook URL を取得

Discord サーバー設定 → 連携サービス → ウェブフック → 新しいウェブフック → URL をコピー

### 2. MCP サーバーを登録

**Claude Code:**

```bash
claude mcp add discord-webhook -- npx discord-webhook-mcp --webhook "YOUR_WEBHOOK_URL"
```

**Codex CLI:**

```bash
codex mcp add discord-webhook -- npx discord-webhook-mcp --webhook "YOUR_WEBHOOK_URL"
```

**対話式セットアップ** (設定ファイルに保存):

```bash
npx discord-webhook-mcp --setup
```

セットアップ後は URL 指定なしで登録可能:

```bash
claude mcp add discord-webhook -- npx discord-webhook-mcp
```

### HTTP モード

```bash
# サーバー起動
npx discord-webhook-mcp serve --webhook "YOUR_WEBHOOK_URL"

# 別途登録
claude mcp add --transport http discord-webhook http://localhost:3000/mcp
```

## 設定

優先順位: CLI引数 → 環境変数 → 設定ファイル → デフォルト

| 設定 | CLI | 環境変数 | デフォルト |
|---|---|---|---|
| Webhook URL | `--webhook` | `DWM_WEBHOOK_URL` | なし (必須) |
| ポート | `--port` | `DWM_PORT` | `3000` |
| 表示名 | `--username` | `DWM_USERNAME` | なし |
| アバターURL | `--avatar-url` | `DWM_AVATAR_URL` | なし |

設定ファイル: `~/.config/discord-webhook-mcp/config.json`

## License

MIT
