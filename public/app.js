const $ = sel => document.querySelector(sel);

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  if (hash.startsWith('note/')) showNote(hash.slice(5));
  else if (hash === 'notes') showNotesList();
  else showDashboard();
}

async function showDashboard() {
  $('#main').innerHTML = '<h2>Dashboard</h2><div id="dashboard"></div>';
  const widgets = await fetch('/api/widgets').then(r => r.json());
  $('#dashboard').innerHTML = widgets.map(w =>
    `<div class="widget"><div class="widget-title">${w.title}</div><div>${w.html}</div></div>`
  ).join('');
}

async function showNotesList() {
  $('#main').innerHTML = '<h2>All Notes</h2><ul id="notes-list"></ul>';
  const notes = await fetch('/api/notes').then(r => r.json());
  $('#notes-list').innerHTML = notes.map(f =>
    `<li><a href="#/note/${encodeURIComponent(f)}">${f}</a></li>`
  ).join('');
}

async function showNote(relPath) {
  $('#main').innerHTML = '<div id="note-view">Loading...</div>';
  const resp = await fetch(`/api/notes/${relPath}`);
  if (!resp.ok) return $('#main').innerHTML = '<em>Note not found</em>';
  const data = await resp.json();
  let editMode = false;
  function renderView() {
    $('#main').innerHTML = `
      <div id="note-view">
        <button id="edit-btn">${editMode ? 'Cancel' : 'Edit'}</button>
        <button id="save-btn" style="display:none">Save</button>
        <div id="saving-msg" style="display:none">Saving...</div>
        <div id="note-content">${editMode
          ? `<textarea id="note-editor" style="width:100%;height:300px">${data.markdown}</textarea>`
          : data.html
        }</div>
      </div>
    `;
    $('#edit-btn').onclick = () => {
      editMode = !editMode;
      renderView();
      if (editMode) {
        $('#save-btn').style.display = '';
      }
    };
    $('#save-btn').onclick = async () => {
      const newContent = $('#note-editor').value;
      $('#saving-msg').style.display = '';
      await fetch(`/api/notes/${relPath}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawMarkdown: newContent })
      });
      $('#saving-msg').style.display = 'none';
      editMode = false;
      showNote(relPath); // reload
    };
    if (editMode) $('#save-btn').style.display = '';
  }
  renderView();
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
