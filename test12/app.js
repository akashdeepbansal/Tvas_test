const body = document.querySelector('#order-rows');
const headings = [...document.querySelectorAll('th button[data-sort]')];
const sortStatus = document.querySelector('#sort-status');
let activeSort = { key: 'date', direction: 'descending' };

function valueFor(row, key) {
  const value = row.dataset[key];
  return ['items', 'total'].includes(key) ? Number(value) : value;
}

function sortRows(key) {
  const direction = activeSort.key === key && activeSort.direction === 'ascending' ? 'descending' : 'ascending';
  const multiplier = direction === 'ascending' ? 1 : -1;
  const rows = [...body.rows].sort((a, b) => valueFor(a, key) > valueFor(b, key) ? multiplier : valueFor(a, key) < valueFor(b, key) ? -multiplier : 0);
  rows.forEach(row => body.append(row));
  headings.forEach(button => button.closest('th').setAttribute('aria-sort', button.dataset.sort === key ? direction : 'none'));
  activeSort = { key, direction };
  sortStatus.textContent = `Order history sorted by ${key}, ${direction}.`;
}

headings.forEach(button => button.addEventListener('click', () => sortRows(button.dataset.sort)));

const updates = [
  { time: '10:03 AM', title: 'Driver is nearby', description: 'Your courier is expected within the next 30 minutes.' },
  { time: '10:18 AM', title: 'Delivery preference saved', description: 'Leave at the door has been applied to this delivery.' }
];
let updateIndex = 0;
const activityList = document.querySelector('#activity-list');
const feedStatus = document.querySelector('#feed-status');
const updateButton = document.querySelector('#add-update');

updateButton.addEventListener('click', () => {
  const update = updates[updateIndex];
  if (!update) {
    feedStatus.textContent = 'No new updates are available right now.';
    return;
  }
  const item = document.createElement('li');
  item.innerHTML = `<time datetime="2026-11-22T10:${updateIndex ? '18' : '03'}">${update.time}</time><div><strong>${update.title}</strong><p>${update.description}</p></div>`;
  activityList.prepend(item);
  feedStatus.textContent = `New order update: ${update.title}. ${update.description}`;
  updateIndex += 1;
  if (updateIndex === updates.length) updateButton.textContent = 'Updates checked';
});
