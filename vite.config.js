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
        // Add other material detail pages here... e.g.:
        // materialDetailMetroLever: resolve(__dirname, 'material-detail-metro-lever.html'), // If you kept/re-added it
        // materialDetailRidgePull: resolve(__dirname, 'material-detail-ridge-pull.html'), // If you kept/re-added it
        // materialDetailFacetKnob: resolve(__dirname, 'material-detail-facet-knob.html'), // If you kept/re-added it

        // Admin Page (Important: ensure it's copied if in public/, or processed if elsewhere)
        // If admin.html is in root:
        // admin: resolve(__dirname, 'admin.html'),
        // If admin/index.html is in public, Vite *should* copy it automatically,
        // but listing it here ensures it's treated as an entry point if needed.
        // If your /public/admin/index.html loads JS that needs bundling, list it.
        // Otherwise, relying on Vite's default public dir copy is usually sufficient.
      },
    },
  },
  // If admin.html is NOT in /public, ensure it's not excluded by optimizeDeps
  // optimizeDeps: {
  //   exclude: ['admin.html'] // Example if it was in root and causing issues
  // }
});