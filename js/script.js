//Slider
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector('.twentytwenty-slider');
  const afterWrapper = document.querySelector('.image-after-wrapper');

  if (slider && afterWrapper) {
    slider.addEventListener('input', (e) => {
      const sliderPos = e.target.value;
      afterWrapper.style.width = `${sliderPos}%`;
    });
  }

  // Gallery Animation when user scroll down
  const gallery = document.querySelector('.gallery-section');
  if (gallery && 'IntersectionObserver' in window) {
    const galleryObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        gallery.classList.add('gallery-visible');
        galleryObserver.disconnect();
      }
    });
    galleryObserver.observe(gallery);
  } 
     
  // Google Maps
  const mapFrame = document.querySelector('.map-wrap iframe');
  const MAP_LINK = 'https://maps.app.goo.gl/HbAgXsN3fq8jej4N8'; 
  const MAP_ADDRESS = 'Paw Animal Care, Unit 1, Racefield Centre, Father Russell Rd, Raheen, Limerick, V94 V528, Ireland';      

  if (mapFrame) {
    mapFrame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(MAP_ADDRESS) + '&output=embed';
    const mapLink = document.createElement('a');
    mapLink.href = MAP_LINK;
    mapLink.target = '_blank';
    mapLink.rel = 'noopener';
    mapFrame.closest('.map-wrap').insertAdjacentElement('afterend', mapLink);
  }
   // Contact form elements
  const bookBtn = document.getElementById('bookNow');
  const formSection = document.getElementById('formSection');
  const form = document.getElementById('enquiryForm');
  const dialog = document.getElementById('msgDialog');
  // Show form on click of "Book Now" button
  if (bookBtn && formSection && form) {
    bookBtn.addEventListener('click', () => {
    formSection.classList.add('show');
    bookBtn.setAttribute('aria-expanded', 'true');
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => document.getElementById('name').focus({ preventScroll: true }), 400);
    });

    // Show the dog or cat list elements
  const queryType = document.getElementById('queryType');
  const dogServices = document.getElementById('dogServices');
  const catServices = document.getElementById('catServices');

    function showServices() {
    dogServices.classList.toggle('d-none', queryType.value !== 'Dog');
    catServices.classList.toggle('d-none', queryType.value !== 'Cat');
    }

    queryType.addEventListener('change', showServices);

  // Pricing setup function definition
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

    const isDog = queryType.value === 'Dog';
    const activeBox = document.getElementById(isDog ? 'dogServices' : 'catServices');
    const sizeOrFur = document.getElementById(isDog ? 'dogSize' : 'catFur');

      // If the selected radio was disabled, fall back to the first available one
    const radios = activeBox.querySelectorAll('input[type="radio"]');
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

    // Initialize pricing right away so listeners are active
    setupPricing('dogServices', 'dogSize', 'Select a size');
    setupPricing('catServices', 'catFur', 'Select fur length');

    // Handle URL parameters for direct linking form cats and dogs pages
    const urlParams = new URLSearchParams(window.location.search);
    const petType = urlParams.get('type');
    const categoryParam = urlParams.get('size') || urlParams.get('fur');

    if (petType && queryType) {
      const formatted = petType.charAt(0).toUpperCase() + petType.slice(1).toLowerCase();
      if (formatted === 'Dog' || formatted === 'Cat') {
        queryType.value = formatted;
        showServices();

        if (categoryParam) {
          const subSelect = formatted === 'Dog' ? document.getElementById('dogSize') : document.getElementById('catFur');
          if (subSelect) {
            const normalized = categoryParam.toLowerCase().trim();
            const matchingOption = Array.from(subSelect.options).find(opt => 
              opt.value.toLowerCase() === normalized || 
              opt.text.toLowerCase().includes(normalized)
            );
            if (matchingOption) {
              subSelect.value = matchingOption.value;
              subSelect.dispatchEvent(new Event('change'));
            }
          }
        }

        // Open and scroll to the form section automatically
        formSection.classList.add('show');
        bookBtn.setAttribute('aria-expanded', 'true');
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Time setup
    function todayStr() {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 10);
    }
    document.getElementById('appointmentDate').min = todayStr();

    // Validation
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
      const type = queryType.value;
      const message = document.getElementById('message').value.trim();
      const date = document.getElementById('appointmentDate').value;
      const isDog = type === 'Dog';
      const sizeOrFur = document.getElementById(isDog ? 'dogSize' : 'catFur');

      let dateMsg = '';
      if (!date) dateMsg = 'Please choose a preferred date.';
      else if (date < todayStr()) dateMsg = 'Please choose today or a future date.';

      let sizeValid = true;
      if ((isDog || type === 'Cat') && !sizeOrFur.value) {
        sizeOrFur.classList.add('is-invalid');
        sizeValid = false;
      }

      const results = [
        setError('name', name.length < 2 ? 'Please enter your name.' : ''),
        setError('email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Please enter a valid email address.' : ''),
        setError('phone', !/^[+()\d\s-]{7,15}$/.test(phone) ? 'Please enter a valid phone number.' : ''),
        setError('queryType', !type ? 'Please choose an enquiry type.' : ''),
        setError('appointmentDate', dateMsg),
        setError('message', message.length < 10 ? 'Please write at least 10 characters.' : ''),
        sizeValid
      ];
      return results.every(Boolean);
    }

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) setError(field.id, '');
        if (field.id === 'dogSize' || field.id === 'catFur') field.classList.remove('is-invalid');
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

  // Theme toggle
  //Elements to be changed when toggling theme
  let isDark = localStorage.getItem('theme') === 'dark';
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
  const navbarTogglerIcon = document.querySelector('.navbar-toggler-icon');
  const whiteElements = document.querySelectorAll('.bg-white');
  const lightElements = document.querySelectorAll('.bg-light');
  const darkText = document.querySelectorAll('.text-white');
  const dogServiceSection = document.getElementById('dog-services');
  const catServiceSection = document.getElementById('cat-services');
  const headingDark = document.querySelectorAll('.heading-dark');
  const contactFormCard = document.querySelector('#formSection .form-card');

  function toggleTheme() {
    whiteElements.forEach((element) => {
      element.classList.toggle('bg-white');
      element.classList.toggle('bg-dark');
    });
    lightElements.forEach((element) => {
      element.classList.toggle('bg-light');
      element.classList.toggle('bg-secondary');
    });
    darkText.forEach((element) => {
      if (!element.classList.contains('footer-text')) {
        element.classList.toggle('text-white');
        element.classList.toggle('text-dark');
      }
    });
    if (dogServiceSection) dogServiceSection.classList.toggle('bg-secondary');
    if (catServiceSection) catServiceSection.classList.toggle('bg-secondary');
    headingDark.forEach((element) => {
      element.classList.toggle('text-dark');
      element.classList.toggle('text-secondary');
    });
    if (contactFormCard) contactFormCard.classList.toggle('bg-secondary');
  }

  if (isDark) toggleTheme();

  function updateThemeIcon() {
    document.body.classList.toggle('dark-theme', isDark);
    if (navbarTogglerIcon) {
      navbarTogglerIcon.style.filter = isDark ? 'invert(1)' : '';
    }
    if (!themeIcon || !themeToggle) return;
    themeIcon.classList.toggle('bi-moon-stars-fill', !isDark);
    themeIcon.classList.toggle('bi-sun-fill', isDark);
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  updateThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      toggleTheme();
      isDark = !isDark;
      updateThemeIcon();
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
});