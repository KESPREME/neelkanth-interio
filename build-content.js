import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter'; // Ensure installed
import { marked } from 'marked';   // Ensure installed

// --- Helper Functions (Keep as they were) ---
function slugify(text) {
  if (!text) return 'untitled-' + Date.now();
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
function titleCase(str) {
    if (!str) return '';
    return str.replace(/-/g, ' ').replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
// --- End Helper Functions ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const materialsDataDir = path.join(__dirname, 'src', 'data', 'materials');
const templateFile = path.join(__dirname, 'src', 'templates', 'material-detail-template.html');
const materialsJsonOutput = path.join(__dirname, 'public', 'materials.json');
const outputHtmlDir = __dirname;
const allMaterialsForJson = [];

console.log(`--- Content Build Script ---`);
console.log(`Reading materials data from: ${materialsDataDir}`);
console.log(`Using template: ${templateFile}`);

try {
    if (!fs.existsSync(templateFile)) {
        throw new Error(`Template file not found at ${templateFile}`);
    }
    const templateHtml = fs.readFileSync(templateFile, 'utf-8');

    if (!fs.existsSync(materialsDataDir)) {
        console.warn(`Source directory ${materialsDataDir} not found. Writing empty materials.json.`);
        fs.writeFileSync(materialsJsonOutput, JSON.stringify([]));
        process.exit(0);
    }

    const files = fs.readdirSync(materialsDataDir);
    console.log(`Found ${files.length} files/folders in materials directory.`);

    files.forEach(file => {
        const filePath = path.join(materialsDataDir, file);
        if (fs.statSync(filePath).isFile()) {
            let materialData = null;
            let descriptionHtml = '<p><em>No description provided.</em></p>';

            if (file.endsWith('.md')) {
                console.log(`--- Processing Markdown file: ${file} ---`);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                try {
                    const { data, content } = matter(fileContent); // data = frontmatter, content = body
                    console.log(`[${file}] Frontmatter Data:`, data);
                    console.log(`[${file}] Body Content:\n---\n${content}\n---`);

                    // *** UPDATED DESCRIPTION LOGIC ***
                    // Prioritize the 'description' field in frontmatter if it exists and is not empty
                    if (data.description && data.description.trim() !== '') {
                        descriptionHtml = marked(data.description); // Convert frontmatter description
                        console.log(`[${file}] Using description from FRONTMATTER.`);
                    }
                    // Otherwise, use the main body content if it exists
                    else if (content && content.trim() !== '') {
                        descriptionHtml = marked(content);
                        console.log(`[${file}] Using description from BODY content.`);
                    } else {
                         console.log(`[${file}] No description found in frontmatter or body.`);
                    }
                    console.log(`[${file}] Final Description HTML:\n---\n${descriptionHtml}\n---`);
                    // *** END UPDATED DESCRIPTION LOGIC ***


                    const slug = slugify(data.title || path.basename(file, '.md'));
                    materialData = {
                        slug: slug,
                        title: data.title || 'Untitled Material',
                        category: data.category || 'uncategorized',
                        style: data.style || 'default',
                        image: data.image || null,
                        mainDetailImage: data.mainDetailImage || data.image || null,
                        description: descriptionHtml, // Assign final parsed HTML
                        specs: data.specs || [],
                        gallery: data.gallery || [],
                        detailPageUrl: `/material-detail-${slug}.html`
                    };

                } catch (parseError) {
                     console.error(`Error parsing Markdown file ${file}:`, parseError);
                }
            }
            // Add JSON file processing here if needed

            if (materialData) {
                 allMaterialsForJson.push({
                     title: materialData.title,
                     category: materialData.category,
                     style: materialData.style,
                     image: materialData.image,
                     detailPage: materialData.detailPageUrl
                 });

                let detailHtml = templateHtml;
                const specsHtml = materialData.specs.map(spec => `<li><strong>${spec.name || ''}:</strong> ${spec.value || ''}</li>`).join('\n');
                const thumbnailsHtml = materialData.gallery.map((img, index) =>
                    `<img src="${img.image || ''}" alt="${img.alt || 'Thumbnail'}" data-large-src="${img.image || ''}" class="${index === 0 ? 'active' : ''}">`
                ).join('\n');

                detailHtml = detailHtml.replace(/{{TITLE}}/g, materialData.title);
                detailHtml = detailHtml.replace(/{{CATEGORY}}/g, materialData.category);
                detailHtml = detailHtml.replace(/{{CATEGORY_TITLE}}/g, titleCase(materialData.category));
                detailHtml = detailHtml.replace(/{{STYLE_TITLE}}/g, titleCase(materialData.style));
                detailHtml = detailHtml.replace(/{{MAIN_IMAGE_SRC}}/g, materialData.mainDetailImage);
                detailHtml = detailHtml.replace('{{DESCRIPTION_HTML}}', materialData.description);
                detailHtml = detailHtml.replace(/{{SPECS_HTML}}/g, specsHtml);
                detailHtml = detailHtml.replace(/{{THUMBNAILS_HTML}}/g, thumbnailsHtml);
                detailHtml = detailHtml.replace(/{{TITLE_URL_ENCODED}}/g, encodeURIComponent(materialData.title));

                const outputFilePath = path.join(outputHtmlDir, `material-detail-${materialData.slug}.html`);
                fs.writeFileSync(outputFilePath, detailHtml);
                console.log(` -> Generated detail page: ${outputFilePath}`);
            }
        } else {
             console.log(`Skipping directory: ${file}`);
        }
    });

    fs.writeFileSync(materialsJsonOutput, JSON.stringify(allMaterialsForJson, null, 2));
    console.log(`Successfully generated ${materialsJsonOutput} with ${allMaterialsForJson.length} material items.`);

} catch (error) {
    console.error("Error during content generation:", error);
    process.exit(1);
}

console.log(`--- Content Build Script Finished ---`);