import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter'; // Requires 'npm install gray-matter --save-dev'
import { marked } from 'marked';   // Requires 'npm install marked --save-dev'

// Helper function to generate slug from title
function slugify(text) {
  if (!text) return 'untitled-' + Date.now();
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Helper function to create title case from slug/category
function titleCase(str) {
    if (!str) return '';
    return str.replace(/-/g, ' ').replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// Get base directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const materialsDataDir = path.join(__dirname, 'src', 'data', 'materials');
const templateFile = path.join(__dirname, 'src', 'templates', 'material-detail-template.html');
const materialsJsonOutput = path.join(__dirname, 'public', 'materials.json'); // For dynamic loading on library page
const outputHtmlDir = __dirname; // Generate detail HTML files in the ROOT before build
const allMaterialsForJson = []; // Array for the public JSON file

console.log(`--- Content Build Script ---`);
console.log(`Reading materials data from: ${materialsDataDir}`);
console.log(`Using template: ${templateFile}`);

try {
    // Ensure template file exists
    if (!fs.existsSync(templateFile)) {
        throw new Error(`Template file not found at ${templateFile}`);
    }
    const templateHtml = fs.readFileSync(templateFile, 'utf-8');

    // Check if source data directory exists
    if (!fs.existsSync(materialsDataDir)) {
        console.warn(`Source directory ${materialsDataDir} not found. Writing empty materials.json.`);
        fs.writeFileSync(materialsJsonOutput, JSON.stringify([]));
        process.exit(0); // Exit script if no data folder
    }

    const files = fs.readdirSync(materialsDataDir);
    console.log(`Found ${files.length} files/folders in materials directory.`);

    files.forEach(file => {
        const filePath = path.join(materialsDataDir, file);
        if (fs.statSync(filePath).isFile()) {
            let materialData = null;
            let descriptionHtml = '';

            if (file.endsWith('.md')) {
                console.log(`Processing Markdown file: ${file}`);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                try {
                    const { data, content } = matter(fileContent);
                    descriptionHtml = marked(content || ''); // Convert markdown content to HTML
                    const slug = slugify(data.title || path.basename(file, '.md'));
                    materialData = {
                        slug: slug,
                        title: data.title || 'Untitled Material',
                        category: data.category || 'uncategorized',
                        style: data.style || 'default',
                        image: data.image || null,
                        mainDetailImage: data.mainDetailImage || data.image || null,
                        description: descriptionHtml, // Use parsed HTML
                        specs: data.specs || [],
                        gallery: data.gallery || [],
                        detailPageUrl: `/material-detail-${slug}.html` // Define URL here
                    };
                } catch (parseError) {
                     console.error(`Error parsing Markdown file ${file}:`, parseError);
                }
            }
            // Add JSON file processing here if needed

            if (materialData) {
                // Prepare data subset for the public materials.json (grid view)
                allMaterialsForJson.push({
                     title: materialData.title,
                     category: materialData.category,
                     style: materialData.style,
                     image: materialData.image,
                     detailPage: materialData.detailPageUrl // Use the generated URL
                 });

                // Generate detail page HTML content
                let detailHtml = templateHtml;
                const specsHtml = materialData.specs.map(spec => `<li><strong>${spec.name || ''}:</strong> ${spec.value || ''}</li>`).join('\n');
                // Generate thumbnail HTML, ensuring data-large-src points to the right full gallery image
                const thumbnailsHtml = materialData.gallery.map((img, index) =>
                    `<img src="${img.image || ''}" alt="${img.alt || 'Thumbnail'}" data-large-src="${img.image || ''}" class="${index === 0 ? 'active' : ''}">`
                ).join('\n'); // Note: Changed data-large-src to use thumb URL directly, assuming it IS the large URL for simplicity here. Adjust if you have sep large files.

                detailHtml = detailHtml.replace(/{{TITLE}}/g, materialData.title);
                detailHtml = detailHtml.replace(/{{CATEGORY}}/g, materialData.category);
                detailHtml = detailHtml.replace(/{{CATEGORY_TITLE}}/g, titleCase(materialData.category));
                detailHtml = detailHtml.replace(/{{STYLE_TITLE}}/g, titleCase(materialData.style));
                detailHtml = detailHtml.replace(/{{MAIN_IMAGE_SRC}}/g, materialData.mainDetailImage); // Use the potentially separate main detail image
                detailHtml = detailHtml.replace(/{{DESCRIPTION_HTML}}/g, materialData.description); // Insert parsed HTML
                detailHtml = detailHtml.replace(/{{SPECS_HTML}}/g, specsHtml);
                detailHtml = detailHtml.replace(/{{THUMBNAILS_HTML}}/g, thumbnailsHtml);
                detailHtml = detailHtml.replace(/{{TITLE_URL_ENCODED}}/g, encodeURIComponent(materialData.title));

                // Define output path for the detail page in the project ROOT
                const outputFilePath = path.join(outputHtmlDir, `material-detail-${materialData.slug}.html`);
                fs.writeFileSync(outputFilePath, detailHtml);
                console.log(` -> Generated detail page: ${outputFilePath}`);
            }
        } else {
             console.log(`Skipping directory: ${file}`);
        }
    });

    // Write the combined JSON for the library page grid view to public/
    fs.writeFileSync(materialsJsonOutput, JSON.stringify(allMaterialsForJson, null, 2));
    console.log(`Successfully generated ${materialsJsonOutput} with ${allMaterialsForJson.length} material items.`);

} catch (error) {
    console.error("Error during content generation:", error);
    process.exit(1); // Exit build process on error
}

console.log(`--- Content Build Script Finished ---`);