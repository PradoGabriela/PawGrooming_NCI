
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
      '. We received your request for ' + chosen + ' and will reply within 30 minutes.';
    dialog.showModal();
    form.reset();
    form.querySelectorAll('.is-invalid').forEach((f) => f.classList.remove('is-invalid'));
    form.querySelectorAll('.invalid-feedback').forEach((el) => (el.style.display = 'none'));
  });

  document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
}