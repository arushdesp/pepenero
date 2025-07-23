// Pepenero - Enhanced Markdown Dashboard
class PepeneroApp {
  constructor() {
    this.currentNote = null;
    this.isEditing = false;
    this.saveTimeout = null;
    this.searchTimeout = null;
    this.notes = [];
    this.folderStructure = {};
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.loadNotes();
    this.setupSearch();
    this.route();
  }
  
  setupEventListeners() {
    window.addEventListener('hashchange', () => this.route());
    window.addEventListener('click', (e) => this.handleClick(e));
  }
  
  setupSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        this.hideSearchResults();
      }
    });
  }
  
  async performSearch(query) {
    if (!query.trim()) {
      this.hideSearchResults();
      return;
    }
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await response.json();
      this.showSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  }
  
  showSearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
    } else {
      resultsContainer.innerHTML = results.map(result => `
        <div class="search-result" data-path="${result.path}">
          <div class="search-result-title">${result.title}</div>
          <div class="search-result-path">${result.path}</div>
        </div>
      `).join('');
    }
    resultsContainer.style.display = 'block';
  }
  
  hideSearchResults() {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.style.display = 'none';
  }
  
  async loadNotes() {
    try {
      const response = await fetch('/api/notes');
      this.notes = await response.json();
      this.buildFolderStructure();
      this.renderSidebar();
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }
  
  buildFolderStructure() {
    this.folderStructure = {};
    
    this.notes.forEach(note => {
      const parts = note.split('/');
      let current = this.folderStructure;
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = { folders: {}, files: [] };
        }
        current = current[part].folders;
      }
      
      const fileName = parts[parts.length - 1];
      current[fileName] = { type: 'file', path: note };
    });
  }
  
  renderSidebar() {
    const sidebarContent = document.getElementById('sidebar-content');
    sidebarContent.innerHTML = this.renderFolderTree(this.folderStructure);
  }
  
  renderFolderTree(structure, level = 0) {
    let html = '';
    
    for (const [name, item] of Object.entries(structure)) {
      if (item.type === 'file') {
        html += `
          <div class="sidebar-item sidebar-file" data-path="${item.path}" style="padding-left: ${level * 20}px">
            <span class="file-icon">📄</span>
            <span class="file-name">${name}</span>
          </div>
        `;
      } else {
        const hasContent = Object.keys(item.folders).length > 0 || item.files.length > 0;
        html += `
          <div class="sidebar-folder" data-folder="${name}">
            <div class="sidebar-item folder-header" style="padding-left: ${level * 20}px">
              <span class="folder-icon">📁</span>
              <span class="folder-name">${name}</span>
              ${hasContent ? '<span class="folder-toggle">▼</span>' : ''}
            </div>
            <div class="folder-content" style="display: none;">
              ${this.renderFolderTree(item.folders, level + 1)}
            </div>
          </div>
        `;
      }
    }
    
    return html;
  }
  
  handleClick(e) {
    // Handle sidebar file clicks
    if (e.target.closest('.sidebar-file')) {
      const path = e.target.closest('.sidebar-file').dataset.path;
      window.location.hash = `#/note/${encodeURIComponent(path)}`;
    }
    
    // Handle folder toggles
    if (e.target.closest('.folder-header')) {
      const folder = e.target.closest('.sidebar-folder');
      const content = folder.querySelector('.folder-content');
      const toggle = folder.querySelector('.folder-toggle');
      
      if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▼';
      } else {
        content.style.display = 'none';
        toggle.textContent = '▶';
      }
    }
    
    // Handle search result clicks
    if (e.target.closest('.search-result')) {
      const path = e.target.closest('.search-result').dataset.path;
      window.location.hash = `#/note/${encodeURIComponent(path)}`;
      this.hideSearchResults();
    }
    
    // Handle wiki-links
    if (e.target.matches('.wiki-link')) {
      e.preventDefault();
      const href = e.target.getAttribute('href');
      window.location.hash = href;
    }
  }
  
  async route() {
    const hash = window.location.hash.slice(1);
    const main = document.getElementById('main');
    
    if (hash.startsWith('/note/')) {
      const notePath = decodeURIComponent(hash.slice(6));
      await this.showNote(notePath);
    } else if (hash === '/notes') {
      await this.showNotesList();
    } else if (hash.startsWith('/search')) {
      const params = new URLSearchParams(hash.split('?')[1]);
      const query = params.get('q');
      await this.showSearchPage(query);
    } else {
      // Default to notes list
      window.location.hash = '#/notes';
    }
  }
  
  async showNotesList() {
    const main = document.getElementById('main');
    main.innerHTML = `
      <div class="notes-list">
        <h2>All Notes</h2>
        <div class="notes-grid">
          ${this.notes.map(note => `
            <div class="note-card" data-path="${note}">
              <h3>${note.split('/').pop().replace('.md', '')}</h3>
              <p class="note-path">${note}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  async showSearchPage(query) {
    const main = document.getElementById('main');
    main.innerHTML = `
      <div class="search-page">
        <h2>Search Results</h2>
        <p>Searching for: "${query}"</p>
        <div id="search-page-results"></div>
      </div>
    `;
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await response.json();
      
      const resultsContainer = document.getElementById('search-page-results');
      if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
      } else {
        resultsContainer.innerHTML = results.map(result => `
          <div class="search-result-card" data-path="${result.path}">
            <h3>${result.title}</h3>
            <p class="result-path">${result.path}</p>
          </div>
        `).join('');
      }
    } catch (error) {
      main.innerHTML = '<div class="error">Error performing search</div>';
    }
  }
  
  async showNote(notePath) {
    const main = document.getElementById('main');
    main.innerHTML = '<div class="loading">Loading note...</div>';
    
    try {
      const response = await fetch(`/api/notes/${encodeURIComponent(notePath)}`);
      const note = await response.json();
      
      this.currentNote = notePath;
      main.innerHTML = `
        <div class="note-view">
          <div class="note-header">
            <h2 class="note-title">${note.title}</h2>
            <div class="note-actions">
              <button class="btn btn-edit" id="edit-btn">Edit</button>
              <div class="save-actions" style="display: none;">
                <button class="btn btn-save" id="save-btn">Save</button>
                <button class="btn btn-cancel" id="cancel-btn">Cancel</button>
                <span class="save-status" id="save-status"></span>
              </div>
            </div>
          </div>
          <div class="note-content">
            <div class="note-display" id="note-display">${note.html}</div>
            <div class="note-edit" id="note-edit" style="display: none;">
              <div class="edit-container">
                <textarea id="note-textarea" class="note-textarea">${note.markdown}</textarea>
                <div class="note-preview" id="note-preview"></div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      this.setupNoteEditing();
    } catch (error) {
      main.innerHTML = '<div class="error">Note not found</div>';
    }
  }
  
  setupNoteEditing() {
    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const textarea = document.getElementById('note-textarea');
    const display = document.getElementById('note-display');
    const edit = document.getElementById('note-edit');
    const saveActions = document.querySelector('.save-actions');
    const saveStatus = document.getElementById('save-status');
    
    editBtn.addEventListener('click', () => {
      this.isEditing = true;
      editBtn.style.display = 'none';
      saveActions.style.display = 'flex';
      display.style.display = 'none';
      edit.style.display = 'block';
      textarea.focus();
    });
    
    cancelBtn.addEventListener('click', () => {
      this.isEditing = false;
      editBtn.style.display = 'inline-block';
      saveActions.style.display = 'none';
      display.style.display = 'block';
      edit.style.display = 'none';
      this.hideSaveStatus();
    });
    
    saveBtn.addEventListener('click', () => this.saveNote());
    
    // Live preview
    textarea.addEventListener('input', () => {
      this.updatePreview(textarea.value);
    });
    
    // Auto-save on typing (with debounce)
    textarea.addEventListener('input', () => {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = setTimeout(() => {
        this.autoSave(textarea.value);
      }, 2000);
    });
  }
  
  updatePreview(markdown) {
    const preview = document.getElementById('note-preview');
    // Simple markdown preview (basic implementation)
    const html = this.simpleMarkdownToHtml(markdown);
    preview.innerHTML = html;
  }
  
  simpleMarkdownToHtml(markdown) {
    // Basic markdown to HTML conversion for preview
    return markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
  
  async saveNote() {
    const textarea = document.getElementById('note-textarea');
    const saveStatus = document.getElementById('save-status');
    
    try {
      saveStatus.textContent = 'Saving...';
      saveStatus.className = 'save-status saving';
      
      const response = await fetch(`/api/notes/${encodeURIComponent(this.currentNote)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawMarkdown: textarea.value })
      });
      
      if (response.ok) {
        saveStatus.textContent = 'Saved!';
        saveStatus.className = 'save-status saved';
        setTimeout(() => this.hideSaveStatus(), 2000);
        
        // Reload the note to get updated HTML with wiki-links
        await this.showNote(this.currentNote);
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      saveStatus.textContent = 'Error saving';
      saveStatus.className = 'save-status error';
      setTimeout(() => this.hideSaveStatus(), 3000);
    }
  }
  
  async autoSave(markdown) {
    try {
      await fetch(`/api/notes/${encodeURIComponent(this.currentNote)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawMarkdown: markdown })
      });
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }
  
  hideSaveStatus() {
    const saveStatus = document.getElementById('save-status');
    if (saveStatus) {
      saveStatus.textContent = '';
      saveStatus.className = 'save-status';
    }
  }
}

// Initialize the app
new PepeneroApp();
