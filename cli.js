#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';

const program = new Command();
const cwd = process.cwd();

program
  .name('pepenero-cli')
  .description('Pepenero Markdown Dashboard CLI')
  .version('1.0.0');

program
  .command('init [directory]')
  .description('Initialize a new Pepenero dashboard instance')
  .action(async (directory = '.') => {
    const target = path.resolve(directory);
    await fs.ensureDir(target);
    // Copy template files (public, src, config.json, server.js, package.json, notes/)
    const here = path.dirname(new URL(import.meta.url).pathname);
    const filesToCopy = ['server.js', 'package.json', 'config.json', 'README.md'];
    for (const file of filesToCopy) {
      await fs.copy(path.join(here, file), path.join(target, file), { overwrite: false });
    }
    await fs.copy(path.join(here, 'public'), path.join(target, 'public'), { overwrite: false });
    await fs.copy(path.join(here, 'src'), path.join(target, 'src'), { overwrite: false });
    await fs.ensureDir(path.join(target, 'notes'));
    console.log(`Pepenero dashboard initialized in ${target}`);
    console.log('Run: cd', target, '&& npm install && npm start');
  });

program
  .command('add <filename> [content]')
  .description('Add a new Markdown note')
  .action(async (filename, content = '') => {
    // If notes/ exists, use it; else, use cwd
    const notesDir = fs.existsSync(path.join(cwd, 'notes')) ? path.join(cwd, 'notes') : cwd;
    await fs.ensureDir(notesDir);
    const filePath = path.join(notesDir, filename);
    if (await fs.pathExists(filePath)) {
      console.error('File already exists:', filePath);
      process.exit(1);
    }
    await fs.writeFile(filePath, content, 'utf-8');
    console.log('Created:', filePath);
  });

program
  .command('open <filename>')
  .description('Open a note in the browser')
  .action(async (filename) => {
    const config = JSON.parse(await fs.readFile(path.join(cwd, 'config.json'), 'utf-8'));
    const port = config.port || 3000;
    const open = (await import('open')).default;
    await open(`http://localhost:${port}/#/note/${encodeURIComponent(filename)}`);
  });

program
  .command('start [directory]')
  .description('Start the Pepenero dashboard server')
  .action((directory = '.') => {
    const target = path.resolve(directory);
    const here = path.dirname(new URL(import.meta.url).pathname);
    
    // Check if target has server.js (initialized project)
    if (fs.existsSync(path.join(target, 'server.js'))) {
      spawn('node', ['server.js'], { cwd: target, stdio: 'inherit' });
    } else {
      // Auto-serve mode: treat directory as notes folder
      const serverPath = path.join(here, 'server.js');
      
      // Verify server.js exists
      if (!fs.existsSync(serverPath)) {
        console.error('Error: server.js not found. Make sure pepenero is properly installed.');
        process.exit(1);
      }
      
      const env = { ...process.env, PEPENERO_SERVE: '1' };
      console.log(`Starting dashboard for ${target}...`);
      spawn('node', [serverPath, target], { cwd: here, stdio: 'inherit', env });
    }
  });

program
  .command('serve [directory]')
  .description('Serve any folder as a Markdown dashboard (no copying, just view)')
  .action((directory = '.') => {
    const target = path.resolve(directory);
    
    // Find the package directory (works for both local and global installation)
    const here = path.dirname(new URL(import.meta.url).pathname);
    const serverPath = path.join(here, 'server.js');
    
    // Verify server.js exists
    if (!fs.existsSync(serverPath)) {
      console.error('Error: server.js not found. Make sure pepenero is properly installed.');
      process.exit(1);
    }
    
    const env = { ...process.env, PEPENERO_SERVE: '1' };
    console.log(`Serving ${target} as a Markdown dashboard...`);
    spawn('node', [serverPath, target], { cwd: here, stdio: 'inherit', env });
  });

program
  .command('stop [directory]')
  .description('Show instructions to stop the server')
  .action(() => {
    console.log('To stop the dashboard, use: pkill -f server.js (Linux/macOS) or Task Manager (Windows)');
  });

// Always run CLI logic when this file is executed directly
program.parse(process.argv);