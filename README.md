# Markdown Dashboard: Your Local Knowledge Base

A fast, minimalist, local-first web application that turns a directory of Markdown files into a beautiful, auto-updating, customizable personal dashboard. Your own digital command center — built entirely on your machine, respecting privacy, speed, and simplicity.

## 🚀 Features

- **Local File System as Source of Truth**: Reads content directly from your Markdown files. No cloud, no DB, no telemetry.
- **Dynamic Note Listing**: Browse all Markdown files in your configured `notesDirectory` and its subdirectories.
- **Single Page Dashboard & Note Viewer**: Navigate between a configurable dashboard view and individual note views, all within a single web interface.
- **Live Updating**: Real-time updates via WebSocket when Markdown files change.
- **Configurable Widgets**: Define specific Markdown files to display as fixed "widgets" on the dashboard view via `dashboardWidgets` in `config.json`.
- **In-Browser Editing**: Edit notes directly in the browser with a simple textarea and save/cancel functionality.
- **Enhanced CLI**: Manage your dashboard instances and notes with `pepenero-cli` (init, add, open, start, stop, help).
- **Code Format Data Views**: Special Markdown blocks (```dataview) are visually highlighted in the UI.
- **Clean, Modular Architecture**: Easy to extend and hack.

## 🛠 Setup

### Local Development
1. Clone/download this repo.
2. `npm install`
3. Organize your Markdown files in a dedicated `notes` directory (or whatever `notesDirectory` you define in `config.json`).
4. Edit `config.json` to define your server port, the `notesDirectory`, and optional `dashboardWidgets`.
5. `npm start` or `node server.js`
6. Open [http://localhost:3000](http://localhost:3000) (or your configured port).

### Global Installation (for end users)
```bash
# Install globally
npm install -g pepenero

# Use anywhere without setup
pepenero-cli serve /path/to/your/markdown/files
pepenero-cli start /path/to/your/markdown/files
```

### Publishing to npm
```bash
# Login to npm
npm login

# Publish
npm publish

# Users can then install with:
npm install -g pepenero
```

## 📝 Usage

- **Dashboard View:** `http://localhost:PORT/#/dashboard` — shows widgets defined in `dashboardWidgets`.
- **Notes List View:** `http://localhost:PORT/#/notes` — lists all `.md` files in your `notesDirectory`.
- **Single Note View:** `http://localhost:PORT/#/note/path/to/your-note.md` — view or edit a note.
- **Edit in Browser:** Click "Edit" on a note, modify in the textarea, and click "Save".
- **CLI:**
  - `pepenero-cli serve [directory]` — Serve any folder as a Markdown dashboard (no setup required).
  - `pepenero-cli start [directory]` — Start the dashboard server (works with or without config).
  - `pepenero-cli init [directory]` — Initialize a new dashboard instance.
  - `pepenero-cli add <filename.md> [content]` — Add a new note.
  - `pepenero-cli open <filename.md>` — Open a note in your browser.
  - `pepenero-cli stop [directory]` — Show stop instructions.
  - `pepenero-cli --help` — Show help.

## ⚙️ config.json Schema

```json
{
  "port": 3000,
  "notesDirectory": "./notes",
  "dashboardWidgets": [
    { "file": "daily-log.md", "title": "Today's Log" },
    { "file": "tasks.md", "title": "My Tasks" }
  ]
}
```
- `port`: (optional, defaults to 3000) The port to run the server on.
- `notesDirectory`: The path (relative to server.js) where your Markdown files are stored.
- `dashboardWidgets`: Array of objects defining which Markdown files to show on the dashboard.
  - `file`: Path to the Markdown file, relative to notesDirectory.
  - `title`: Title to display for this widget.

## 📂 Folder Structure

```
.
├── server.js
├── config.json
├── package.json
├── README.md
├── notes/
│   ├── daily-log.md
│   ├── tasks.md
│   └── project/
│       └── meeting-notes.md
├── src/
│   ├── configLoader.js
│   ├── fileWatcher.js
│   ├── markdownService.js
│   └── socketServer.js
└── public/
    ├── index.html
    ├── app.js
    └── style.css
```

## 💡 Extension Ideas
- In-browser editing with Markdown preview
- New note creation from the UI
- Inter-note linking (Wiki-links)
- Full-text search
- Markdown extensions (checkboxes, diagrams)
- Other file formats (txt, csv, json)
- Theming and layout options
- CLI integration for more actions
- Drag-and-drop widget reordering
- Syntax highlighting for code blocks

---
**Built for tinkerers and productivity nerds.**
