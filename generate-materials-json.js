import fs from 'fs'; // Use import for fs
import path from 'path'; // Use import for path
import { fileURLToPath } from 'url'; // Helper to convert URL to path

// Add 'gray-matter' if needed and installed: import matter from 'gray-matter';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const materialsDir = path.join(__dirname, 'src', 'data', 'materials');
const outputFile = path.join(__dirname, 'public', 'materials.json');
const allMaterials = [];

try {
    const files = fs.readdirSync(materialsDir);

    files.forEach(file => {
        if (file.endsWith('.json')) {
            const filePath = path.join(materialsDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            try {
                const data = JSON.parse(fileContent);
                allMaterials.push(data);
            } catch (parseError) {
                console.error(`Error parsing JSON file ${file}:`, parseError);
            }
        }
        /* Example for Markdown with frontmatter:
        else if (file.endsWith('.md')) {
            const filePath = path.join(materialsDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            try {
                const { data, content } = matter(fileContent); // Use gray-matter (requires import)
                data.description = content;
                allMaterials.push(data);
            } catch (parseError) {
                 console.error(`Error parsing Markdown file ${file}:`, parseError);
            }
        } */
    });

    fs.writeFileSync(outputFile, JSON.stringify(allMaterials, null, 2));
    console.log(`Successfully generated ${outputFile} with ${allMaterials.length} items.`);

} catch (error) {
    console.error("Error generating materials JSON:", error);
    process.exit(1); // Exit build process on error
}