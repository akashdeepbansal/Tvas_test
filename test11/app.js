const slides = [
  { image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=85', alt: 'Person in a neutral suit standing on a city street', kicker: 'CITY EDIT', title: 'Soft tailoring, sharp lines.' },
  { image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85', alt: 'Two people in layered casual clothing', kicker: 'WEEKEND LAYERS', title: 'Easy pieces, pulled together.' },
  { image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85', alt: 'Person browsing a bright clothing rail', kicker: 'BRIGHT ESSENTIALS', title: 'A little colour goes a long way.' }
];
let activeSlide = 0;
const image = document.querySelector('#slide-image');
const title = document.querySelector('#slide-title');
const kicker = document.querySelector('#slide-kicker');
const status = document.querySelector('#slide-status');
const pickerButtons = [...document.querySelectorAll('[data-slide]')];

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  const slide = slides[activeSlide];
  image.src = slide.image;
  image.alt = slide.alt;
  title.textContent = slide.title;
  kicker.textContent = slide.kicker;
  status.textContent = `Slide ${activeSlide + 1} of ${slides.length}`;
  pickerButtons.forEach((button, i) => {
    button.classList.toggle('current', i === activeSlide);
    if (i === activeSlide) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}

document.querySelector('#previous-slide').addEventListener('click', () => showSlide(activeSlide - 1));
document.querySelector('#next-slide').addEventListener('click', () => showSlide(activeSlide + 1));
pickerButtons.forEach(button => button.addEventListener('click', () => showSlide(Number(button.dataset.slide))));

document.querySelector('#save-preferences').addEventListener('click', () => {
  document.querySelector('#preferences-feedback').textContent = 'Your update preferences have been saved.';
});

document.querySelector('#store-select').addEventListener('change', event => {
  const feedback = document.querySelector('#store-feedback');
  feedback.textContent = event.target.value ? `${event.target.value} is available for collection.` : 'Select a city to see its collection point.';
});

const dialog = document.querySelector('#support-dialog');
const openDialog = document.querySelector('#open-dialog');
const closeDialog = document.querySelector('#close-dialog');
const cancelDialog = document.querySelector('#cancel-dialog');
const toast = document.querySelector('#toast');

openDialog.addEventListener('click', () => dialog.showModal());
function closeSupportDialog() { dialog.close(); openDialog.focus(); }
closeDialog.addEventListener('click', closeSupportDialog);
cancelDialog.addEventListener('click', closeSupportDialog);
dialog.addEventListener('cancel', () => setTimeout(() => openDialog.focus(), 0));
document.querySelector('#support-form').addEventListener('submit', event => {
  event.preventDefault();
  dialog.close();
  openDialog.focus();
  toast.hidden = false;
  toast.textContent = 'Thanks — your support message has been sent.';
});
