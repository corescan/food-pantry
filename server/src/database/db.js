const pg = require('pg');
const config = require('../../config');

const {
    user,
    pass,
    host,
    database,
    port
} = config.pg;
// console.log('DB CONFIG', user, host, database, pass, port);

const pool = new pg.Pool({
    user: user,
    host: host,
    database: database,
    password: pass,
    port: port,
});

const TABLES = {
    CLIENTS: 'clients',
    GOOD_CLIENTS: 'good_clients',
    REGISTRATIONS: 'registrations',
    ID_MAP: 'client_id_map'
};

const TX = {
    BEGIN: 'BEGIN',
    ROLLBACK: 'ROLLBACK',
    COMMIT: 'COMMIT'
}

async function query(sql, values) {
    let res;
    try {
        res = await pool.query(sql, values);
    } catch(err) {
        console.error(err.message);
        throw err
    }
    return res;
}

module.exports = {
    pool,
    query,
    TX,
    TABLES
};
