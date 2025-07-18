#!/usr/bin/env node
// cli.js

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the directory to serve (default: current working directory)
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

console.log(`🚀 Starting Pepenero Dashboard for: ${targetDir}`);

// Ensure the target directory exists
if (!fs.existsSync(targetDir)) {
  console.error(`❌ Directory does not exist: ${targetDir}`);
  process.exit(1);
}

// Start the server from the global install location, passing the target directory
const serverPath = path.join(__dirname, 'server.js');
const serverProcess = spawn('node', [serverPath, targetDir], {
  stdio: 'inherit',
  detached: false
});

serverProcess.on('close', code => {
  process.exit(code);
});