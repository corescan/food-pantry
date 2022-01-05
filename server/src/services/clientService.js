const {pool, query, TABLES, TX} = require('../db');
const Client = require('../db/models/Client');

const sql = {
    FETCH_ALL_CLIENTS: `SELECT * FROM ${TABLES.CLIENTS}`,
    FETCH_CLIENT_BY_ID: `SELECT * FROM ${TABLES.CLIENTS} WHERE id = $1`,
    FETCH_MAPS_ALL: `SELECT * FROM ${TABLES.ID_MAP} ORDER BY true_id`,
    FETCH_MAPS_NOT_EXPORTED: `SELECT * FROM ${TABLES.ID_MAP} WHERE exported = false ORDER BY true_id`,
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
    let values = [true_id, ...dupe_ids];
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
    const dbClient = await pool.connect();
    try {
        await dbClient.query(TX.BEGIN);
        if (duplicate_ids && duplicate_ids.length) {
            mappingsResult = await insertMappings(true_id, duplicate_ids, dbClient);
            
            // Use result of mapping to insert to UPDATE each duplicate clients as mapped
            mappingsResult.rows.forEach(async (mapping) => {
                const id = mapping.duplicate_id;
                let result = await updateClient(id, { mapped: true, permanent: false }, dbClient);
                if (result && result.rowCount === 0) {
                    throw new Error(`Client ID ${permanent_id} does not exist.`);
                }
                clientUpdates.push(result.rows && result.rows[0]);
            });
        }

        // UPDATE permanent client as mapped
        let permanent_id = mappingsResult ? mappingsResult.rows[0].true_id : true_id;
        let result = await updateClient(permanent_id, { mapped: true, permanent: true }, dbClient);
        if (result && result.rowCount === 0) {
            throw new Error(`Client ID ${permanent_id} does not exist.`);
        }
        clientUpdates.push(result.rows && result.rows[0]);

        await dbClient.query(TX.COMMIT);
    } catch (err) {
        await dbClient.query(TX.ROLLBACK);
        console.error(err);
        throw err;
    } finally {
        dbClient.release();
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
    fetchAllMaps: async () => query(sql.FETCH_MAPS_ALL),
    fetchMapsNotExported: async () => query(sql.FETCH_MAPS_NOT_EXPORTED),
    fetchAllClients: async () => query(sql.FETCH_ALL_CLIENTS),
    fetchClientByID: async (id) => query(sql.FETCH_CLIENT_BY_ID, [id]),
    flagInactive: async () => query(sql.FLAG_INACTIVE)
}
