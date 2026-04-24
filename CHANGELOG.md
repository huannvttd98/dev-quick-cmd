# Changelog

All notable changes to CLI Toolbox will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-04-24

Initial MVP release.

### Added
- Popup UI with search bar, category tabs, command list
- Fuzzy search across title, command, tags, description (via fuse.js)
- Copy command to clipboard with toast feedback
- Placeholder dialog for commands with `{{key}}` variables
- Favorites — synced across devices via `chrome.storage.sync`
- Recent history — last 50 copied commands via `chrome.storage.local`
- Keyboard navigation: ↑↓ to move, Enter to copy, Esc to clear, Ctrl+Enter for raw copy
- Global shortcut `Ctrl+Shift+K` (Cmd+Shift+K on Mac) to open popup
- Omnibox integration — type `cli` + Tab in address bar to search
- Notification on copy from omnibox
- Dark mode — follows system `prefers-color-scheme`
- 150+ commands across 8 categories:
  - Git, Docker, Laravel, Linux, MySQL, Nginx, Node.js, SSH/SCP
