# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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