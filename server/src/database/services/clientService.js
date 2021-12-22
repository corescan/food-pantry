const {pool, query, TABLES, TX} = require('../db');
const Client = require('../models/Client');

const sql = {
    FETCH_ALL_CLIENTS: `SELECT * FROM ${TABLES.CLIENTS}`,
    FETCH_ALL_MAPS: `SELECT * FROM ${TABLES.ID_MAP}`,
    FLAG_INACTIVE: `UPDATE clients SET active = false WHERE id IN
    (SELECT client_id FROM registrations 
     WHERE create_date < '06/29/2021'::date AND client_id IS NOT null)
     AND id NOT IN
    (SELECT client_id FROM registrations 
     WHERE create_date >= '06/29/2021'::date AND client_id IS NOT null);`
}

function sqlValueTemplate(arr) {
    let template = []
    for (let _i=0; _i<arr.length; _i++) {
        template[_i] = `$${_i + 1}`;
    }
    return template.join(',');
}

async function insertClient(table, values) {
    const sql = `INSERT INTO ${table} (${Client.columnNames.toString()})
        VALUES (${sqlValueTemplate(Client.columnNames)})
        ON CONFLICT (id) DO NOTHING`;
    return query(sql, values);
}

// async function fetchClients(idArray, client)  {
//     const sql = `SELECT * FROM ${TABLES.ID_MAP} WHERE true_id in ${sqlValueTemplate(idArray)}`;
//     let queryFn = client ? client.query : query;
//     return queryFn(sql, idArray);
// }

async function insertMappings(true_id, dupe_ids, dbClient) {
    let values = [true_id].concat(dupe_ids);
    const valueTemplate = dupe_ids.map((_id, index) => `($1, $${index + 2})`).join(',');
    const sql = `INSERT INTO ${TABLES.ID_MAP} (true_id, duplicate_id) VALUES ${valueTemplate} RETURNING *`;
    let queryFn = dbClient ? dbClient.query : query;
    return queryFn.call(dbClient, sql, values);
}

// async function fetchMappings(id, client) {
//     const sql = `SELECT * FROM ${TABLES.ID_MAP} WHERE true_id = $1`;
//     let queryFn = client ? client.query : query;
//     return queryFn(sql, [id]);
// }

async function updateClient(id, values, dbClient) {
    const objectKeys = Object.keys(values);
    const columnNames = objectKeys.join(',');
    let valueArray = [];
    let valueTemplateArray = [];
    objectKeys.forEach((key,index) => {
        valueArray[index] = values[key];
        valueTemplateArray[index] = `$${index+1}`;
    });
    const sql = `UPDATE clients SET (${columnNames}) = (${valueTemplateArray.join(',')}) WHERE id = ${id} RETURNING *`;
    let queryFn = dbClient ? dbClient.query : query;
    return queryFn.call(dbClient, sql, valueArray);
}

async function resolveClients(true_id, duplicate_ids) {
    let mappingsResult;
    let clientUpdates = [];

    /**
     * Transaction: insert maps, update users.
     * */
    const client = await pool.connect();
    try {
        await client.query(TX.BEGIN);
        if (duplicate_ids && duplicate_ids.length) {
            mappingsResult = await insertMappings(true_id, duplicate_ids, client);
        }
        // UPDATE permanent client as mapped
        let result = await updateClient(true_id, { mapped: true, permanent: true }, client);
        clientUpdates.push(result.rows && result.rows[0]);

        // UPDATE each nonpermanent (duplicate) clients as mapped
        duplicate_ids.forEach(async (id) => {
            result = await updateClient(id, { mapped: true, permanent: false }, client);
            clientUpdates.push(result.rows && result.rows[0]);
        });
        await client.query(TX.COMMIT);
    } catch (err) {
        await client.query(TX.ROLLBACK);
        console.error(err);
        throw err;
    } finally {
        client.release();
    }

    return {
        mappings: mappingsResult ? mappingsResult.rows : [],
        clientUpdates: clientUpdates
    };
}

module.exports = {
    insertClient: async (values) => insertClient(TABLES.CLIENTS, values),
    insertOneGoodClients: async (values) => insertClient(TABLES.GOOD_CLIENTS, values),
    updateClient: updateClient,
    resolveClients: resolveClients,
    fetchAllMaps: async () => query(sql.FETCH_ALL_MAPS),
    fetchAllClients: async () => query(sql.FETCH_ALL_CLIENTS),
    flagInactive: async () => query(sql.FLAG_INACTIVE)
}
