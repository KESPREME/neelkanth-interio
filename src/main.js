// Import our main stylesheet
import './style.css';

// Import AOS library styles and JS
// *** Make sure these lines are present at the very top ***
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';      // Import AOS script

// -----------------------------------------------------------------------------
// Main JavaScript for Neelkanth Interio
// -----------------------------------------------------------------------------

// DOMContentLoaded ensures the HTML is fully loaded before running any JS
document.addEventListener('DOMContentLoaded', () => {
  console.log("Neelkanth Interio Site Loaded"); // Check console for this message

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
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      }
    });
  }
  // === End Portfolio Filtering Logic ===


  // === Initialize AOS (Animate On Scroll) ===
  // *** Make sure this block is present and INSIDE the DOMContentLoaded listener ***
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
  // Inside document.addEventListener('DOMContentLoaded', () => { ... });

    // ... (Mobile Menu Logic) ...
    // ... (Portfolio Filtering Logic) ...
    // ... (AOS Initialization) ...

    // === Style Quiz Logic ===
    const quizForm = document.getElementById('style-quiz-form'); // Get the form/container
    const currentStepDisplay = document.getElementById('current-step');
    const totalStepsDisplay = document.getElementById('total-steps');
    const quizSteps = document.querySelectorAll('.quiz-step');

    if (quizForm && quizSteps.length > 0 && currentStepDisplay && totalStepsDisplay) {
        const totalSteps = quizSteps.length;
        totalStepsDisplay.textContent = totalSteps; // Update total steps display

        quizForm.addEventListener('click', (event) => {
            // Use .closest() to find the parent .quiz-option if a child element was clicked
            const option = event.target.closest('.quiz-option');

            if (option) {
                const currentStepElem = option.closest('.quiz-step');
                if (!currentStepElem) return; // Should not happen normally

                const currentStepNumber = parseInt(currentStepElem.dataset.step, 10);
                const nextStepNumber = option.dataset.nextStep; // For intermediate steps
                const resultLink = option.dataset.result; // For final step

                // --- Handle Intermediate Step Navigation ---
                if (nextStepNumber) {
                    const nextStepElem = document.getElementById(`quiz-step-${nextStepNumber}`);
                    if (nextStepElem) {
                        currentStepElem.classList.remove('active');
                        nextStepElem.classList.add('active');
                        // Update progress display
                        currentStepDisplay.textContent = nextStepNumber;
                    }
                }
                // --- Handle Final Step Navigation (Redirect) ---
                else if (resultLink) {
                    // Optionally save choices to local storage or pass via URL param here
                    console.log("Quiz complete, redirecting to:", resultLink);
                    window.location.href = resultLink; // Redirect to the result page
                }
            }
        });
    }
    // === End Style Quiz Logic ===


// }); // End of DOMContentLoaded
  // === End AOS Initialization ===


}); // End of DOMContentLoaded