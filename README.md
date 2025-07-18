# Markdown Dashboard

A fast, minimalist, local-first web application that turns a directory of Markdown files into a beautiful, auto-updating, customizable personal dashboard. Your own digital command center — built entirely on your machine, respecting privacy, speed, and simplicity.

## 🚀 Features
- **Local File System as Source of Truth**: Reads content directly from your Markdown files. No cloud, no DB, no telemetry.
- **Single Page Dashboard**: Each widget = one Markdown file, styled and titled.
- **Live Updating**: Real-time updates via WebSocket when files change.
- **Configurable Layout**: Control display via `config.json`.
- **Clean, Modular Architecture**: Easy to extend and hack.

## 🛠 Setup
1. Clone/download this repo.
2. `npm install`
3. Add your Markdown files (e.g., `notes.md`, `tasks.md`).
4. Edit `config.json` to list your widgets.
5. `node server.js`
6. Open [http://localhost:3000](http://localhost:3000)

## 📝 Usage
- Edit your Markdown files — dashboard updates instantly.
- Change `config.json` to add/remove/reorder widgets.

## ⚙️ config.json Schema
```json
{
  "port": 3000,
  "theme": "light",
  "widgets": [
    {
      "file": "notes.md",
      "title": "My Notes",
      "size": "medium"
    },
    {
      "file": "tasks.md",
      "title": "Tasks",
      "size": "small"
    }
  ]
}
```
- `port`: (optional) Port to run the server.
- `theme`: (optional) Simple theme name.
- `widgets`: Array of widgets to display, in order.
  - `file`: Path to Markdown file.
  - `title`: Widget title.
  - `size`: (optional) Widget size preset.

## 📂 Folder Structure
```
.
├── server.js
├── config.js
├── fileWatcher.js
├── dashboardRenderer.js
├── socket.js
├── config.json
├── public/
│   ├── index.html
│   ├── style.css
│   └── client.js
├── package.json
└── README.md
```

## 💡 Extension Ideas
- Support for CSV, JSON, plaintext widgets
- Custom widgets (quote-of-the-day, git log, uptime, etc.)
- CLI to append/edit notes
- Theming and layout customization
- Markdown extensions (e.g., ::todo, ==highlight==)
- Widget filters (e.g., only show TODOs)
- Drag-and-drop layout
- Syntax highlighting for code blocks
- Offline PWA support
- Local authentication

---
**Built for tinkerers and productivity nerds.**
