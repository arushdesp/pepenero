import express from 'express';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { loadConfig } from './config.js';
import { startFileWatcher } from './fileWatcher.js';
import { createDashboardRenderer } from './dashboardRenderer.js';
import { startWebSocketServer } from './socket.js';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Accept the target directory as a command-line argument
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

// Load config from the target directory
const configPath = path.join(targetDir, 'config.json');
let config;
if (fs.existsSync(configPath)) {
  config = loadConfig(configPath);
} else {
  // Fallback: generate config from all .md files in the target directory
  const mdFiles = (await fs.readdir(targetDir)).filter(f => f.endsWith('.md'));
  config = {
    port: 3000,
    widgets: mdFiles.map(f => ({ file: path.join(targetDir, f), title: f.replace('.md', '') }))
  };
}

if (!Array.isArray(config.widgets)) {
  // Autodetect .md files if widgets is missing
  const mdFiles = (await fs.readdir(targetDir)).filter(f => f.endsWith('.md'));
  config.widgets = mdFiles.map(f => ({ file: path.join(targetDir, f), title: f.replace('.md', '') }));
}

const app = express();
const server = http.createServer(app);

// Serve static files from the dashboard's public directory
app.use(express.static(path.join(__dirname, 'public')));

// Dashboard renderer (returns HTML for all widgets)
const dashboardRenderer = createDashboardRenderer(config);

app.get('/api/widgets', (req, res) => {
  res.json(dashboardRenderer.getWidgets());
});

// Start file watcher and WebSocket server
startFileWatcher(config, dashboardRenderer, server);
startWebSocketServer(server, dashboardRenderer);

const PORT = config.port || 3000;
server.listen(PORT, () => {
  console.log(`Dashboard running at http://localhost:${PORT}`);
  console.log(`Serving Markdown files from: ${targetDir}`);
}); 