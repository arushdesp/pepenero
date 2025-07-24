## [1.0.3](https://github.com/arushdesp/pepenero/compare/v1.0.2...v1.0.3) (2025-07-24)


### Bug Fixes

* address a small bug in the content display ([ce9eb5a](https://github.com/arushdesp/pepenero/commit/ce9eb5a1492a1f36f56cab2f1dbe952361144d20))

# 1.0.0 (2025-07-24)


### Bug Fixes

* Move jest to devDependencies for proper package structure ([6751cc9](https://github.com/arushdesp/pepenero/commit/6751cc961330254f168a2c8aa085835279e29aba))


### Features

* Add professional knowledge management features ([31f4dff](https://github.com/arushdesp/pepenero/commit/31f4dff21bb955d9318b4e1fa1961fe44f29b761))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-07-23

### Changed
- Renamed CLI executable from `pepenero-cli` to `pepe`.
- Refined `serve` command to support serving single Markdown files (`--file` option).
- Streamlined `start` command to exclusively run initialized projects.
- Removed `configLoader.js` by integrating its logic into `server.js`.
- Removed unused `chokidar` and `ws` dependencies.
- Updated `README.md` to accurately reflect current features and file structure, and clarify `config.json` as optional.
- Removed misleading "Live Updating" feature from documentation.
- Updated `package.json` scripts and repository URLs.
- Fixed syntax error in `package.json`.
- Updated `cli.js` description for `start` and `stop` commands.
- Updated `server.js` console log for serving content.

### Removed
- `init` command (no longer needed for project setup).
- `notesDirectory` and `dashboardWidgets` features from codebase and documentation.
- `config.json` creation from `pepe init` command.
- `config.json` file from repository root.
- `chokidar` and `ws` dependencies (no longer used for live updates).
- `configLoader.js` (logic integrated into `server.js`).
- Placeholder `test` script from `package.json`.
- `/api/widgets` endpoint from `server.js`.
- Dashboard-related UI elements and logic from `public/app.js`, `public/index.html`, and `public/style.css`.

## [1.0.1] - 2025-07-23

### Changed
- Refined `serve` command to support serving single Markdown files (`--file` option).
- Streamlined `start` command to exclusively run initialized projects.
- Removed `configLoader.js` by integrating its logic into `server.js`.
- Removed unused `chokidar` and `ws` dependencies.
- Updated `README.md` to accurately reflect current features and file structure, and clarify `config.json` as optional.
- Removed misleading "Live Updating" feature from documentation.
- Updated `package.json` scripts and repository URLs.
- Fixed syntax error in `package.json`.

### Removed
- `init` command (no longer needed for project setup).
- `notesDirectory` and `dashboardWidgets` features from codebase and documentation.
- `config.json` creation from `pepe init` command.
- `chokidar` and `ws` dependencies (no longer used for live updates).
- `configLoader.js` (logic integrated into `server.js`).
- Placeholder `test` script from `package.json`.
- `/api/widgets` endpoint from `server.js`.

## [1.0.0] - 2024-07-18

### Added
- Initial release of Pepenero Markdown Dashboard
- Local-first web application for viewing Markdown files
- Real-time updates via WebSocket
- Configurable dashboard widgets
- In-browser Markdown editing
- CLI tool with multiple commands (init, add, open, start, serve, stop)
- Auto-detection of Markdown files in any directory
- Special dataview block highlighting
- Single Page Application (SPA) frontend
- Modular architecture with separate modules for config, markdown, and file watching

### Features
- **serve command**: Serve any folder as a Markdown dashboard without setup
- **start command**: Smart command that works with or without config files
- **Global installation support**: Install once, use anywhere
- **Live reloading**: Changes to Markdown files update in real-time
- **Responsive design**: Works on desktop and mobile
- **Clean UI**: Minimalist interface focused on content

### Technical
- Node.js with Express server
- ES6 modules throughout
- WebSocket for live updates
- File system as source of truth
- No database or cloud dependencies
