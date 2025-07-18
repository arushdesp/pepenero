// dashboardRenderer.js
// Transforms Markdown files to HTML widgets using marked
import fs from 'fs';
import { marked } from 'marked';

export function createDashboardRenderer(config) {
  // Load all widgets initially
  let widgets = config.widgets.map(w => loadWidget(w));

  function loadWidget(widgetConfig) {
    let content = '';
    try {
      content = fs.readFileSync(widgetConfig.file, 'utf-8');
    } catch (e) {
      content = '*File not found*';
    }
    return {
      ...widgetConfig,
      html: marked.parse(content)
    };
  }

  function reloadWidget(filePath) {
    widgets = widgets.map(w =>
      w.file === filePath ? loadWidget(w) : w
    );
  }

  function getWidgets() {
    return widgets;
  }

  return { getWidgets, reloadWidget };
} 