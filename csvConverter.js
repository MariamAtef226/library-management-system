const fs = require('fs');

// Sample data to export
const data = [
    { name: 'John Doe', age: 30, email: 'john@example.com' },
    { name: 'Jane Smith', age: 25, email: 'jane@example.com' },
];

// Function to convert an object to CSV format
function convertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let csv = '';
    // Append CSV header
    csv += Object.keys(array[0]).join(',') + '\n';
    // Append CSV rows
    array.forEach(item => {
        csv += Object.values(item).join(',') + '\n';
    });
    return csv;
}

// Function to export data to a CSV file
function exportToCSV(data, fileName) {
    const csv = convertToCSV(data);
    fs.writeFileSync(fileName, csv);
    console.log(`Data exported to ${fileName}`);
}

// Example usage
exportToCSV(data, 'exported_data.csv');
