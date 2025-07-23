import fs from 'fs-extra';
import path from 'path';
import { marked } from 'marked';

export async function readMarkdown(notesDir, relPath) {
  const absPath = path.join(notesDir, relPath);
  if (!absPath.startsWith(path.resolve(notesDir))) throw new Error('Invalid path');
  const markdown = await fs.readFile(absPath, 'utf-8');
  return markdown;
}

export async function writeMarkdown(notesDir, relPath, content) {
  const absPath = path.join(notesDir, relPath);
  if (!absPath.startsWith(path.resolve(notesDir))) throw new Error('Invalid path');
  await fs.ensureDir(path.dirname(absPath));
  await fs.writeFile(absPath, content, 'utf-8');
}

// Get all markdown files for link validation
export async function getAllMarkdownFiles(notesDir) {
  const files = [];
  
  function walk(dir, base = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const rel = path.join(base, entry.name);
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), rel);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(rel);
      }
    }
  }
  
  walk(notesDir);
  return files;
}

// Extract title from markdown content
export function extractTitle(markdown) {
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();
  
  // Fallback to filename without extension
  return '';
}

export function renderMarkdown(markdown, availableFiles = []) {
  // Process wiki-links first
  const processedMarkdown = processWikiLinks(markdown, availableFiles);
  
  // Highlight dataview blocks with enhanced parsing
  const dataviewRegex = /```dataview\n([\s\S]*?)```/g;
  let html = marked.parse(processedMarkdown.replace(dataviewRegex, (match, code) => {
    const dataviewHtml = renderDataviewBlock(code);
    return `<div class="dataview-block">${dataviewHtml}</div>`;
  }));
  
  return html;
}

function processWikiLinks(markdown, availableFiles) {
  // Convert [[Link Target]] to markdown links
  return markdown.replace(/\[\[([^\]]+)\]\]/g, (match, linkTarget) => {
    const targetFile = linkTarget.endsWith('.md') ? linkTarget : `${linkTarget}.md`;
    const exists = availableFiles.includes(targetFile);
    const className = exists ? 'wiki-link' : 'wiki-link non-existent-link';
    return `<a href="#/note/${encodeURIComponent(targetFile)}" class="${className}">${linkTarget}</a>`;
  });
}

function renderDataviewBlock(code) {
  // Simplified rendering for Dataview blocks.
  // Full Dataview parsing is not implemented.
  return `
    <div class="dataview-block">
      <div class="dataview-header">
        <span class="dataview-icon">🔍</span>
        <span class="dataview-type">Dataview Query</span>
      </div>
      <pre class="dataview-code">${code}</pre>
      <div class="dataview-note">
        <em>Note: Dataview queries are displayed as code blocks. Full rendering is not supported.</em>
      </div>
    </div>
  `;
}
