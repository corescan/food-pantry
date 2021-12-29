const { Router } = require('express');
const clientService = require('../services/clientService');

const clientController = Router();

module.exports = app => app.use('/api/clients', clientController);

clientController.get('/', async (req, res) => {
    const clients = (await clientService.fetchAllClients()).rows;
    res.json({ type: 'CLIENTS', size: clients.length, payload: clients });
});

/**
 * Post a mapping from duplicate IDs to true ID and mark client records "complete"
 */
clientController.post('/resolve', async (req, res) => {
    const { true_id, duplicate_ids } = req.body;
    const clientIDs = [true_id, ...duplicate_ids];
    let result;

    // VERIFY VALID IDs
    try {
        for (_i in clientIDs) {
            let output = await clientService.fetchClientByID(clientIDs[_i]);
            if ((!output || !output.rows) || output.rows.length === 0) {
                throw new Error(`ID ${clientIDs[_i]} is not a valid client ID.`);
            }
        }
    } catch(err) {
        res.statusCode = 406;
        res.json({
            type: 'ERROR',
            message: `There was an error with the submission:  "${err.message}"`,
            payload: err
        });
        return;
    }

    // INSERT MAPPINGS TO DATABASE
    try {
        result = await clientService.resolveClients(true_id, duplicate_ids);
    } catch(err) {
        res.statusCode = 500;
        res.json({
            type: 'ERROR',
            message: err.message,
            payload: err
        });
        return;
    }

    let payload = [];
    payload.push({
        type: 'UPDATE_CLIENT',
        size: result.clientUpdates.length,
        payload: result.clientUpdates
    });

    payload.push({
        type: 'CREATE_MAPPING',
        size: result.mappings.length,
        payload: result.mappings
    })

    res.statusCode = 200;
    res.json({
        type: 'MULTIPLE',
        size: payload.length,
        payload: payload
    });
});

clientController.get('/map', async (req, res) => {
    const mapping = (await clientService.fetchAllMaps()).rows;
    res.json({ type: 'ID_MAP', size: mapping.length, payload: mapping })
});
