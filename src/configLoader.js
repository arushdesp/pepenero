import fs from 'fs-extra';
import path from 'path';

export function loadConfig(configPath) {
  if (!fs.existsSync(configPath)) throw new Error('config.json not found');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  if (!config.notesDirectory) throw new Error('config.json must have notesDirectory');
  return config;
}
