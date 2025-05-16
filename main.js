let links = JSON.parse(localStorage.getItem('shortify_links') || '[]');

function save() {
  localStorage.setItem('shortify_links', JSON.stringify(links));
}

function renderLinks() {
  document.getElementById('links').innerHTML = links.map((l,i) =>
    `<div class="link-row">
      <span><b>${l.alias}</b> ➔</span>
      <a href="${l.url}" target="_blank">${l.url}</a>
      <button onclick="copyToClipboard('${window.location.href.split('#')[0]}#${l.alias}')">Copy Link</button>
      <button onclick="editLink(${i})">Edit</button>
      <button onclick="delLink(${i})">Delete</button>
    </div>`
  ).join('');
}

function addLink() {
  const alias = document.getElementById('aliasInput').value.trim();
  const url = document.getElementById('urlInput').value.trim();
  if (!alias || !url) return alert('Fill both fields!');
  if (!/^https?:\/\//.test(url)) return alert('URL must start with http:// or https://');
  if (links.some(l => l.alias === alias)) return alert('Alias already exists!');
  links.push({alias, url});
  save(); renderLinks();
  document.getElementById('aliasInput').value = '';
  document.getElementById('urlInput').value = '';
}

function delLink(i) {
  links.splice(i,1);
  save(); renderLinks();
}

function editLink(i) {
  const newAlias = prompt('Edit alias:', links[i].alias);
  const newUrl = prompt('Edit URL:', links[i].url);
  if (newAlias && newUrl && /^https?:\/\//.test(newUrl)) {
    if (links.some((l,idx) => l.alias === newAlias && idx !== i)) return alert('Alias already exists!');
    links[i] = {alias: newAlias, url: newUrl};
    save(); renderLinks();
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => alert('Short link copied!'));
}

function clearAll() {
  if (confirm('Clear all short links?')) {
    links = [];
    save();
    renderLinks();
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('shortify_theme', document.body.classList.contains('dark')?'dark':'');
}

// REDIRECTION ON LOAD
window.onload = () => {
  if (localStorage.getItem('shortify_theme') === 'dark') document.body.classList.add('dark');
  renderLinks();
  // Handle redirection via hash
  const hash = window.location.hash.slice(1);
  if (hash) {
    const found = links.find(l => l.alias === hash);
    if (found) window.location.href = found.url;
  }
};
