import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Core Pages
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        contact: resolve(__dirname, 'contact.html'),

        // Design Tools Section
        designTools: resolve(__dirname, 'design-tools.html'),
        styleQuiz: resolve(__dirname, 'style-quiz.html'),
        moodBoard: resolve(__dirname, 'mood-board.html'),
        projectEstimator: resolve(__dirname, 'project-estimator.html'),

        // Style Quiz Results
        styleResultModern: resolve(__dirname, 'style-result-modern.html'),
        styleResultBoho: resolve(__dirname, 'style-result-boho.html'),
        styleResultMinimalist: resolve(__dirname, 'style-result-minimalist.html'),
        styleResultTraditional: resolve(__dirname, 'style-result-traditional.html'),

        // Materials Library (main page)
        materialsLibrary: resolve(__dirname, 'materials-library.html'),

        // Portfolio Detail Pages (List ALL you have)
        portfolioDetailModernApt: resolve(__dirname, 'portfolio-detail-modern-apt.html'),
        portfolioDetailLuxuryVilla: resolve(__dirname, 'portfolio-detail-luxury-villa.html'),
        portfolioDetailMinimalistStudio: resolve(__dirname, 'portfolio-detail-minimalist-studio.html'),
        portfolioDetailTraditionalHome: resolve(__dirname, 'portfolio-detail-traditional-home.html'),
        portfolioDetailBohoBedroom: resolve(__dirname, 'portfolio-detail-boho-bedroom.html'),
        portfolioDetailScandiLiving: resolve(__dirname, 'portfolio-detail-scandi-living.html'),

        // Material Detail Pages (List ALL you have)
        materialDetailVerticalGarden: resolve(__dirname, 'material-detail-vertical-garden.html'),
        materialDetailGeoWallpaper: resolve(__dirname, 'material-detail-geo-wallpaper.html'),
        materialDetailPvcWoodpanel: resolve(__dirname, 'material-detail-pvc-woodpanel.html'),
        materialDetailOrbKnob: resolve(__dirname, 'material-detail-orb-knob.html'),
        materialDetailMarbleTile: resolve(__dirname, 'material-detail-marble-tile.html'),
        materialDetailFloralWallpaper: resolve(__dirname, 'material-detail-floral-wallpaper.html'),

        // Admin Page Loader (in root)
        admin: resolve(__dirname, 'admin.html'),

      },
    },
  },
});