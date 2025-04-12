// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // --- Core Pages ---
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        contact: resolve(__dirname, 'contact.html'),

        // --- Portfolio Detail Pages (from image) ---
        portfolioDetailModernApt: resolve(__dirname, 'portfolio-detail-modern-apt.html'),
        portfolioDetailBohoBedroom: resolve(__dirname, 'portfolio-detail-boho-bedroom.html'),
        portfolioDetailLuxuryVilla: resolve(__dirname, 'portfolio-detail-luxury-villa.html'),
        portfolioDetailMinimalistStudio: resolve(__dirname, 'portfolio-detail-minimalist-studio.html'),
        // Note: portfolio-detail-scandi-living.html was previously removed from portfolio.html due to missing image,
        // but include it here in case you add it back later or want the file built anyway.
        portfolioDetailScandiLiving: resolve(__dirname, 'portfolio-detail-scandi-living.html'),
        portfolioDetailTraditionalHome: resolve(__dirname, 'portfolio-detail-traditional-home.html'),

        // --- Design Tools Pages (from image) ---
        designTools: resolve(__dirname, 'design-tools.html'), // Assuming this is the main tools page
        moodBoard: resolve(__dirname, 'mood-board.html'),
        projectEstimator: resolve(__dirname, 'project-estimator.html'),
        styleQuiz: resolve(__dirname, 'style-quiz.html'),

        // --- Style Quiz Result Pages (from image) ---
        styleResultBoho: resolve(__dirname, 'style-result-boho.html'),
        styleResultMinimalist: resolve(__dirname, 'style-result-minimalist.html'),
        styleResultModern: resolve(__dirname, 'style-result-modern.html'),
        styleResultTraditional: resolve(__dirname, 'style-result-traditional.html'),

        // Note: Ignoring 'help.py' as it's not an HTML entry point
      },
    },
  },
});