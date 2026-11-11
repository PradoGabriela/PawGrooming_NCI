
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