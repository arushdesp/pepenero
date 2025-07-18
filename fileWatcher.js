// fileWatcher.js
// Watches Markdown files and notifies dashboard and WebSocket server on changes
import chokidar from 'chokidar';

export function startFileWatcher(config, dashboardRenderer, server) {
  const widgetFiles = config.widgets.map(w => w.file);
  const watcher = chokidar.watch(widgetFiles, { ignoreInitial: true });

  watcher.on('change', filePath => {
    dashboardRenderer.reloadWidget(filePath);
    // Notify WebSocket clients (emit event on server)
    server.emit('widgetChanged', filePath);
  });
} 