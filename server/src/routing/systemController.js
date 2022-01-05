const { Router } = require('express');
const path = require('path');
const config = require('../../config');
const writeDBFromCSV = require('../tasks/writeDBFromCSV');
const generateMappingCSV = require('../tasks/generateMappingCSV');

const systemController = Router();
module.exports = server => server.use('/system', systemController);

systemController.get('/write-database', (req,res) => {
  writeDBFromCSV();
  res.send({message: 'Writing database from CSV files. See server console for information.'});
});

systemController.get('/report', async (req,res) => {
  const { fetchAll } = req.query;

  // gen csv
  const jsDate = new Date();

  const date = [
    jsDate.getFullYear(),
    jsDate.getMonth()+1,
    jsDate.getDate()
  ];
  const time = [
    jsDate.getHours(),
    jsDate.getMinutes(),
    jsDate.getSeconds()
  ]
  const dateTime = date.join('-') + '__' + time.join('');
  const filename = config.report.filename.replace('CURRENT_TIME', dateTime);
  
  generateMappingCSV(filename, fetchAll)
    .then(() => {
      // download csv
      const filepath = path.join(__dirname, `../../system/report/${filename}`);
      res.download(filepath);
    });
});
