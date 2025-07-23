import express from 'express';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

import { readMarkdown, writeMarkdown, renderMarkdown, getAllMarkdownFiles, extractTitle } from './src/markdownService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const isServeMode = process.env.PEPENERO_SERVE === '1'; // set by CLI for serve
const singleFilePath = process.env.PEPENERO_SINGLE_FILE; // set by CLI for single file serve

let config, notesDir;

if (singleFilePath) {
  notesDir = path.dirname(singleFilePath);
  config = { port: 3000 };
} else if (fs.existsSync(path.join(targetDir, 'config.json'))) {
  const configPath = path.join(targetDir, 'config.json');
  config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  notesDir = targetDir;
} else {
  // Auto-detect mode: treat targetDir as notes directory
  if (!fs.existsSync(targetDir)) {
    throw new Error(`Directory not found: ${targetDir}`);
  }
  notesDir = targetDir;
  config = { port: 3000 };
}

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Recursively list all .md files in notesDir
function walk(dir, base = '') {
  if (singleFilePath) {
    return [path.relative(dir, singleFilePath)];
  }
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) return walk(path.join(dir, entry.name), rel);
    if (entry.isFile() && entry.name.endsWith('.md')) return [rel];
    return [];
  });
}

// List all notes
app.get('/api/notes', (req, res) => {
  try {
    res.json(walk(notesDir));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get a single note (raw and rendered)
app.get('/api/notes/*', async (req, res) => {
  try {
    const relPath = req.params[0];
    if (singleFilePath && path.resolve(notesDir, relPath) !== singleFilePath) {
      return res.status(404).json({ error: 'Only the specified file can be accessed.' });
    }
    const markdown = await readMarkdown(notesDir, relPath);
    const availableFiles = singleFilePath ? [path.basename(singleFilePath)] : await getAllMarkdownFiles(notesDir);
    const title = extractTitle(markdown);
    res.json({ 
      markdown, 
      html: renderMarkdown(markdown, availableFiles),
      title: title || path.basename(relPath, '.md')
    });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

// Save a note (PUT)
app.put('/api/notes/*', async (req, res) => {
  try {
    const relPath = req.params[0];
    if (singleFilePath && path.resolve(notesDir, relPath) !== singleFilePath) {
      return res.status(403).json({ error: 'Modifying other files is not allowed in single file serve mode.' });
    }
    const { rawMarkdown } = req.body;
    if (typeof rawMarkdown !== 'string') throw new Error('Missing rawMarkdown');
    await writeMarkdown(notesDir, relPath, rawMarkdown);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});



// Search endpoint
app.get('/api/search', async (req, res) => {
  if (singleFilePath) {
    return res.json([]); // Search is not applicable in single file serve mode
  }
  try {
    const query = req.query.q;
    if (!query || query.trim().length === 0) {
      return res.json([]);
    }
    
    const searchQuery = query.toLowerCase();
    const allFiles = await getAllMarkdownFiles(notesDir);
    const results = [];
    
    for (const file of allFiles) {
      try {
        const content = await readMarkdown(notesDir, file);
        if (content.toLowerCase().includes(searchQuery)) {
          const title = extractTitle(content) || path.basename(file, '.md');
          results.push({
            path: file,
            title: title,
            filename: path.basename(file, '.md')
          });
        }
      } catch (e) {
        // Skip files that can't be read
        continue;
      }
    }
    
    // Sort by relevance (files with title matches first, then filename matches)
    results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(searchQuery);
      const bTitleMatch = b.title.toLowerCase().includes(searchQuery);
      const aFilenameMatch = a.filename.toLowerCase().includes(searchQuery);
      const bFilenameMatch = b.filename.toLowerCase().includes(searchQuery);
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      if (aFilenameMatch && !bFilenameMatch) return -1;
      if (!aFilenameMatch && bFilenameMatch) return 1;
      return a.path.localeCompare(b.path);
    });
    
    // Limit results
    res.json(results.slice(0, 50));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = config.port || 3000;
server.listen(PORT, () => {
  console.log(`Dashboard running at http://localhost:${PORT}`);
  console.log(`Serving content from: ${notesDir}`);
}); 