function convertToCSV(dataArray) {
    if (dataArray.length === 0) return "";
  
    const keys = Object.keys(dataArray[0]); // take keys from first object
    const header = keys.join(","); // CSV header
    const rows = dataArray.map(row =>
      keys.map(k => {
        let cell = row[k];
        if (typeof cell === 'string') {
          // Escape quotes
          cell = cell.replace(/"/g, '""');
        }
        return `"${cell}"`; // wrap each cell in quotes
      }).join(",")
    );
  
    return [header, ...rows].join("\n");
  }

  export { convertToCSV };