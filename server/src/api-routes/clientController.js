const { Router } = require('express');
const controller = require('../database/services/clientService');

const clientController = Router();

module.exports = app => app.use('/api/clients', clientController);

clientController.get('/', async (req, res) => {
    const clients = (await controller.fetchAllClients()).rows;
    res.json({ type: 'CLIENTS', size: clients.length, payload: clients });
});

/**
 * Post a mapping from duplicate IDs to true ID and mark client records "complete"
 */
clientController.post('/resolve', async (req, res) => {
    const { true_id, duplicate_ids } = req.body;
    let result;
    try {
        result = await controller.resolveClients(true_id, duplicate_ids);
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
    const mapping = (await controller.fetchAllMaps()).rows;
    res.json({ type: 'ID_MAP', size: mapping.length, payload: mapping })
});
