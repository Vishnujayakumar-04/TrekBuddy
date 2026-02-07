const fs = require('fs');
const path = require('path');

const rawDataPath = path.join(__dirname, 'assets', 'Data Collections', 'extracted_raw_data.json');
const outputDir = path.join(__dirname, 'assets', 'Data Collections', 'Processed');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

// Helper to convert Excel time (fraction of day) or string to formatted time
function formatTime(val) {
    if (!val) return 'Not specified';
    if (typeof val === 'number') {
        const totalSeconds = Math.round(val * 86400);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const h = hours % 12 || 12;
        const m = minutes.toString().padStart(2, '0');
        return `${h}:${m} ${ampm}`;
    }
    return String(val).trim();
}

// Helper to clean strings
function cleanString(str) {
    if (!str) return '';
    return String(str).replace(/\s+/g, ' ').trim();
}

// Helper to generate ID
function generateId(name, category) {
    return (category + '_' + cleanString(name).toLowerCase().replace(/[^a-z0-9]+/g, '_')).substring(0, 50);
}

const report = {
    files: {},
    firestoreStructure: {}
};

// Mappings for different categories
const processors = {
    'AdventureActivities.xlsx': (sheetName, row) => {
        return {
            name: row['Activity Name'] || row[' Park  Name '] || row['Trek Name'],
            subCategory: row['Type'] || sheetName,
            location: row['Area'] || row['Start Point'],
            googleMapsUrl: row['Google Maps Link'],
            openingTimeWeekdays: formatTime(row['Opening Time']),
            closingTimeWeekdays: formatTime(row['Closing Time']),
            entryFee: row['Price Range'] || row['Ticket Price'],
            bestTimeToVisit: row['Best Time'] || row['Best Season'],
            safetyNotes: row['Safety Notes'],
            phoneNumber: row['Contact Number'],
            description: row['Notes'],
            famousFor: row['Activity Type (Boating/Kayaking/Surfing/etc)']
        };
    },
    'Beaches.xlsx': (sheetName, row) => {
        return {
            name: row['Beach Name'],
            subCategory: 'Beach',
            location: row['Location/Area'],
            googleMapsUrl: row['Google Maps Link'],
            openingTimeWeekdays: formatTime((row['Timings'] || '').split('–')[0]),
            closingTimeWeekdays: formatTime((row['Timings'] || '').split('–')[1]),
            entryFee: row['Entry Fee'],
            bestTimeToVisit: row['Best time to visit'],
            safetyNotes: row['Safety Level + Lifeguard availability'],
            phoneNumber: row['Contact (Beach authority if available)'],
            description: row['History or interesting info'],
            famousFor: row['Beach Type (Swimming allowed / Not allowed / Surfing / Sunset point etc)'],
            crowdLevel: row['Crowd level'],
            images: [row['Image url ']]
        };
    },
    'Hotels.xlsx': (sheetName, row) => {
        return {
            name: row['Name'],
            subCategory: sheetName,
            location: row['Location'],
            googleMapsUrl: row['Google Maps'] || row['Google Maps Link'],
            phoneNumber: row['Contact'],
            entryFee: row['Price'], // Price range for hotels
            description: `Room Types: ${row['Room Types']}. Rating: ${row['Rating']}`,
            openingTimeWeekdays: row['Check-in/Check-out time'], // Using this field for check-in/out
            images: [row['Images Url']]
        };
    },
    'Nature.xlsx': (sheetName, row) => {
        return {
            name: row['name'],
            subCategory: row['type'] || sheetName,
            location: row['location'],
            googleMapsUrl: row['Google maps'] || row['maps'],
            openingTimeWeekdays: formatTime((row['timing_weekday'] || row['timing'] || '').split('–')[0]),
            closingTimeWeekdays: formatTime((row['timing_weekday'] || row['timing'] || '').split('–')[1]),
            entryFee: row['entry_fee'] || row['fee'],
            description: row['description'],
            activities: row['activities'] || row['main_attractions'],
            phoneNumber: row['contact number'] || row['contact'],
            images: [row['image url'] || row['images']]
        };
    },
    'Pubs & Bars.xlsx': (sheetName, row) => {
        return {
            name: row['Pub Name'] || row['Bar Name'] || row['Lounge Name'] || row['Club Name'],
            subCategory: row['Type'] || sheetName,
            location: row['Area'],
            googleMapsUrl: row['Google Maps Link'],
            phoneNumber: row['Phone Number'],
            openingTimeWeekdays: formatTime(row['Opening Time']),
            closingTimeWeekdays: formatTime(row['Closing Time']),
            entryFee: row['Entry Fee'],
            dressCode: row['Dress Code'],
            crowdLevel: row['Crowd Level'],
            description: row['Notes']
        };
    },
    'Restraunts.xlsx': (sheetName, row) => {
        // Helper to parse time range like "12:00 PM - 10:30 PM" or "8:30 AM-10 PM"
        let openTime = row['Opening_Time'] || row['Open Time'];
        let closeTime = row['Closing_Time'];
        if (!openTime && row['Working Hours']) {
            const parts = row['Working Hours'].split('-');
            if (parts.length > 0) openTime = parts[0];
            if (parts.length > 1) closeTime = parts[1];
        }

        return {
            name: row['Restaurant Name'] || row['Cafe Name'] || row['Bakery Name'] || row['Shop Name'] || row['Stall Name'] || row['Name'],
            subCategory: row['Cuisine Type'] || row['Category'] || row['Food Type'] || row['Cuisine'] || sheetName,
            location: row['Area'] || row['Location'],
            googleMapsUrl: row['Google Maps Link'] || row['Google Maps'] || row['Maps Link'],
            phoneNumber: row['Phone Number'] || row['Contact Number'] || row['Contact'],
            openingTimeWeekdays: formatTime(openTime),
            closingTimeWeekdays: formatTime(closeTime),
            entryFee: row['Price for Two'] || row['Price Range'] || row['Price'] || row['Price Level'],
            famousFor: row['Must Try Dishes'] || row['Signature Dishes'] || row['Famous For'] || row['Must Try'] || row['Must Try Items'],
            description: row['Notes'] || row['Ambiance'] || row['Description'],
            image: row['Image url']
        };
    },
    'sos.xlsx': (sheetName, row) => {
        return {
            name: row['Name'] || row['Station Name'] || row['Hospital Name'] || row['Medical Centre Name'] || row['Police Station Name'] || row['Fire Station Name'],
            subCategory: row['Type'] || row['Hospital Type'] || row['Type (Clinic/Pharmacy)'] || row['Police Type'] || sheetName,
            location: row['Area'] || row['Location'] || row['Area Covered'],
            googleMapsUrl: row['Google Maps Link'],
            phoneNumber: row['Contact Number'] || row['Emergency Contact'] || row['Phone Number'] || row['Emergency Number'],
            openingTimeWeekdays: row['Weekday Timings'] || row['Operating Hours'] || '24x7',
            closingTimeWeekdays: row['Weekend Timings'] || row['Operating Hours'] || '24x7',
            description: row['Specialty'] || row['Jurisdiction'] || row['Service Area'] || row['Rescue Services'] || row['Best For'] || row['Description']
        };
    },
    'Temples.xlsx': (sheetName, row) => {
        return {
            name: row['Temple Name'] || row['Temple Name '] || row['Church Name'] || row['Mosque Name '] || row['Jain Temple'] || row['Buddhist → Temple / Meditation Centre'] || row['Name'],
            subCategory: sheetName, // Religion/Type
            religion: sheetName,
            location: row['Area'] || row['Location /Area Name '] || row['Location'],
            googleMapsUrl: row['Google Maps Link'] || row['Google Maps link'] || row['Google Maps'],
            openingTimeWeekdays: formatTime(row['Opening Time'] || row['Opening & closing Time in week days ']),
            closingTimeWeekdays: formatTime(row['Closing Time'] || row['Opening & closing Time in week days ']),
            description: row['History / Significance'] || row['Significance'] || row['Description'] || row['Details Description / History '],
            famousFor: row['Main Deity'] || row['Architectural Style'] || row['Denomination'] || row['Deity / Denomination'],
            bestTimeToVisit: row['Famous Festival'] || row['Prayer Times'] || row['Special Occasions / Festivals']
        };
    }
};

const finalData = {};

Object.keys(rawData).forEach(filename => {
    const fileData = rawData[filename];
    const categoryName = filename.replace('.xlsx', '');
    const processedItems = [];
    let removedCount = 0;
    let validCount = 0;
    const sheetSummary = [];

    Object.keys(fileData).forEach(sheetName => {
        const rows = fileData[sheetName];
        // sheetSummary.push({ name: sheetName, count: rows.length });

        rows.forEach(row => {
            const processor = processors[filename];
            if (!processor) return;

            const normalized = processor(sheetName, row);

            // Basic validation
            if (!cleanString(normalized.name) || !cleanString(normalized.location)) {
                removedCount++;
                return;
            }

            // Duplicate check (simple name check within category)
            if (processedItems.some(i => cleanString(i.name).toLowerCase() === cleanString(normalized.name).toLowerCase())) {
                removedCount++;
                return;
            }

            // Final standard structure
            const item = {
                id: generateId(normalized.name, categoryName),
                category: categoryName,
                subCategory: cleanString(normalized.subCategory),
                name: cleanString(normalized.name),
                location: cleanString(normalized.location),
                address: cleanString(normalized.address) || cleanString(normalized.location), // Fallback
                googleMapsUrl: cleanString(normalized.googleMapsUrl),
                openingTimeWeekdays: normalized.openingTimeWeekdays || 'Not specified',
                closingTimeWeekdays: normalized.closingTimeWeekdays || 'Not specified',
                openingTimeWeekends: normalized.openingTimeWeekdays || 'Not specified', // Default to same
                closingTimeWeekends: normalized.closingTimeWeekdays || 'Not specified',
                description: cleanString(normalized.description),
                images: normalized.images || (normalized.image ? [normalized.image] : []),
                entryFee: normalized.entryFee ? cleanString(String(normalized.entryFee)) : 'Free',
                dressCode: cleanString(normalized.dressCode) || 'Not specified',
                phoneNumber: normalized.phoneNumber ? cleanString(String(normalized.phoneNumber)) : '',
                crowdLevel: cleanString(normalized.crowdLevel) || 'Medium',
                bestTimeToVisit: cleanString(normalized.bestTimeToVisit) || 'All year',
                famousFor: cleanString(normalized.famousFor) || '',
                safetyNotes: cleanString(normalized.safetyNotes) || '',
                lastVerified: new Date().toISOString()
            };

            if (item.entryFee === 'undefined') item.entryFee = 'Free';
            if (item.phoneNumber === 'undefined') item.phoneNumber = '';

            if (categoryName === 'Temples') {
                item.religion = cleanString(normalized.religion);
            }

            // Filter images
            if (item.images) {
                item.images = item.images.filter(x => x && !x.includes('share.google') && x.startsWith('http'));
            }

            processedItems.push(item);
            validCount++;
        });
    });

    if (processedItems.length > 0) {
        fs.writeFileSync(path.join(outputDir, `${categoryName}.json`), JSON.stringify(processedItems, null, 2));
        finalData[categoryName] = processedItems;
    }

    report.files[filename] = {
        validPlaces: validCount,
        removedRows: removedCount,
        schema: "Standardized v1",
        sheets: Object.keys(fileData).join(', ')
    };

    // Firestore structure recommendation
    report.firestoreStructure[categoryName] = {
        collectionPath: `places/${categoryName}/items`,
        documentId: "{id}",
        fields: Object.keys(processedItems[0] || {})
    };
});

fs.writeFileSync(path.join(outputDir, 'processing_report.json'), JSON.stringify(report, null, 2));
console.log('Processing complete. Report saved.');
