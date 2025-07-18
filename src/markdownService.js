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

export function renderMarkdown(markdown) {
  // Highlight dataview blocks
  const dataviewRegex = /```dataview\\n([\\s\\S]*?)```/g;
  let html = marked.parse(markdown.replace(dataviewRegex, (match, code) =>
    `<div class="dataview-block"><pre>${code}</pre></div>`
  ));
  return html;
}
