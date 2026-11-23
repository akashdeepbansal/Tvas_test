const tree = document.querySelector('#category-tree');
const items = () => [...tree.querySelectorAll('[role="treeitem"]')].filter(item => !item.closest('[hidden]'));
const gridRows = [...document.querySelectorAll('#product-grid [role="row"]:not(.grid-header)')];
const status = document.querySelector('#selection-status');
const count = document.querySelector('#result-count');
const layout = document.querySelector('#split-layout');
const splitter = document.querySelector('#splitter');

function setExpanded(item, expanded) {
  if (!item.hasAttribute('aria-expanded')) return;
  const group = item.querySelector(':scope > [role="group"]');
  item.setAttribute('aria-expanded', String(expanded));
  item.querySelector('.tree-toggle').textContent = expanded ? '−' : '+';
  group.hidden = !expanded;
}
function selectCategory(item) {
  [...tree.querySelectorAll('[role="treeitem"]')].forEach(node => node.classList.toggle('selected', node === item));
  const category = item.dataset.category;
  let shown = 0;
  gridRows.forEach(row => { const visible = category === 'All' || row.dataset.category === category || (category === 'Women' && ['Dresses','Tops','Tailoring'].includes(row.dataset.category)) || (category === 'Men' && ['Shirts','Trousers','Outerwear'].includes(row.dataset.category)); row.hidden = !visible; if (visible) shown += 1; });
  document.querySelector('#grid-title').textContent = category === 'All' ? 'All styles' : category;
  count.textContent = `${shown} ${shown === 1 ? 'style' : 'styles'}`;
  status.textContent = `${category} selected. ${shown} ${shown === 1 ? 'style' : 'styles'} shown.`;
}
tree.addEventListener('click', event => { const item = event.target.closest('[role="treeitem"]'); if (!item) return; if (item.hasAttribute('aria-expanded')) setExpanded(item, item.getAttribute('aria-expanded') !== 'true'); selectCategory(item); item.focus(); });
tree.addEventListener('keydown', event => { const current = event.target.closest('[role="treeitem"]'); if (!current) return; const visible = items(); const index = visible.indexOf(current); let target; if (event.key === 'ArrowDown') target = visible[index + 1] || current; if (event.key === 'ArrowUp') target = visible[index - 1] || current; if (event.key === 'Home') target = visible[0]; if (event.key === 'End') target = visible.at(-1); if (target) { event.preventDefault(); current.tabIndex = -1; target.tabIndex = 0; target.focus(); } if (event.key === 'ArrowRight' && current.hasAttribute('aria-expanded')) { event.preventDefault(); if (current.getAttribute('aria-expanded') === 'false') setExpanded(current, true); else current.querySelector(':scope > [role="group"] [role="treeitem"]').focus(); } if (event.key === 'ArrowLeft') { event.preventDefault(); if (current.hasAttribute('aria-expanded') && current.getAttribute('aria-expanded') === 'true') setExpanded(current, false); else { const parent = current.parentElement.closest('[role="treeitem"]'); if (parent) parent.focus(); } } if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (current.hasAttribute('aria-expanded')) setExpanded(current, current.getAttribute('aria-expanded') !== 'true'); selectCategory(current); } });
function selectRow(row) { gridRows.forEach(item => item.setAttribute('aria-selected', String(item === row))); status.textContent = `${row.querySelector('[role="gridcell"]').textContent.trim()} selected.`; }
gridRows.forEach((row, index) => { row.addEventListener('click', () => selectRow(row)); row.addEventListener('keydown', event => { let next; if (event.key === 'ArrowDown') next = gridRows[index + 1] || row; if (event.key === 'ArrowUp') next = gridRows[index - 1] || row; if (event.key === 'Home') next = gridRows[0]; if (event.key === 'End') next = gridRows.at(-1); if (next) { event.preventDefault(); row.tabIndex = -1; next.tabIndex = 0; next.focus(); } if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectRow(row); } }); });
function resize(value) { const width = Math.max(240, Math.min(520, value)); layout.style.setProperty('--nav-width', `${width}px`); splitter.setAttribute('aria-valuenow', width); }
splitter.addEventListener('keydown', event => { const now = Number(splitter.getAttribute('aria-valuenow')); if (event.key === 'ArrowLeft') { event.preventDefault(); resize(now - 10); } if (event.key === 'ArrowRight') { event.preventDefault(); resize(now + 10); } if (event.key === 'Home') { event.preventDefault(); resize(240); } if (event.key === 'End') { event.preventDefault(); resize(520); } });
splitter.addEventListener('pointerdown', event => { splitter.setPointerCapture(event.pointerId); const bounds = layout.getBoundingClientRect(); const move = pointer => resize(pointer.clientX - bounds.left); const end = () => { splitter.removeEventListener('pointermove', move); splitter.removeEventListener('pointerup', end); }; splitter.addEventListener('pointermove', move); splitter.addEventListener('pointerup', end); });
