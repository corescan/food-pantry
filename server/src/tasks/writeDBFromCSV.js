const csv = require('csv-parser');
const path = require('path');
const fs = require('fs');
const Client = require('../database/models/Client');
const Registration = require('../database/models/Registration');
const { insertClient } = require('../database/services/clientService');
const { insertRegistration } = require('../database/services/registrationService');


module.exports =  async function writeDBFromCSV() {
    return writeClients().then(res => {
        console.log(res);
        return writeRegistrations().then(res => console.log(res));
    });
}

function writeClients() {
    return new Promise(res => {
        let clientTotal = 0;
        fs.createReadStream(path.resolve(__dirname, '../../data/food_pantry_clients.csv'))
            .pipe(csv())
            .on('data', async row => {
                const client = new Client(row);
                const response = await insertClient(client.getValues());
                if (!response) {
                    console.log(client.getValues());
                }
                clientTotal += response.rowCount;
            })
            .on('end', () => {
                res({
                    message:`"All Clients" CSV processed: ${clientTotal} inserted`,
                    rowCount: clientTotal
                });
            }
        );
    });
}

function writeRegistrations() {
    return new Promise(res => {
        let registrationTotal = 0;
        fs.createReadStream(path.resolve(__dirname, '../../data/food_pantry_registrations.csv'))
            .pipe(csv())
            .on('data', async row => {
                const reg = new Registration(row);
                const response = await insertRegistration(reg.getValues());
                if (!response) {
                    console.log(reg.getValues());
                }
                registrationTotal += response.rowCount;
            })
            .on('end', () => {
                res({
                    message:`"Registrations" CSV processed: ${registrationTotal} inserted`,
                    rowCount: registrationTotal
                });
            }
        );
    })
}