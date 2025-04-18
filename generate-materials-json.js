import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter'; // Make sure gray-matter is installed

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const materialsDir = path.join(__dirname, 'src', 'data', 'materials');
// *** Corrected path for output file ***
const outputFile = path.join(__dirname, 'public', 'materials.json');
const allMaterials = [];

console.log(`Reading materials from: ${materialsDir}`);
console.log(`Writing combined JSON to: ${outputFile}`);

try {
    if (!fs.existsSync(materialsDir)) {
        console.warn(`Source directory ${materialsDir} not found. Skipping JSON generation.`);
        fs.writeFileSync(outputFile, JSON.stringify([]));
        process.exit(0);
    }

    const files = fs.readdirSync(materialsDir);
    console.log(`Found ${files.length} files/folders in materials directory.`);

    files.forEach(file => {
        const filePath = path.join(materialsDir, file);
        if (fs.statSync(filePath).isFile()) {
            if (file.endsWith('.md')) {
                console.log(`Processing Markdown file: ${file}`);
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                try {
                    const { data, content } = matter(fileContent);
                    const materialData = {
                        title: data.title || 'Untitled',
                        category: data.category || 'unknown',
                        style: data.style || 'other',
                        image: data.image || null,
                        detailPage: data.detailPage || null,
                        description: content.trim(),
                        specs: data.specs || [],
                        gallery: data.gallery || []
                    };
                    allMaterials.push(materialData);
                } catch (parseError) {
                    console.error(`Error parsing Markdown file ${file}:`, parseError);
                }
            } else if (file.endsWith('.json')) {
                 console.log(`Processing JSON file: ${file}`);
                 const fileContent = fs.readFileSync(filePath, 'utf-8');
                 try {
                    const data = JSON.parse(fileContent);
                    allMaterials.push(data);
                 } catch (parseError) {
                     console.error(`Error parsing JSON file ${file}:`, parseError);
                 }
            } else {
                 console.log(`Skipping non-md/json file: ${file}`);
            }
        } else {
             console.log(`Skipping directory: ${file}`);
        }
    });

    fs.writeFileSync(outputFile, JSON.stringify(allMaterials, null, 2));
    console.log(`Successfully generated ${outputFile} with ${allMaterials.length} material items.`);

} catch (error) {
    console.error("Error generating materials JSON:", error);
    process.exit(1);
}