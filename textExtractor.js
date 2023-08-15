const fs = require('fs');
const path = require('path');

// Function to recursively traverse directories and extract text using regex
function extractTextFromFile(filePath, regex) {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const matches = fileContents.match(regex);

        if (matches) {
            return matches.map(match => match.trim());
        } else {
            return [];
        }
    } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);
        return [];
    }
}

// Function to process a directory recursively
function processDirectory(directoryPath, regex) {
    const files = fs.readdirSync(directoryPath);

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);

        if (fs.statSync(filePath).isDirectory()) {
            processDirectory(filePath, regex);
        } else {
            if (!filePath.includes('node_modules') && !filePath.includes('dist')) {
                const extractedElements = extractTextFromFile(filePath, regex);
                if (extractedElements.length > 0) {
                    extractedElements.forEach(element => {
                        const trimmed = trimTestDescription(element);
                        // console.log(`Text extracted from ${filePath}:`);
                        console.log(trimmed);
                    });
                }
            }
        }
    });
}

function trimTestDescription(description) {
    if (typeof description !== 'string') {
        return description;
    }
    
    // Remove "it('" prefix and trailing single quote
    const trimmedDescription = description.replace(/^it\('(.+)'$/, '$1');

    return trimmedDescription;
}

// Main function
function main() {
    const args = process.argv.slice(2);

    if (args.length !== 1) {
        console.error('Usage: node app.js <folderPath>');
        return;
    }

    const folderPath = args[0];
    const regex = /it\(\s*'([^']+)'/g; // Modify the regex as needed

    console.log(`Searching for text in files under ${folderPath}`);
    processDirectory(folderPath, regex);
}

main();
