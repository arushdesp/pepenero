#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';

const program = new Command();
const cwd = process.cwd();

program
  .name('pepe')
  .description(`Pepenero Markdown Dashboard CLI

  config.json is optional and used for advanced configuration (e.g., custom port).`)
  .version('1.0.0');



program
  .command('add <filename> [content]')
  .description('Add a new Markdown file to the current directory')
  .action(async (filename, content = '') => {
    const filePath = path.join(cwd, filename);
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
    let port = 3000; // Default port
    try {
      const configPath = path.join(cwd, 'config.json');
      if (await fs.pathExists(configPath)) {
        const config = JSON.parse(await fs.readFile(configPath, 'utf-8'));
        port = config.port || 3000;
      } else {
        console.warn('config.json not found in current directory. Using default port 3000.');
      }
    } catch (error) {
      console.error('Error reading config.json:', error.message);
      console.warn('Using default port 3000.');
    }
    const open = (await import('open')).default;
    await open(`http://localhost:${port}/#/note/${encodeURIComponent(filename)}`);
  });

program
  .command('start [directory]')
  .description('Start a Pepenero dashboard server for an initialized project')
  .action((directory = '.') => {
    const target = path.resolve(directory);
    
    // Check if target has server.js (initialized project)
    if (fs.existsSync(path.join(target, 'server.js'))) {
      spawn('node', ['server.js'], { cwd: target, stdio: 'inherit' });
    } else {
      console.error(`Error: No Pepenero project found in ${target}. Use 'pepe serve' to serve a directory/file.`);
      process.exit(1);
    }
  });

program
  .command('serve [directory]')
  .description('Serve any folder or a single Markdown file as a dashboard')
  .option('-f, --file <file>', 'Serve a single Markdown file')
  .action((directory = '.', options) => {
    const target = path.resolve(directory);
    const here = path.dirname(new URL(import.meta.url).pathname);
    const serverPath = path.join(here, 'server.js');

    if (!fs.existsSync(serverPath)) {
      console.error('Error: server.js not found. Make sure pepenero is properly installed.');
      process.exit(1);
    }

    const env = { ...process.env, PEPENERO_SERVE: '1' };

    if (options.file) {
      const singleFilePath = path.resolve(options.file);
      if (!fs.existsSync(singleFilePath)) {
        console.error(`Error: File not found: ${singleFilePath}`);
        process.exit(1);
      }
      if (!singleFilePath.endsWith('.md')) {
        console.error(`Error: Only Markdown files (.md) can be served with --file option. Got: ${singleFilePath}`);
        process.exit(1);
      }
      env.PEPENERO_SINGLE_FILE = singleFilePath;
      console.log(`Serving single file: ${singleFilePath}...`);
      spawn('node', [serverPath, path.dirname(singleFilePath)], { cwd: here, stdio: 'inherit', env });
    } else {
      console.log(`Serving ${target} as a Markdown dashboard...`);
      spawn('node', [serverPath, target], { cwd: here, stdio: 'inherit', env });
    }
  });

program
  .command('stop [directory]')
  .description('Show instructions to stop the running Pepenero server')
  .action(() => {
    console.log('To stop the dashboard, use: pkill -f server.js (Linux/macOS) or Task Manager (Windows)');
  });

// Always run CLI logic when this file is executed directly
program.parse(process.argv);