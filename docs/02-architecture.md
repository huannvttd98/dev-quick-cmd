# Architecture

## Cấu trúc thư mục

```
dev-quick-cmd/
├── .vscode/
│   ├── launch.json           # Debug config (F5 để test extension)
│   └── tasks.json            # Build task
├── .vscodeignore             # Loại file khỏi .vsix
├── docs/                     # Tài liệu plan (thư mục này)
├── src/
│   ├── extension.ts          # Entry point — activate() / deactivate()
│   ├── commands/
│   │   ├── search.ts         # Mở Quick Pick chính
│   │   ├── favorites.ts      # Quick Pick chỉ favorites
│   │   └── history.ts        # Quick Pick chỉ history
│   ├── data/
│   │   ├── index.ts          # Load & merge tất cả JSON
│   │   ├── git.json
│   │   ├── docker.json
│   │   ├── laravel.json
│   │   ├── linux.json
│   │   ├── mysql.json
│   │   ├── nginx.json
│   │   ├── node.json
│   │   └── ssh.json
│   ├── storage/
│   │   ├── favorites.ts      # Wrap globalState key "favorites"
│   │   └── history.ts        # Wrap globalState key "history"
│   ├── ui/
│   │   └── quickPick.ts      # Factory tạo Quick Pick + render item
│   └── types.ts              # Type definitions (Command, Category)
├── package.json              # Manifest extension
├── tsconfig.json
├── esbuild.js                # Build script
├── .gitignore
├── CHANGELOG.md
├── LICENSE
└── README.md
```

## Module boundaries

```
extension.ts
   │
   ├─→ commands/*  (đăng ký vào VS Code)
   │      │
   │      └─→ ui/quickPick.ts  (tạo Quick Pick)
   │             │
   │             ├─→ data/index.ts    (nguồn commands)
   │             └─→ storage/*        (favorites, history)
   │
   └─→ types.ts    (shared types, không phụ thuộc gì)
```

**Quy tắc:**
- `data/` không import `vscode` — thuần data layer
- `storage/` chỉ import `vscode` cho `Memento` API
- `commands/` là lớp duy nhất gọi `vscode.commands.*` và `vscode.window.*`
- `ui/` tách ra để tái sử dụng giữa 3 command khác nhau

## Extension manifest (package.json — key fields)

```jsonc
{
  "name": "cli-toolbox",
  "displayName": "CLI Toolbox",
  "publisher": "<your-publisher>",
  "engines": { "vscode": "^1.85.0" },
  "categories": ["Other", "Snippets"],
  "activationEvents": ["onStartupFinished"],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      { "command": "cliToolbox.search",        "title": "CLI Toolbox: Search Commands" },
      { "command": "cliToolbox.showFavorites", "title": "CLI Toolbox: Show Favorites" },
      { "command": "cliToolbox.showHistory",   "title": "CLI Toolbox: Show Recent" }
    ],
    "keybindings": [
      { "command": "cliToolbox.search", "key": "ctrl+alt+c", "mac": "cmd+alt+c" }
    ]
  }
}
```
