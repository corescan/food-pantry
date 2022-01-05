const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const clientService = require('../services/clientService');

module.exports = async function generateMappingCSV(filename, fetchAll) {
  const filepath = path.join(__dirname, `../../system/report/${filename}`);

  console.log('WRITE PATH', filepath);
  console.log('FETCH ALL?', fetchAll);

  const fetchFn = fetchAll ? clientService.fetchAllMaps : clientService.fetchMapsNotExported;

  // fetch all maps
  const mapping = (await fetchFn()).rows;

  return createCsvWriter({
    path: filepath,
      header: [
        { id: 'true_id', title: 'true_id' },
        { id: 'duplicate_id', title: 'duplicate_id' }
      ]
    })
    .writeRecords(mapping)
    .then(() =>
      console.log(`Wrote new mapping report ${filename}`)
    );
}