import { resolve } from 'path';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import needed for __dirname equivalent

// Get directory name in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to find all material data files to determine expected detail pages
const getMaterialDetailPages = () => {
  const materialsDataDir = path.join(__dirname, 'src', 'data', 'materials');
  const pages = {};
  try {
    if (fs.existsSync(materialsDataDir)) {
        const files = fs.readdirSync(materialsDataDir);
        files.forEach(file => {
            if (file.endsWith('.md') || file.endsWith('.json')) {
                // --- Regenerate slug logic consistent with build-content.js ---
                let slugBase = file.endsWith('.md') ? path.basename(file, '.md') : path.basename(file, '.json');
                // Read title from frontmatter if possible for better slugs (optional enhancement)
                try {
                    const filePath = path.join(materialsDataDir, file);
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    // Use gray-matter only if you have it installed and handle potential errors
                    // For simplicity here, we stick to filename-based slugging.
                    // const { data } = matter(fileContent); // Requires gray-matter install
                    // if (data && data.title) slugBase = data.title;
                } catch (e) { /* ignore errors reading frontmatter here */ }

                const slug = slugBase.toString().toLowerCase()
                                .replace(/\s+/g, '-')
                                .replace(/[^\w-]+/g, '')
                                .replace(/--+/g, '-')
                                .replace(/^-+/, '')
                                .replace(/-+$/, '');
                // --- End slug logic ---

                const pageName = `materialDetail_${slug}`; // Unique key for Rollup
                const pagePath = `material-detail-${slug}.html`; // Relative path in ROOT
                pages[pageName] = resolve(__dirname, pagePath); // Tell Vite where to find generated file
            }
        });
    }
  } catch (error) {
      console.error("Error reading material data files for Vite config:", error);
  }
  console.log("Vite inputs for material details:", pages); // Log which pages Vite will process
  return pages;
};

export default defineConfig({
  build: {
    // *** THIS IS THE KEY CHANGE ***
    emptyOutDir: false, // <<< Set this to false to prevent Vite from cleaning dist

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

        // Dynamically add generated Material Detail Pages from ROOT
        ...getMaterialDetailPages(),

        // No need to list admin.html here since it's in public/ and copied automatically
      },
    },
  },
});