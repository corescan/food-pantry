const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const clientService = require('../services/clientService');

module.exports = async function generateMappingCSV(filename) {
  const filepath = path.join(__dirname, `../../system/report/${filename}`);

  console.log('WRITE PATH', filepath);

  // fetch all maps
  const mapping = (await clientService.fetchAllMaps()).rows;

  const csvWriter = createCsvWriter({
    path: filepath,
      header: [
        { id: 'true_id', title: 'true_id' },
        { id: 'duplicate_id', title: 'duplicate_id' }
      ]
    });

  return csvWriter
    .writeRecords(mapping)
    .then(() =>
      console.log(`Wrote new mapping report ${filename}`)
    );
}