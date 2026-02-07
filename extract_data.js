const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const dataDir = path.join(__dirname, 'assets', 'Data Collections');
const outputFile = path.join(dataDir, 'extracted_raw_data.json');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.xlsx')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

try {
    const files = getAllFiles(dataDir);
    const allData = {};
    const summary = [];

    console.log(`Found ${files.length} Excel files.`);

    files.forEach(file => {
        const filename = path.basename(file);
        console.log(`Processing ${filename}...`);

        const workbook = XLSX.readFile(file);
        const fileData = {};
        const sheetSummaries = [];

        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            // Get raw data including empty cells to maintain structure if needed, but json usually skips them
            // defval: '' ensures empty cells are empty strings, not undefined
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            if (jsonData.length > 0) {
                fileData[sheetName] = jsonData;
                sheetSummaries.push({ name: sheetName, count: jsonData.length });
            }
        });

        if (Object.keys(fileData).length > 0) {
            allData[filename] = fileData;
            summary.push({
                filename: filename,
                sheets: sheetSummaries,
                totalRows: sheetSummaries.reduce((acc, s) => acc + s.count, 0)
            });
        }
    });

    fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2));

    console.log("\n--- Extraction Summary ---");
    summary.forEach(s => {
        console.log(`File: ${s.filename} (${s.totalRows} rows)`);
        s.sheets.forEach(sheet => {
            console.log(`  - Sheet: ${sheet.name} (${sheet.count} rows)`);
        });
    });
    console.log(`\nRaw data saved to ${outputFile}`);

} catch (err) {
    console.error("Error during extraction:", err);
}
