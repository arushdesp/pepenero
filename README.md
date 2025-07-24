# Markdown Dashboard: Your Local Knowledge Base

A fast, minimalist, local-first web application that turns a directory of Markdown files into a beautiful, auto-updating, customizable personal dashboard. Your own digital command center — built entirely on your machine, respecting privacy, speed, and simplicity.

## 🚀 Features

- **Local File System as Source of Truth**: Reads content directly from your Markdown files. No cloud, no DB, no telemetry.
- **Sidebar Navigation**: Hierarchical folder structure with expandable/collapsible folders and clickable files.
- **Enhanced In-Browser Editing**: Edit notes with live Markdown preview, auto-save, and save status indicators.
- **Inter-Note Linking**: Support for wiki-links `[[Note Name]]` with visual indicators for existing/non-existent links.
- **Full-Text Search**: Search across all notes with real-time results and relevance sorting.
- **Advanced Dataview Blocks**: Enhanced rendering of dataview blocks with query type detection.
- **Professional UI**: Clean, modern interface with responsive design for desktop and mobile.
- **Enhanced CLI**: Manage your dashboard instances and notes with `pepe` (add, open, start, serve, stop, help).

## 🛠 Setup

### Local Development
1. Clone/download this repo.
2. `npm install`
3. `npm start` or `node server.js`
4. Open [http://localhost:3000](http://localhost:3000) (or your configured port).

### Global Installation (for end users)
```bash
# Install globally
npm install -g pepenero

# Use anywhere without setup
pepenero serve /path/to/your/markdown/files
```

## 📝 Usage

- **Notes List View:** `http://localhost:PORT/#/notes` — lists all `.md` files in the served directory.
- **Single Note View:** `http://localhost:PORT/#/note/path/to/your-note.md` — view or edit a note with live preview.
- **Search:** Use the search bar in the header to find notes across all content.
- **Sidebar Navigation:** Click folders to expand/collapse, click files to open them.
- **Wiki-Links:** Use `[[Note Name]]` syntax to create links between notes.
- **Enhanced Editing:** Click "Edit" on a note for split-screen editing with live preview.
- **CLI:**
  - `pepe serve [directory]` — Serve any folder as a Markdown dashboard (no setup required).
  - `pepe start [directory]` — Start the dashboard server (works with or without config).
  - `pepe add <filename.md> [content]` — Add a new note.
  - `pepe open <filename.md>` — Open a note in your browser.
  - `pepe stop [directory]` — Show stop instructions.
  - `pepe --help` — Show help.



## 📂 Folder Structure

```
.
├── server.js
├── config.json
├── package.json
├── README.md
├── src/
│   ├── markdownService.js
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
