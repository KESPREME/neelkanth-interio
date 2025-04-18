// Import our main stylesheet
import './style.css';

// Import AOS library styles and JS
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';      // Import AOS script

// -----------------------------------------------------------------------------
// Main JavaScript for Neelkanth Interio
// -----------------------------------------------------------------------------

// DOMContentLoaded ensures the HTML is fully loaded before running any JS
document.addEventListener('DOMContentLoaded', () => {
  console.log("Neelkanth Interio Site Loaded"); // Check console for this message

  // === Mobile Menu Toggle Logic ===
  // If menu doesn't slide in, CHECK CSS for .main-navigation.is-active positioning/transition rules.
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mainNav = document.querySelector('.main-navigation');

  if (mobileMenuButton && mainNav) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenuButton.classList.toggle('is-active');
      mainNav.classList.toggle('is-active'); // Check if this class is added in dev tools
      const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
      if (mainNav.classList.contains('is-active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    // Close menu on link click
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


  // === Portfolio Filtering Logic ===
  const filterContainer = document.querySelector('.filter-controls');
  const portfolioItems = document.querySelectorAll('.portfolio-item-card');

  if (filterContainer && portfolioItems.length > 0) {
    filterContainer.addEventListener('click', (event) => {
      if (event.target.classList.contains('filter-button')) {
        const filterValue = event.target.getAttribute('data-filter');
        const allFilterButtons = filterContainer.querySelectorAll('.filter-button');
        allFilterButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        portfolioItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = 'block'; // Use block for basic show/hide
          } else {
            item.style.display = 'none';
          }
        });
      }
    });
  }
  // === End Portfolio Filtering Logic ===


  // === Initialize AOS (Animate On Scroll) ===
  try {
    AOS.init({
        duration: 800, // Animation duration in ms
        once: true,    // Whether animation should happen only once - while scrolling down
        offset: 50,    // Offset (in px) from the original trigger point
        delay: 100,    // Global delay animation (ms) - can be overridden per element
        easing: 'ease-in-out', // Example easing
    });
    console.log("AOS Initialized Successfully"); // Check console for this message
  } catch (error) {
    console.error("Error initializing AOS: ", error); // Report any init errors
  }
  // === End AOS Initialization ===


  // === Style Quiz Logic ===
  // Note: This requires corresponding HTML structure in style-quiz.html
  const quizForm = document.getElementById('style-quiz-form'); // Assumes form/container has this ID
  const currentStepDisplay = document.getElementById('current-step'); // Assumes element with this ID exists
  const totalStepsDisplay = document.getElementById('total-steps'); // Assumes element with this ID exists
  const quizSteps = document.querySelectorAll('.quiz-step'); // Assumes steps have this class

  if (quizForm && quizSteps.length > 0 && currentStepDisplay && totalStepsDisplay) {
      console.log("Initializing Style Quiz"); // Check if quiz elements are found
      const totalSteps = quizSteps.length;
      totalStepsDisplay.textContent = totalSteps; // Update total steps display

      // Ensure first step is active initially (can also be done with CSS)
      quizSteps.forEach((step, index) => {
          if (index === 0) {
              step.classList.add('active');
              currentStepDisplay.textContent = 1;
          } else {
              step.classList.remove('active');
          }
      });


      quizForm.addEventListener('click', (event) => {
          // Use .closest() to find the parent .quiz-option if a child element was clicked
          const option = event.target.closest('.quiz-option');

          if (option) {
              const currentStepElem = option.closest('.quiz-step');
              if (!currentStepElem) return;

              const currentStepNumber = parseInt(currentStepElem.dataset.step, 10); // Assumes step has data-step="1" etc.
              const nextStepNumber = option.dataset.nextStep; // Assumes option has data-next-step="2" etc.
              const resultLink = option.dataset.result; // Assumes final option has data-result="style-result-modern.html" etc.

              // --- Handle Intermediate Step Navigation ---
              if (nextStepNumber) {
                  const nextStepElem = document.getElementById(`quiz-step-${nextStepNumber}`); // Assumes steps have id="quiz-step-1" etc.
                  if (nextStepElem) {
                      console.log(`Moving from step ${currentStepNumber} to ${nextStepNumber}`);
                      currentStepElem.classList.remove('active');
                      nextStepElem.classList.add('active');
                      currentStepDisplay.textContent = nextStepNumber; // Update progress display
                  } else {
                      console.error(`Next step element not found: #quiz-step-${nextStepNumber}`);
                  }
              }
              // --- Handle Final Step Navigation (Redirect) ---
              else if (resultLink) {
                  console.log("Quiz complete, redirecting to:", resultLink);
                  window.location.href = resultLink; // Redirect to the result page
              }
          }
      });
  } else if (document.getElementById('style-quiz-form')){ // Only log error if the quiz form exists but other parts are missing
       console.warn("Style Quiz elements (steps, progress indicators) not fully found. Quiz JS not initialized.");
  }
  // === End Style Quiz Logic ===
  // Inside document.addEventListener('DOMContentLoaded', () => { ... });

  // === Materials Library Multi-Group Filtering Logic ===
  // Renamed from Hardware Collection Logic
  const materialsFilterControls = document.querySelectorAll('.hardware-filters'); // Still use this class for containers
  const materialItems = document.querySelectorAll('.hardware-item-card'); // Still use this class for items

  const activeMaterialFilters = {
      category: 'all', // Changed from 'type'
      style: 'all'     // Changed from 'finish'
  };

  if (materialsFilterControls.length > 0 && materialItems.length > 0) {
      console.log("Initializing Materials Library Filtering");

      materialsFilterControls.forEach(filterGroupContainer => {
          filterGroupContainer.addEventListener('click', (event) => {
              if (event.target.classList.contains('filter-button')) {
                  const clickedButton = event.target;
                  const filterGroup = clickedButton.dataset.filterGroup; // 'category' or 'style'
                  const filterValue = clickedButton.dataset.filter;    // e.g., 'hardware', 'wallpaper', 'matte-black'

                  if(activeMaterialFilters.hasOwnProperty(filterGroup)){ // Check if group exists
                      activeMaterialFilters[filterGroup] = filterValue;
                      console.log("Active Material Filters:", activeMaterialFilters);

                      const buttonsInGroup = filterGroupContainer.querySelectorAll('.filter-button');
                      buttonsInGroup.forEach(btn => btn.classList.remove('active'));
                      clickedButton.classList.add('active');

                      filterMaterialItems();
                  } else {
                      console.warn("Filter group not recognized:", filterGroup);
                  }
              }
          });
      });

      function filterMaterialItems() {
          materialItems.forEach(item => {
              const itemCategory = item.dataset.category; // Read category attribute
              const itemStyle = item.dataset.style;       // Read style/finish attribute

              // Check if item matches the active filter in EACH group
              const categoryMatch = activeMaterialFilters.category === 'all' || itemCategory === activeMaterialFilters.category;
              const styleMatch = activeMaterialFilters.style === 'all' || itemStyle === activeMaterialFilters.style;

              // Item must match filters in ALL groups to be shown
              if (categoryMatch && styleMatch) {
                  item.classList.remove('hide');
                  // item.style.display = 'block'; // Alternative
              } else {
                  item.classList.add('hide');
                  // item.style.display = 'none'; // Alternative
              }
          });
      }

      // Optional: Initial filter application if needed
      // filterMaterialItems();

  } else if (document.querySelector('.hardware-items-grid')){
      console.warn("Materials filter controls or items not found. Filtering not initialized.");
  }
  // === End Materials Library Filtering Logic ===

// ... (rest of the code) ...

// }); // End of DOMContentLoaded

// Inside document.addEventListener('DOMContentLoaded', () => { ... });

   // === Project Estimator Logic ===
   const estimatorForm = document.getElementById('estimator-form');
   const resultDisplayContainer = document.getElementById('estimator-result');
   const rangeDisplayElement = document.getElementById('estimated-range-display');
   const formStatusElement = document.getElementById('estimator-form-status');
 
   // Check if all necessary elements exist on the page
   if (estimatorForm && resultDisplayContainer && rangeDisplayElement && formStatusElement) {
     console.log("Initializing Project Estimator");
 
     estimatorForm.addEventListener('submit', function(event) {
       // IMPORTANT: Do NOT prevent default if using Netlify forms or standard submission
       // event.preventDefault();
 
       console.log("Estimator form submitted, calculating..."); // Log entry
       formStatusElement.textContent = 'Calculating...';
       formStatusElement.className = 'form-status'; // Reset status styling
 
       // --- 1. Get Form Values ---
       const roomType = document.getElementById('room-type')?.value;
       const roomSize = document.getElementById('room-size')?.value;
       const projectScope = document.getElementById('project-scope')?.value;
       const qualityLevel = document.getElementById('quality-level')?.value;
 
       // --- 2. Basic Validation ---
       if (!roomType || !roomSize || !projectScope || !qualityLevel) {
         console.error("Estimator validation failed: Missing fields.");
         formStatusElement.textContent = 'Please fill out all project detail fields.';
         formStatusElement.className = 'form-status error';
         resultDisplayContainer.style.display = 'none';
         event.preventDefault(); // Prevent submission if validation fails
         return; // Stop processing
       }
        console.log("Estimator Values:", { roomType, roomSize, projectScope, qualityLevel }); // Log values
 
       // --- 3. Simplified Calculation Logic ---
       // Adjust these base costs and multipliers for INR and your business!
       let baseCost = 80000; // Example base in INR
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
          case 'kitchen': roomMultiplier = 1.8; baseCost = 150000; break; // INR base cost examples
          case 'bathroom': roomMultiplier = 1.5; baseCost = 120000; break;
          case 'full-home': roomMultiplier = 1.2; baseCost = 300000; break;
        }
 
        const calculatedLow = baseCost * roomMultiplier * sizeMultiplier * scopeMultiplier * qualityMultiplier;
        const calculatedHigh = calculatedLow * 1.6;
 
        console.log("Calculated Range (Raw):", calculatedLow, calculatedHigh); // Log calculation
 
        // --- 4. Format and Display Result (INR) ---
        try {
             const formatter = new Intl.NumberFormat('en-IN', { // Use 'en-IN' locale for India
                 style: 'currency',
                 currency: 'INR', // Set currency to INR
                 minimumFractionDigits: 0,
                 maximumFractionDigits: 0,
             });
 
             const displayRange = `${formatter.format(calculatedLow)} - ${formatter.format(calculatedHigh)}`;
             rangeDisplayElement.textContent = displayRange;
             resultDisplayContainer.style.display = 'block';
             formStatusElement.textContent = 'Estimate generated. Submitting inquiry...'; // Update status before potential submission
             formStatusElement.className = 'form-status success';
             console.log("Estimate Displayed:", displayRange);
         } catch(formatError) {
              console.error("Error formatting currency:", formatError);
              formStatusElement.textContent = 'Error displaying estimate.';
              formStatusElement.className = 'form-status error';
              resultDisplayContainer.style.display = 'none';
              event.preventDefault(); // Prevent submission if display fails
         }
 
       // Form will now submit automatically if event.preventDefault() is not called above
 
     });
   } else if (document.getElementById('estimator-form')) {
       console.warn("Estimator elements not fully found. Calculation/Display disabled.");
   }
   // === End Project Estimator Logic ===


// ... (rest of the code like AOS init, etc.) ...

// Inside document.addEventListener('DOMContentLoaded', () => { ... });

  // === Simple Lightbox Logic ===
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  const closeButton = document.querySelector('.lightbox-close');
  const prevButton = document.querySelector('.lightbox-prev');
  const nextButton = document.querySelector('.lightbox-next');

  let currentImageIndex = 0;
  let galleryImages = []; // To store images of the current gallery

  if (lightbox && lightboxImage && lightboxTriggers.length > 0 && closeButton && prevButton && nextButton) {
    console.log("Initializing Lightbox");

    // Function to open the lightbox
    function openLightbox(index) {
        if (index < 0 || index >= galleryImages.length) return; // Boundary check
        currentImageIndex = index;
        lightboxImage.src = galleryImages[currentImageIndex].src;
        lightboxImage.alt = galleryImages[currentImageIndex].alt;
        lightboxCaption.textContent = galleryImages[currentImageIndex].alt; // Use alt text as caption
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    // Function to close the lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }

    // Function to show the next image
    function showNextImage() {
        openLightbox((currentImageIndex + 1) % galleryImages.length); // Wrap around
    }

    // Function to show the previous image
    function showPrevImage() {
        openLightbox((currentImageIndex - 1 + galleryImages.length) % galleryImages.length); // Wrap around
    }

    // Add click listeners to all triggers
    lightboxTriggers.forEach((trigger, index) => {
      // Build the galleryImages array from the triggers on the current page
      const imgElement = trigger.querySelector('img');
      if(imgElement) {
          galleryImages.push({ src: trigger.href, alt: imgElement.alt });
      }

      trigger.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link navigation
        openLightbox(index);
      });
    });

    // Add listeners for controls
    closeButton.addEventListener('click', closeLightbox);
    nextButton.addEventListener('click', showNextImage);
    prevButton.addEventListener('click', showPrevImage);

    // Close lightbox on clicking the overlay background
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) { // Only if clicking the overlay itself
        closeLightbox();
      }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
        // Optional: Arrow key navigation
        if (lightbox.classList.contains('active')) {
            if (event.key === 'ArrowRight') {
                showNextImage();
            } else if (event.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });

  } else if (document.querySelector('.gallery-grid')) { // Only log error if gallery exists but lightbox parts don't
      console.warn("Lightbox elements not fully found. Lightbox functionality disabled.");
  }
  // === End Simple Lightbox Logic ===

// ... (rest of the code like AOS init, etc.) ...

// }); // End of DOMContentLoaded

}); // End of DOMContentLoaded