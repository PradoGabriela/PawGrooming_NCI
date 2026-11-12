
    const slider = document.querySelector('.twentytwenty-slider');
    const afterWrapper = document.querySelector('.image-after-wrapper');

    if (slider && afterWrapper) {//to avoid null error
      slider.addEventListener('input', (e) => {
        const sliderPos = e.target.value;
        afterWrapper.style.width = `${sliderPos}%`;
      });
    }
 
    //Gallery Animation
    const gallery = document.querySelector('.gallery-section');
    if (gallery && 'IntersectionObserver' in window) {//Check if the user screen is observing the gallery section
      const galleryObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          gallery.classList.add('gallery-visible');
          galleryObserver.disconnect();
        }
      });
      galleryObserver.observe(gallery);
    } 
     
 //contact form
const bookBtn = document.getElementById('bookNow');
const formSection = document.getElementById('formSection');
const form = document.getElementById('enquiryForm');
const dialog = document.getElementById('msgDialog');
const mapFrame = document.querySelector('.map-wrap iframe');

// Google Maps
const MAP_LINK = 'https://maps.app.goo.gl/HbAgXsN3fq8jej4N8'; 
const MAP_ADDRESS = 'Paw Animal Care, Unit 1, Racefield Centre, Father Russell Rd, Raheen, Limerick, V94 V528, Ireland';      

if (mapFrame) {
  // map shown in the frame (built from the address)
  mapFrame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(MAP_ADDRESS) + '&output=embed';

  // Google link
  const mapLink = document.createElement('a');
  mapLink.href = MAP_LINK;
  mapLink.target = '_blank';
  mapLink.rel = 'noopener';

  mapFrame.closest('.map-wrap').insertAdjacentElement('afterend', mapLink);
}

if (bookBtn && formSection && form) {

  // show form on click
  bookBtn.addEventListener('click', () => {
    formSection.classList.add('show');
    bookBtn.setAttribute('aria-expanded', 'true');
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => document.getElementById('name').focus({ preventScroll: true }), 400);
  });

    // Show the dog or cat list
  const queryType = document.getElementById('queryType');
  const dogServices = document.getElementById('dogServices');
  const catServices = document.getElementById('catServices');

  function showServices() {
    dogServices.classList.toggle('d-none', queryType.value !== 'Dog');
    catServices.classList.toggle('d-none', queryType.value !== 'Cat');
  }

  queryType.addEventListener('change', showServices);
  function setupPricing(boxId, selectId, emptyText) {
  const box = document.getElementById(boxId);
  const select = document.getElementById(selectId);
  const totalEl = box.querySelector('.est-total');
  const items = box.querySelectorAll('.price-item');

  function update() {
    const key = select.value;
    let total = 0;

    items.forEach(item => {
      const priceEl = item.parentElement.querySelector('.price');
      const raw = item.dataset.price ?? item.dataset[key];
      const isRadio = item.type === 'radio';

      if (!key && isRadio) {
        priceEl.textContent = '';
        item.disabled = false;
      } else if (raw === undefined) {
        priceEl.textContent = '(not available)';
        item.disabled = true;
        item.checked = false;
      } else {
        priceEl.textContent = '€' + raw;
        item.disabled = false;
        if (item.checked) total += Number(raw);
      }
    });
   
const isDog = document.getElementById('queryType').value === 'Dog';
const box = document.getElementById(isDog ? 'dogServices' : 'catServices');
const sizeOrFur = document.getElementById(isDog ? 'dogSize' : 'catFur');

const service = box.querySelector('input[type="radio"]:checked')?.value;
const addons = Array.from(box.querySelectorAll('input[type="checkbox"]:checked')).map(a => a.value);
const estimate = box.querySelector('.est-total').textContent;

if ((isDog || document.getElementById('queryType').value === 'Cat') && !sizeOrFur.value) {
  sizeOrFur.classList.add('is-invalid');
  isValid = false;
}

    // If the selected radio was disabled, fall back to the first available one
    const radios = box.querySelectorAll('input[type="radio"]');
    if (key && !Array.from(radios).some(r => r.checked)) {
      const first = Array.from(radios).find(r => !r.disabled);
      if (first) {
        first.checked = true;
        total += Number(first.dataset[key]);
      }
    }

    totalEl.textContent = key ? '€' + total : emptyText;
  }

  select.addEventListener('change', update);
  items.forEach(item => item.addEventListener('change', update));
  update();
}

setupPricing('dogServices', 'dogSize', 'Select a size');
setupPricing('catServices', 'catFur', 'Select fur length');

  //time
  function todayStr() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }
  document.getElementById('appointmentDate').min = todayStr();

  // validation
  function setError(id, msg) {
    const field = document.getElementById(id);
    const err = document.getElementById(id + 'Error');
    field.classList.toggle('is-invalid', !!msg);
    err.textContent = msg;
    err.style.display = msg ? 'block' : 'none';
    return !msg;
  }

  function validate() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const type = document.getElementById('queryType').value;
    const message = document.getElementById('message').value.trim();
    const date = document.getElementById('appointmentDate').value;

    let dateMsg = '';
    if (!date) dateMsg = 'Please choose a preferred date.';
    else if (date < todayStr()) dateMsg = 'Please choose today or a future date.';

    const results = [
      setError('name', name.length < 2 ? 'Please enter your name.' : ''),
      setError('email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Please enter a valid email address.' : ''),
      setError('phone', !/^[+()\d\s-]{7,15}$/.test(phone) ? 'Please enter a valid phone number.' : ''),
      setError('queryType', !type ? 'Please choose an enquiry type.' : ''),
      setError('appointmentDate', dateMsg),
      setError('message', message.length < 10 ? 'Please write at least 10 characters.' : '')
    ];
    return results.every(Boolean);
  }

  // clear a field's error 
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.classList.contains('is-invalid')) setError(field.id, '');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstBad = form.querySelector('.is-invalid');
      if (firstBad) firstBad.focus();
      return;
    }
    const chosen = new Date(document.getElementById('appointmentDate').value + 'T00:00:00')
      .toLocaleDateString('en-IE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('dialogText').textContent =
      'Thank you, ' + document.getElementById('name').value.trim() +
      '. We received your request for ' + chosen + ' see you then.';
    dialog.showModal();
    form.reset();
    form.querySelectorAll('.is-invalid').forEach((f) => f.classList.remove('is-invalid'));
    form.querySelectorAll('.invalid-feedback').forEach((el) => (el.style.display = 'none'));
  });

  document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
}