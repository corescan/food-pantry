const express = require('express');
const path = require('path');
const config = require('../config');

const useClientRouter = require('./routing/clientController');
const useSystemRouter = require('./routing/systemController');

const PORT = config.server.port;
const WWW_PATH = config.server.static;

const server = express();
server.use(express.static(path.join(__dirname, WWW_PATH)));
server.use(express.json());
useClientRouter(server);
useSystemRouter(server);

/**
 * Send static files for browser app
 */
server.get('/app/*', (req, res) => {
  res.sendFile(path.join(__dirname, WWW_PATH, 'index.html'));
});

server.listen(PORT, () => console.log(`Client Record Resolution app is listening on port ${PORT}.`));
