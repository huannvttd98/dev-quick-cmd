# CLI Toolbox

> A fast command reference Chrome Extension for developers. Search, copy, and learn terminal commands instantly.

![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-planning-orange)
![Platform](https://img.shields.io/badge/platform-Chrome-yellow)

---

## Overview

CLI Toolbox is a Chrome Extension designed to help developers quickly access commonly used CLI commands without switching tabs or searching online.

Whether you work with Linux servers, Git workflows, Docker containers, Laravel projects, or databases, CLI Toolbox gives you instant access to commands you use every day — one click, one copy.

---

## Key Features

* ⚡ Instant command search (fuzzy match)
* 📋 One-click copy to clipboard
* 🗂️ Organized by categories
* ⭐ Save favorite commands (synced via Chrome account)
* 🕘 Recent command history
* ⌨️ Keyboard-first UX (open with `Ctrl+Shift+K`)
* 🔎 Omnibox integration — type `cli` + `Tab` in address bar
* 🌙 Dark / Light theme
* 🚀 Offline-first, no external API calls

---

## Supported Categories

* Git
* Docker
* Laravel Artisan
* Linux / Ubuntu
* MySQL / MariaDB
* Nginx / Apache
* Node.js / npm / yarn / pnpm
* SSH / SCP

---

## Example Commands

```bash
git status
git pull origin main
php artisan migrate
php artisan cache:clear
docker ps
sudo systemctl restart nginx
mysql -u root -p
scp file.txt user@server:/home/
```

---

## Tech Stack

* **TypeScript** — type-safe codebase
* **Chrome Manifest V3** — latest extension standard
* **React 18** — popup UI
* **Tailwind CSS** — styling
* **Vite** + [`@crxjs/vite-plugin`](https://crxjs.dev/vite-plugin/) — build & HMR
* **chrome.storage** — favorites (`sync`) + history (`local`)
* **Vitest** — unit tests

No backend. No telemetry. No external API calls.

---

## Installation

### Chrome Web Store

Coming soon — extension is currently in planning / development.

### From source (development)

```bash
git clone <repo-url> cli-toolbox
cd cli-toolbox
npm install
npm run dev
```

Then in Chrome:
1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `dist/` folder

---

## Documentation

Full plan and architecture lives in [docs/](docs/):

* [00-overview.md](docs/00-overview.md) — Goals & MVP scope
* [01-tech-stack.md](docs/01-tech-stack.md) — Stack & dependencies
* [02-architecture.md](docs/02-architecture.md) — Folder structure & modules
* [03-data-schema.md](docs/03-data-schema.md) — Command & category schema
* [04-user-flow.md](docs/04-user-flow.md) — User flows & keyboard shortcuts
* [05-roadmap.md](docs/05-roadmap.md) — Milestones
* [06-publishing.md](docs/06-publishing.md) — Chrome Web Store publishing guide

---

## Roadmap

### MVP (Chrome Extension)

* [ ] Scaffold project (Vite + `@crxjs`)
* [ ] Data layer + seed commands for 8 categories
* [ ] Popup UI with search, copy, categories
* [ ] Favorites & history with `chrome.storage`
* [ ] Omnibox integration
* [ ] Dark mode + polish
* [ ] Publish to Chrome Web Store

### Next Version

* [ ] Context menu "Lookup CLI for selected text"
* [ ] AI command explanation
* [ ] Import/export favorites
* [ ] User-defined custom commands
* [ ] **VS Code Extension** port (reuse the same command data)
* [ ] Firefox port
* [ ] Team shared snippets

---

## Why CLI Toolbox?

Developers waste time searching for commands they already used before.
CLI Toolbox solves that by keeping your most useful commands in one place.

Benefits:

* Reduce context switching
* Improve workflow speed
* Learn commands faster
* Useful for juniors and seniors alike

---

## Screenshots

```text
Coming soon...
```

---

## Contributing

Contributions, ideas, and feedback are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

---

## License

MIT License

---

## Author

Built with ❤️ for developers.

---

## Star the Project

If this project helps you, please give it a ⭐ on GitHub.
