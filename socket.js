// socket.js
// WebSocket server for live updates
import WebSocket, { WebSocketServer } from 'ws';

export function startWebSocketServer(server, dashboardRenderer) {
  const wss = new WebSocketServer({ server });

  // Broadcast widget updates to all clients
  function broadcastWidgetUpdate(filePath) {
    const widgets = dashboardRenderer.getWidgets();
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'update', widgets }));
      }
    });
  }

  // Listen for widget change events from fileWatcher
  server.on('widgetChanged', broadcastWidgetUpdate);

  wss.on('connection', ws => {
    // Send initial widgets
    ws.send(JSON.stringify({ type: 'init', widgets: dashboardRenderer.getWidgets() }));
  });
} 