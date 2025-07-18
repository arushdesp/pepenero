// client.js
// Fetch widgets, render dashboard, and handle live updates via WebSocket

const dashboard = document.getElementById('dashboard');

function render(widgets) {
  dashboard.innerHTML = '';
  widgets.forEach(widget => {
    const div = document.createElement('div');
    div.className = 'widget';
    div.innerHTML = `
      <div class="widget-title">${widget.title || widget.file}</div>
      <div class="widget-content">${widget.html}</div>
    `;
    dashboard.appendChild(div);
  });
}

// Initial fetch
fetch('/api/widgets')
  .then(res => res.json())
  .then(render);

// WebSocket for live updates
const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
const ws = new WebSocket(`${protocol}://${location.host}`);
ws.onmessage = event => {
  const msg = JSON.parse(event.data);
  if (msg.type === 'update' || msg.type === 'init') {
    render(msg.widgets);
  }
};
