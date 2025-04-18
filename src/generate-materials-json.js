const fs = require('fs');
const path = require('path');
// Add 'gray-matter' if you store data as Markdown with YAML frontmatter
// const matter = require('gray-matter');

const materialsDir = path.join(__dirname, 'src', 'data', 'materials');
const outputFile = path.join(__dirname, 'public', 'materials.json');
const allMaterials = [];

try {
    const files = fs.readdirSync(materialsDir);

    files.forEach(file => {
        // Process only .json or .md files (adjust as needed)
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
        // Example for Markdown with frontmatter:
        /* else if (file.endsWith('.md')) {
            const filePath = path.join(materialsDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            try {
                const { data, content } = matter(fileContent); // Use gray-matter
                data.description = content; // Add markdown content to description field
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