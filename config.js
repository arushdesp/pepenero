// config.js
// Loads and validates config.json
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = path.join(path.dirname(new URL(import.meta.url).pathname), 'config.json');

export function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error('config.json not found. Please create one.');
  }
  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
  let config;
  try {
    config = JSON.parse(raw);
  } catch (e) {
    throw new Error('Invalid config.json: ' + e.message);
  }
  // Only validate widgets if present
  if ('widgets' in config && !Array.isArray(config.widgets)) {
    throw new Error('If present, widgets must be an array.');
  }
  return config;
} 