import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter'; // Ensure installed: npm install gray-matter --save-dev
import { marked } from 'marked'; // Install for Markdown to HTML: npm install marked --save-dev

// Helper function to generate slug from title
function slugify(text) {
  if (!text) return 'untitled-' + Date.now(); // Handle missing titles
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars except -
    .replace(/--+/g, '-')           // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Helper function to create title case from slug/category
function titleCase(str) {
    if (!str) return '';
    return str.replace(/-/g, ' ').replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}


// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const materialsDataDir = path.join(__dirname, 'src', 'data', 'materials');
const templateFile = path.join(__dirname, 'src', 'templates', 'material-detail-template.html');
const materialsJsonOutput = path.join(__dirname, 'public', 'materials.json');
const outputDir = path.join(__dirname, 'dist'); // We'll write HTML directly to dist
const allMaterials = [];

console.log(`Reading materials from: ${materialsDataDir}`);
console.log(`Using template: ${templateFile}`);
console.log(`Writing combined JSON to: ${materialsJsonOutput}`);
console.log(`Writing detail pages to: ${outputDir}`);

try {
    // Create dist directory if it doesn't exist (Vite usually handles this, but good practice)
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read the detail page template
    const templateHtml = fs.readFileSync(templateFile, 'utf-8');

    // Check if source data directory exists
    if (!fs.existsSync(materialsDataDir)) {
        console.warn(`Source directory ${materialsDataDir} not found. Skipping JSON and page generation.`);
        fs.writeFileSync(materialsJsonOutput, JSON.stringify([])); // Create empty JSON
        process.exit(0);
    }

    const files = fs.readdirSync(materialsDataDir);
    console.log(`Found ${files.length} files/folders in materials directory.`);

    files.forEach(file => {
        const filePath = path.join(materialsDataDir, file);
        if (fs.statSync(filePath).isFile()) {
            let materialData = null;
            let contentHtml = '';

            if (file.endsWith('.md')) {
                console.log(`Processing Markdown file: ${file}`);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                try {
                    const { data, content } = matter(fileContent);
                    contentHtml = marked(content); // Convert markdown content to HTML
                    materialData = {
                        slug: slugify(data.title || file.replace('.md','')), // Generate slug
                        title: data.title || 'Untitled',
                        category: data.category || 'unknown',
                        style: data.style || 'other',
                        image: data.image || null,
                        mainDetailImage: data.mainDetailImage || data.image || null, // Fallback
                        description: contentHtml, // Store processed HTML
                        specs: data.specs || [],
                        gallery: data.gallery || []
                    };
                } catch (parseError) {
                     console.error(`Error parsing Markdown file ${file}:`, parseError);
                }
            } else if (file.endsWith('.json')) {
                 // Handle JSON if needed (ensure structure matches the 'materialData' object)
                 console.warn("JSON data file processing not fully implemented in this example script.");
            }

            if (materialData) {
                allMaterials.push({ // Push data needed for materials.json (grid view)
                     title: materialData.title,
                     category: materialData.category,
                     style: materialData.style,
                     image: materialData.image,
                     // Construct detail page URL based on slug
                     detailPage: `/material-detail-${materialData.slug}.html`
                 });

                // Generate detail page HTML
                let detailHtml = templateHtml;
                const specsHtml = materialData.specs.map(spec => `<li><strong>${spec.name || ''}:</strong> ${spec.value || ''}</li>`).join('\n');
                const thumbnailsHtml = materialData.gallery.map((img, index) =>
                    `<img src="${img.image || ''}" alt="${img.alt || 'Thumbnail'}" data-large-src="${img.image?.replace('-thumb', '-large') || img.image}" class="${index === 0 ? 'active' : ''}">`
                ).join('\n');

                detailHtml = detailHtml.replace(/{{TITLE}}/g, materialData.title);
                detailHtml = detailHtml.replace(/{{CATEGORY}}/g, materialData.category);
                detailHtml = detailHtml.replace(/{{CATEGORY_TITLE}}/g, titleCase(materialData.category));
                detailHtml = detailHtml.replace(/{{STYLE_TITLE}}/g, titleCase(materialData.style));
                detailHtml = detailHtml.replace(/{{MAIN_IMAGE_SRC}}/g, materialData.mainDetailImage || materialData.image); // Use main detail image or fallback
                detailHtml = detailHtml.replace(/{{DESCRIPTION_HTML}}/g, materialData.description); // Already HTML from marked
                detailHtml = detailHtml.replace(/{{SPECS_HTML}}/g, specsHtml);
                detailHtml = detailHtml.replace(/{{THUMBNAILS_HTML}}/g, thumbnailsHtml);
                detailHtml = detailHtml.replace(/{{TITLE_URL_ENCODED}}/g, encodeURIComponent(materialData.title));

                // Define output path for the detail page inside 'dist'
                const outputFilePath = path.join(outputDir, `material-detail-${materialData.slug}.html`);
                fs.writeFileSync(outputFilePath, detailHtml);
                console.log(` -> Generated detail page: ${outputFilePath}`);
            }

        } else {
             console.log(`Skipping directory: ${file}`);
        }
    });

    // Write the combined JSON for the library page grid view
    fs.writeFileSync(materialsJsonOutput, JSON.stringify(allMaterials, null, 2));
    console.log(`Successfully generated ${materialsJsonOutput} with ${allMaterials.length} material items.`);

} catch (error) {
    console.error("Error during content generation:", error);
    process.exit(1);
}