const {query, TABLES} = require('../db');
const Registration = require('../db/models/Registration');

async function insertRegistration(values) {
    let valStr = '';
    for (let _i in Registration.columnNames) {
        if (_i > 0) {
            valStr += ','
        }
        valStr += `$${Number(_i)+1}`;
    } 
    const sql = `INSERT INTO ${TABLES.REGISTRATIONS}
        (${Registration.columnNames.toString()})
        VALUES (${valStr})
        ON CONFLICT (id) DO NOTHING`;
    return query(sql, values);
}

module.exports = {
  insertRegistration
}