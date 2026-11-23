const tabs = [...document.querySelectorAll('[role="tab"]')];
const tablePanel = document.querySelector('#inventory-panel');
const rows = [...document.querySelectorAll('#inventory-rows tr')];
const message = document.querySelector('#status-message');
let messageTimer;
function announce(text) { message.textContent = text; clearTimeout(messageTimer); messageTimer = setTimeout(() => { message.textContent = ''; }, 4000); }
function activateTab(tab) {
  tabs.forEach(item => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; });
  tablePanel.setAttribute('aria-labelledby', tab.id);
  const state = tab.id.split('-')[1];
  if (state === 'all') { tablePanel.hidden = false; rows.forEach(row => row.hidden = false); announce('Showing all products.'); return; }
  tablePanel.hidden = false;
  rows.forEach(row => row.hidden = row.dataset.state !== state);
  announce(`Showing ${state === 'low' ? 'low-stock' : 'out-of-stock'} products.`);
}
tabs.forEach((tab, index) => { tab.addEventListener('click', () => activateTab(tab)); tab.addEventListener('keydown', event => { if (['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; tabs[next].focus(); activateTab(tabs[next]); } }); });
document.querySelector('#filter').addEventListener('click', event => { const pressed = event.currentTarget.getAttribute('aria-pressed') === 'true'; event.currentTarget.setAttribute('aria-pressed', String(!pressed)); rows.forEach(row => row.hidden = !pressed ? row.dataset.state !== 'low' : false); announce(!pressed ? 'Low-stock filter applied.' : 'Low-stock filter cleared.'); });
document.querySelector('#refresh').addEventListener('click', () => announce('Inventory refreshed just now.'));
document.querySelector('#export').addEventListener('click', () => announce('Your inventory CSV is ready to download.'));
document.querySelector('#bulk-edit').addEventListener('click', () => announce('Select products in the next update to bulk edit them.'));
document.querySelector('#add-product').addEventListener('click', () => announce('New product setup is under development.'));
document.querySelectorAll('[role="switch"]').forEach(control => control.addEventListener('change', () => announce(`${control.closest('label').querySelector('strong').textContent} ${control.checked ? 'enabled' : 'disabled'}.`)));
