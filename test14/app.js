const colours = [...document.querySelectorAll('input[name="colour"]')];
const shirt = document.querySelector('#shirt-art');
const quantity = document.querySelector('#quantity');
const quantityOutput = document.querySelector('#quantity-output');
const fit = document.querySelector('#fit-slider');
const fitOutput = document.querySelector('#fit-output');
const minPrice = document.querySelector('#price-min');
const maxPrice = document.querySelector('#price-max');
const priceOutput = document.querySelector('#price-output');
const formStatus = document.querySelector('#form-status');
const bagCount = document.querySelector('#bag-count');

const fitLabels = { 1: 'Relaxed', 2: 'Easy', 3: 'Regular', 4: 'Close', 5: 'Tailored' };
const formatPrice = value => `₹${Number(value).toLocaleString('en-IN')}`;

colours.forEach(radio => radio.addEventListener('change', () => {
  shirt.className = `shirt-art ${radio.value.toLowerCase()}`;
  shirt.setAttribute('aria-label', `${radio.value} custom-fit shirt`);
  document.querySelector('.colour-group .hint').textContent = `${radio.value} is selected.`;
}));

quantity.addEventListener('input', () => {
  const value = Math.max(1, Math.min(10, Number(quantity.value) || 1));
  quantity.value = value;
  quantityOutput.textContent = `${value} ${value === 1 ? 'shirt' : 'shirts'}`;
});

fit.addEventListener('input', () => {
  const label = fitLabels[fit.value];
  fitOutput.textContent = label;
  fit.setAttribute('aria-valuetext', `${label} fit`);
  document.querySelector('#fit-help').textContent = `Choose from relaxed to tailored. ${label} fit is selected.`;
});

function updatePriceRange(changed) {
  let min = Number(minPrice.value);
  let max = Number(maxPrice.value);
  if (min > max) {
    if (changed === minPrice) maxPrice.value = min;
    else minPrice.value = max;
    min = Number(minPrice.value);
    max = Number(maxPrice.value);
  }
  minPrice.max = max;
  maxPrice.min = min;
  minPrice.setAttribute('aria-valuetext', `Minimum price ${formatPrice(min)}`);
  maxPrice.setAttribute('aria-valuetext', `Maximum price ${formatPrice(max)}`);
  priceOutput.textContent = `${formatPrice(min)} — ${formatPrice(max)}`;
}
minPrice.addEventListener('input', () => updatePriceRange(minPrice));
maxPrice.addEventListener('input', () => updatePriceRange(maxPrice));
updatePriceRange();

document.querySelector('#product-form').addEventListener('submit', event => {
  event.preventDefault();
  const selectedColour = document.querySelector('input[name="colour"]:checked').value;
  const count = Number(bagCount.textContent) + Number(quantity.value);
  bagCount.textContent = count;
  formStatus.textContent = `${quantity.value} ${selectedColour} custom-fit ${Number(quantity.value) === 1 ? 'shirt has' : 'shirts have'} been added to your bag.`;
});
