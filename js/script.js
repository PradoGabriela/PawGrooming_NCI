
    const slider = document.querySelector('.twentytwenty-slider');
    const afterWrapper = document.querySelector('.image-after-wrapper');

    slider.addEventListener('input', (e) => {
      const sliderPos = e.target.value;
      afterWrapper.style.width = `${sliderPos}%`;
    });
 

    