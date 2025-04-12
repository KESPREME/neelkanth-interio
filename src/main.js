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


}); // End of DOMContentLoaded