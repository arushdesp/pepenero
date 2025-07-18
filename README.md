# Markdown Dashboard: Your Local Knowledge Base

A fast, minimalist, local-first web application that turns a directory of Markdown files into a beautiful, auto-updating, customizable personal dashboard. Your own digital command center — built entirely on your machine, respecting privacy, speed, and simplicity.

## 🚀 Features

- **Local File System as Source of Truth**: Reads content directly from your Markdown files. No cloud, no DB, no telemetry.
- **Sidebar Navigation**: Hierarchical folder structure with expandable/collapsible folders and clickable files.
- **Live Updating**: Real-time updates via WebSocket when Markdown files change.
- **Configurable Widgets**: Define specific Markdown files to display as fixed "widgets" on the dashboard view via `dashboardWidgets` in `config.json`.
- **Enhanced In-Browser Editing**: Edit notes with live Markdown preview, auto-save, and save status indicators.
- **Inter-Note Linking**: Support for wiki-links `[[Note Name]]` with visual indicators for existing/non-existent links.
- **Full-Text Search**: Search across all notes with real-time results and relevance sorting.
- **Advanced Dataview Blocks**: Enhanced rendering of dataview blocks with query type detection.
- **Professional UI**: Clean, modern interface with responsive design for desktop and mobile.
- **Enhanced CLI**: Manage your dashboard instances and notes with `pepenero-cli` (init, add, open, start, serve, stop, help).
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
- **Single Note View:** `http://localhost:PORT/#/note/path/to/your-note.md` — view or edit a note with live preview.
- **Search:** Use the search bar in the header to find notes across all content.
- **Sidebar Navigation:** Click folders to expand/collapse, click files to open them.
- **Wiki-Links:** Use `[[Note Name]]` syntax to create links between notes.
- **Enhanced Editing:** Click "Edit" on a note for split-screen editing with live preview.
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
- Advanced dataview query execution
- New note creation from the UI
- Markdown extensions (checkboxes, diagrams, tables)
- Other file formats (txt, csv, json)
- Theming and layout options
- Drag-and-drop widget reordering
- Syntax highlighting for code blocks
- Export functionality (PDF, HTML)
- Plugin system for custom renderers
- Collaborative editing features

---
**Built for tinkerers and productivity nerds.**
