const express = require('express');
const path = require('path');
const app = express();
const useClientRouter = require('./api-routes/clientController');
const writeDBFromCSV = require('./tasks/writeDBFromCSV');
const config = require('../config');

const PORT = config.server.port;
const WWW_PATH = config.server.static;

app.use(express.static(path.join(__dirname, WWW_PATH)));
app.use(express.json());
useClientRouter(app);

/**
 * Send static files for browser app
 */
app.get('/app/*', (req, res) => {
  res.sendFile(path.join(__dirname, WWW_PATH, 'index.html'));
});

app.get('/write-database', (req,res) => {
  writeDBFromCSV();
  res.send({message: 'Writing database from CSV files. See server console for information.'});
});


app.listen(PORT, () => console.log(`Client Record Resolution app is listening on port ${PORT}.`));
