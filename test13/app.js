const menuButtons = [...document.querySelectorAll('[aria-haspopup="true"]')];
const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 4000);
}

function closeMenu(button, focusButton = false) {
  const menu = document.getElementById(button.getAttribute('aria-controls'));
  menu.hidden = true;
  button.setAttribute('aria-expanded', 'false');
  if (focusButton) button.focus();
}

function openMenu(button) {
  menuButtons.forEach(other => { if (other !== button) closeMenu(other); });
  const menu = document.getElementById(button.getAttribute('aria-controls'));
  menu.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  return menu;
}

menuButtons.forEach((button, buttonIndex) => {
  button.addEventListener('click', () => button.getAttribute('aria-expanded') === 'true' ? closeMenu(button) : openMenu(button));
  button.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); openMenu(button).querySelector('[role="menuitem"]').focus(); }
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      const next = menuButtons[(buttonIndex + (event.key === 'ArrowRight' ? 1 : -1) + menuButtons.length) % menuButtons.length];
      event.preventDefault(); next.focus();
    }
    if (event.key === 'Escape') closeMenu(button, true);
  });
});

document.querySelectorAll('[role="menu"]').forEach(menu => {
  const items = [...menu.querySelectorAll('[role="menuitem"]')];
  items.forEach((item, index) => item.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); items[(index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); }
    if (event.key === 'Escape') { const button = document.getElementById(menu.getAttribute('aria-labelledby')); closeMenu(button, true); }
  }));
});

document.addEventListener('click', event => { if (!event.target.closest('.site-header, .earn-card')) menuButtons.forEach(button => closeMenu(button)); });
document.querySelectorAll('[data-message]').forEach(item => item.addEventListener('click', () => { showToast(item.dataset.message); const menu = item.closest('[role="menu"]'); closeMenu(document.getElementById(menu.getAttribute('aria-labelledby')), true); }));

const listbox = document.querySelector('#reward-listbox');
const options = [...listbox.querySelectorAll('[role="option"]')];
const selection = document.querySelector('#reward-selection');
let selectedIndex = 0;
function chooseReward(index) {
  selectedIndex = (index + options.length) % options.length;
  options.forEach((option, i) => option.setAttribute('aria-selected', String(i === selectedIndex)));
  const selected = options[selectedIndex];
  listbox.setAttribute('aria-activedescendant', selected.id);
  selection.textContent = `${selected.dataset.name} selected (${Number(selected.dataset.points).toLocaleString('en-IN')} points).`;
}
options.forEach((option, index) => option.addEventListener('click', () => { chooseReward(index); listbox.focus(); }));
listbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown') { event.preventDefault(); chooseReward(selectedIndex + 1); }
  if (event.key === 'ArrowUp') { event.preventDefault(); chooseReward(selectedIndex - 1); }
  if (event.key === 'Home') { event.preventDefault(); chooseReward(0); }
  if (event.key === 'End') { event.preventDefault(); chooseReward(options.length - 1); }
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showToast(`${options[selectedIndex].dataset.name} is ready to redeem.`); }
});
document.querySelector('#redeem-button').addEventListener('click', () => showToast(`${options[selectedIndex].dataset.name} is ready to redeem.`));
