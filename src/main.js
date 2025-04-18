import './style.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
// Import Swiper core and required modules
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// Import Swiper styles (core and modules)
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

document.addEventListener('DOMContentLoaded', () => {
  console.log("Neelkanth Interio Site Loaded");

  // === Active Navigation Link Highlighting ===
  try {
    const currentPagePath = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-navigation ul li a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');

        // Exact match or homepage match
        if (linkPath === currentPagePath || (currentPagePath === '/' && linkPath === '/')) {
            link.classList.add('active-nav-link'); // Add a specific class for styling
        }
        // Handle cases where the link is a parent path (e.g., /portfolio for /portfolio-detail-page)
        // Exclude the homepage '/' from this check to avoid it always being active
        else if (linkPath !== '/' && currentPagePath.startsWith(linkPath) && linkPath.length > 1) {
             link.classList.add('active-nav-link');
        }
         else {
            link.classList.remove('active-nav-link'); // Ensure it's removed if not active
        }
    });
    console.log("Active nav link check complete.");
} catch(error) {
     console.error("Error applying active nav link state:", error);
}
// === End Active Navigation Link Highlighting ===


  // === Mobile Menu Toggle Logic ===
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mainNav = document.querySelector('.main-navigation');

  if (mobileMenuButton && mainNav) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenuButton.classList.toggle('is-active');
      mainNav.classList.toggle('is-active');
      const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
      if (mainNav.classList.contains('is-active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('is-active')) {
                 mobileMenuButton.classList.remove('is-active');
                 mainNav.classList.remove('is-active');
                 mobileMenuButton.setAttribute('aria-expanded', 'false');
                 document.body.style.overflow = '';
            }
        });
    });
  } else {
      console.error("Mobile menu button or main navigation not found!");
  }
  // === End Mobile Menu Toggle Logic ===


  // === Initialize AOS (Animate On Scroll) ===
  try {
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        delay: 100,
        easing: 'ease-in-out',
    });
    console.log("AOS Initialized Successfully");
  } catch (error) {
    console.error("Error initializing AOS: ", error);
  }
  // === End AOS Initialization ===


  // === Style Quiz Logic ===
  const quizForm = document.getElementById('style-quiz-form');
  const currentStepDisplay = document.getElementById('current-step');
  const totalStepsDisplay = document.getElementById('total-steps');
  const quizSteps = document.querySelectorAll('.quiz-step');

  if (quizForm && quizSteps.length > 0 && currentStepDisplay && totalStepsDisplay) {
      console.log("Initializing Style Quiz");
      const totalSteps = quizSteps.length;
      totalStepsDisplay.textContent = totalSteps;

      quizSteps.forEach((step, index) => {
          if (index === 0) {
              step.classList.add('active');
              currentStepDisplay.textContent = 1;
          } else {
              step.classList.remove('active');
          }
      });

      quizForm.addEventListener('click', (event) => {
          const option = event.target.closest('.quiz-option');

          if (option) {
              const currentStepElem = option.closest('.quiz-step');
              if (!currentStepElem) return;

              const currentStepNumber = parseInt(currentStepElem.dataset.step, 10);
              const nextStepNumber = option.dataset.nextStep;
              const resultLink = option.dataset.result;

              if (nextStepNumber) {
                  const nextStepElem = document.getElementById(`quiz-step-${nextStepNumber}`);
                  if (nextStepElem) {
                      console.log(`Moving from step ${currentStepNumber} to ${nextStepNumber}`);
                      currentStepElem.classList.remove('active');
                      nextStepElem.classList.add('active');
                      currentStepDisplay.textContent = nextStepNumber;
                  } else {
                      console.error(`Next step element not found: #quiz-step-${nextStepNumber}`);
                  }
              }
              else if (resultLink) {
                  console.log("Quiz complete, redirecting to:", resultLink);
                  window.location.href = resultLink;
              }
          }
      });
  } else if (document.getElementById('style-quiz-form')){
       console.warn("Style Quiz elements (steps, progress indicators) not fully found. Quiz JS not initialized.");
  }
  // === End Style Quiz Logic ===


    // === Materials Library Dynamic Loading & Filtering ===
    const materialsGrid = document.querySelector('.hardware-items-grid');
    const materialsFilterControls = document.querySelectorAll('.hardware-filters');
    const loadingIndicator = document.querySelector('.loading-materials');
  
    const activeMaterialFilters = {
        category: 'all',
        style: 'all'
    };
    let allMaterialsData = [];
  
    function renderMaterials(materials) {
        if (!materialsGrid) return;
        materialsGrid.innerHTML = '';
  
        if (materials.length === 0) {
            materialsGrid.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">No materials match the current filters.</p>';
            return;
        }
  
        materials.forEach((item, index) => {
            const category = item.category || 'unknown';
            const style = item.style || 'other';
            const imageUrl = item.image || '/images/placeholder-material.jpg';
            const title = item.title || 'Unnamed Material';
            // *** Use the detailPage field directly from JSON ***
            const detailUrl = item.detailPage || '#'; // Use provided path or fallback
  
            const card = document.createElement('div');
            card.className = 'hardware-item-card';
            card.dataset.category = category;
            card.dataset.style = style;
            card.dataset.aos = 'fade-up';
            card.dataset.aosDelay = ((index % 4) + 1) * 100;
  
            card.innerHTML = `
                <a href="${detailUrl}">
                    <img src="${imageUrl}" alt="${title}">
                    <div class="hardware-item-caption">
                        <h4>${title}</h4>
                        <p>${category} / ${style}</p>
                    </div>
                </a>
            `;
            materialsGrid.appendChild(card);
        });
         if (typeof AOS !== 'undefined') {
             AOS.refresh();
         }
    }
  
    function filterAndRenderMaterials() {
         if (!materialsGrid) return;
          const filteredData = allMaterialsData.filter(item => {
              const itemCategory = item.category || 'unknown';
              const itemStyle = item.style || 'other';
              const categoryMatch = activeMaterialFilters.category === 'all' || itemCategory === activeMaterialFilters.category;
              const styleMatch = activeMaterialFilters.style === 'all' || itemStyle === activeMaterialFilters.style;
              return categoryMatch && styleMatch;
          });
          renderMaterials(filteredData);
    }
  
    if (materialsGrid && materialsFilterControls.length > 0) {
         // Check if we are actually on the materials library page before fetching
         if (window.location.pathname.endsWith('/materials-library.html') || window.location.pathname === '/materials-library') {
             console.log("Initializing Dynamic Materials Library Loading");
             fetch('/materials.json')
                 .then(response => {
                     if (!response.ok) {
                         throw new Error(`HTTP error! status: ${response.status}`);
                     }
                     return response.json();
                 })
                 .then(data => {
                     console.log("Materials data loaded:", data);
                     allMaterialsData = data;
                     if(loadingIndicator) loadingIndicator.remove();
                     filterAndRenderMaterials();
  
                     materialsFilterControls.forEach(filterGroupContainer => {
                         filterGroupContainer.addEventListener('click', (event) => {
                             if (event.target.classList.contains('filter-button')) {
                                 const clickedButton = event.target;
                                 const filterGroup = clickedButton.dataset.filterGroup;
                                 const filterValue = clickedButton.dataset.filter;
  
                                 if (activeMaterialFilters.hasOwnProperty(filterGroup)) {
                                     activeMaterialFilters[filterGroup] = filterValue;
                                     const buttonsInGroup = filterGroupContainer.querySelectorAll('.filter-button');
                                     buttonsInGroup.forEach(btn => btn.classList.remove('active'));
                                     clickedButton.classList.add('active');
                                     filterAndRenderMaterials();
                                 }
                             }
                         });
                     });
                 })
                 .catch(error => {
                     console.error("Error loading materials data:", error);
                     if(loadingIndicator) loadingIndicator.textContent = 'Error loading materials.';
                     else materialsGrid.innerHTML = '<p style="text-align: center; padding: 20px; color: red;">Error loading materials data.</p>';
                 });
         } else {
             // Not on the materials library page, so don't fetch/render dynamic items
             console.log("Not on materials library page, skipping dynamic load.");
              if(loadingIndicator) loadingIndicator.remove(); // Remove loading indicator if it exists elsewhere by mistake
         }
     } else {
         console.warn("Materials filter controls or grid not found. Filtering/Dynamic loading disabled.");
     }
    // === End Materials Library Filtering Logic ===

  // === Project Estimator Logic ===
  const estimatorForm = document.getElementById('estimator-form');
  const resultDisplayContainer = document.getElementById('estimator-result');
  const rangeDisplayElement = document.getElementById('estimated-range-display');
  const formStatusElement = document.getElementById('estimator-form-status');

  if (estimatorForm && resultDisplayContainer && rangeDisplayElement && formStatusElement) {
    console.log("Initializing Project Estimator");
    estimatorForm.addEventListener('submit', function(event) {
      event.preventDefault();
      console.log("Estimator form submit prevented, calculating...");
      formStatusElement.textContent = 'Calculating...';
      formStatusElement.className = 'form-status';

      const roomType = document.getElementById('room-type')?.value;
      const roomSize = document.getElementById('room-size')?.value;
      const projectScope = document.getElementById('project-scope')?.value;
      const qualityLevel = document.getElementById('quality-level')?.value;

      if (!roomType || !roomSize || !projectScope || !qualityLevel) {
        console.error("Estimator validation failed: Missing fields.");
        formStatusElement.textContent = 'Please fill out all project detail fields.';
        formStatusElement.className = 'form-status error';
        resultDisplayContainer.style.display = 'none';
        return;
      }
       console.log("Estimator Values:", { roomType, roomSize, projectScope, qualityLevel });

      let baseCost = 80000; // INR base
      let sizeMultiplier = 1;
      let scopeMultiplier = 1;
      let qualityMultiplier = 1;
      let roomMultiplier = 1;

      switch (roomSize) {
        case 'small': sizeMultiplier = 0.8; break;
        case 'medium': sizeMultiplier = 1.0; break;
        case 'large': sizeMultiplier = 1.5; break;
        case 'xlarge': sizeMultiplier = 2.2; break;
        case 'multi-room': sizeMultiplier = 4.0; break;
      }
      switch (projectScope) {
        case 'decor': scopeMultiplier = 1.0; break;
        case 'minor-reno': scopeMultiplier = 2.5; break;
        case 'major-reno': scopeMultiplier = 5.0; break;
        case 'new-build': scopeMultiplier = 7.0; break;
      }
      switch (qualityLevel) {
        case 'standard': qualityMultiplier = 1.0; break;
        case 'premium': qualityMultiplier = 1.8; break;
        case 'luxury': qualityMultiplier = 3.0; break;
      }
       switch (roomType) {
         case 'kitchen': roomMultiplier = 1.8; baseCost = 150000; break;
         case 'bathroom': roomMultiplier = 1.5; baseCost = 120000; break;
         case 'full-home': roomMultiplier = 1.2; baseCost = 300000; break;
       }
       const calculatedLow = baseCost * roomMultiplier * sizeMultiplier * scopeMultiplier * qualityMultiplier;
       const calculatedHigh = calculatedLow * 1.6;
       console.log("Calculated Range (Raw):", calculatedLow, calculatedHigh);

       let displayRange = "N/A";
       try {
            const formatter = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            });
            displayRange = `${formatter.format(calculatedLow)} - ${formatter.format(calculatedHigh)}`;
            rangeDisplayElement.textContent = displayRange;
            resultDisplayContainer.style.display = 'block';
            formStatusElement.textContent = '';
            console.log("Estimate Displayed:", displayRange);
        } catch(formatError) {
             console.error("Error formatting currency:", formatError);
             formStatusElement.textContent = 'Error displaying estimate.';
             formStatusElement.className = 'form-status error';
             resultDisplayContainer.style.display = 'none';
             return;
        }

      const formData = new FormData(estimatorForm);
      const encodedData = new URLSearchParams(formData).toString();

      console.log("Submitting form data via Fetch...");
      formStatusElement.textContent = 'Submitting your inquiry...';
      formStatusElement.className = 'form-status';

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodedData
      })
      .then(response => {
          if (response.ok) {
             console.log("Form submitted successfully via Fetch.");
             formStatusElement.textContent = "Thank you! Your inquiry has been submitted.";
             formStatusElement.className = 'form-status success';
          } else {
              response.text().then(text => {
                  console.error("Form submission failed:", response.status, text);
                  formStatusElement.textContent = "Submission failed. Please try again or contact us directly.";
                  formStatusElement.className = 'form-status error';
              });
          }
      })
      .catch(error => {
          console.error("Network error during form submission:", error);
          formStatusElement.textContent = "Network error. Please check connection and try again.";
          formStatusElement.className = 'form-status error';
      });
    });
  } else if (document.getElementById('estimator-form')) {
      console.warn("Estimator elements not fully found. Calculation/Display disabled.");
  }
  // === End Project Estimator Logic ===


  // === Simple Lightbox Logic ===
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  const closeButton = document.querySelector('.lightbox-close');
  const prevButton = document.querySelector('.lightbox-prev');
  const nextButton = document.querySelector('.lightbox-next');

  if (lightbox && lightboxImage && lightboxTriggers.length > 0 && closeButton && prevButton && nextButton) {
      console.log("Initializing Lightbox");
      let currentImageIndex = 0;
      let galleryImages = [];

      // Function to build the gallery for the current page
      function buildGallery() {
          galleryImages = []; // Reset for the current page
          const pageTriggers = document.querySelectorAll('.lightbox-trigger'); // Select triggers *on this page*
          pageTriggers.forEach(trigger => {
              const imgElement = trigger.querySelector('img');
              if(imgElement) {
                  galleryImages.push({ src: trigger.href, alt: imgElement.alt });
              }
          });
          console.log(`Built gallery with ${galleryImages.length} images for this page.`);
      }

      function openLightbox(index) {
          if (galleryImages.length === 0) buildGallery(); // Build gallery if not already built
          if (index < 0 || index >= galleryImages.length) return;
          currentImageIndex = index;
          lightboxImage.src = galleryImages[currentImageIndex].src;
          lightboxImage.alt = galleryImages[currentImageIndex].alt;
          lightboxCaption.textContent = galleryImages[currentImageIndex].alt;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
      }

      function closeLightbox() {
          lightbox.classList.remove('active');
          document.body.style.overflow = '';
      }

      function showNextImage() {
          if (galleryImages.length === 0) return;
          openLightbox((currentImageIndex + 1) % galleryImages.length);
      }

      function showPrevImage() {
           if (galleryImages.length === 0) return;
          openLightbox((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);
      }

      // Initial build of gallery for potential direct access later if needed
       buildGallery();

      // Need to re-select triggers specifically for adding listeners
      const pageTriggersForListeners = document.querySelectorAll('.lightbox-trigger');
      pageTriggersForListeners.forEach((trigger) => {
          trigger.addEventListener('click', (event) => {
              event.preventDefault();
              buildGallery(); // Rebuild gallery just before opening to be sure
              // Find the index of the clicked trigger in the *current page's* gallery
              const clickedSrc = event.currentTarget.href;
              const clickedIndex = galleryImages.findIndex(img => img.src === clickedSrc);
              if(clickedIndex !== -1) {
                  openLightbox(clickedIndex);
              } else {
                   console.error("Clicked lightbox image not found in built gallery.");
              }
          });
      });

      closeButton.addEventListener('click', closeLightbox);
      nextButton.addEventListener('click', showNextImage);
      prevButton.addEventListener('click', showPrevImage);
      lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
      document.addEventListener('keydown', (event) => {
          if (lightbox.classList.contains('active')) {
              if (event.key === 'Escape') closeLightbox();
              if (event.key === 'ArrowRight') showNextImage();
              if (event.key === 'ArrowLeft') showPrevImage();
          }
      });
  } else if (document.querySelector('.gallery-grid')) {
      console.warn("Lightbox elements not fully found. Lightbox functionality disabled.");
  }
  // === End Simple Lightbox Logic ===
  // === Initialize Testimonial Swiper ===
  const testimonialSwiperEl = document.querySelector('.testimonial-swiper');
  if (testimonialSwiperEl) {
      console.log("Initializing Testimonial Swiper");
      const testimonialSwiper = new Swiper(testimonialSwiperEl, {
          // Use necessary modules
          modules: [Navigation, Pagination, Autoplay],

          // Configuration options
          loop: true, // Enable continuous loop mode
          slidesPerView: 1, // Show one slide at a time
          spaceBetween: 30, // Space between slides (if showing more than 1)
          autoplay: {
              delay: 5000, // Delay between transitions (5 seconds)
              disableOnInteraction: true, // Don't stop autoplay on user interaction
          },

          // Pagination
          pagination: {
              el: '.testimonial-pagination', // Use our custom class
              clickable: true,
          },

          // Navigation arrows
          navigation: {
              nextEl: '.testimonial-button-next', // Use our custom class
              prevEl: '.testimonial-button-prev', // Use our custom class
          },
      });
  } else {
       console.warn("Testimonial Swiper element not found.");
  }
  // === End Testimonial Swiper Initialization ===

}); // End of DOMContentLoaded