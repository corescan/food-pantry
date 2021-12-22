const { fetchAllClients } = require("../database/clientController");

/**
 * Select * from all clients
 * For each Client
 *      Search all clients where:
 *          number is very similar
 *          name is very similar
 *          address is very similar
 */

function mapDuplicateRecords (masterList) {
    const checklist = [];
    const duplicateMappings = [];
    const duplicateNumberRecords = [];

    let totalDupes = 0;
    while (checklist.length) {
        const record = checklist.pop();
        const dupes = [];
        const removeIndices = []

        checklist.forEach((rec, idx) => {

            if (record.phone === rec.phone) {
                dupes.push(rec);
                removeIndices.push(idx);
            }
        });

        // console.log(idx.length, 'duplicates');
        if (dupes.length) {
            duplicateMappings.push({
                record: record,
                dupes: dupes
            });

            totalDupes += dupes.length;
        }

        for (idx in removeIndices) {
            duplicateNumberRecords.push(checklist.splice(idx,1));
        }
    }

    // console.log('Duplicate Numbers', duplicateMappings[0]);
    console.log('Total Duplicates', totalDupes);
}

function countUniqueFields(masterList, field) {

    const countMap = {}
    masterList.forEach(_c => {
        let val = _c[field];
        if (typeof val === 'string') {
            val = val.toLowerCase();
        }
        if (!countMap[val]) {
            countMap[val] = 1;
        } else {
            countMap[val]++;
        }
    });

    console.log(`Unique ${field} count:`, Object.keys(countMap).length);

    let sum = 0;
    Object.values(countMap).forEach(val => {
        sum += val;
    });

    if (field === 'fullname') {
        // const sortByName = Object.keys(countMap).sort((a,b) => a > b ? 1 : -1);
        const sortByCount = Object.keys(countMap).sort((a,b) => countMap[a] > countMap[b] ? -1 : 1);
        sortByCount.forEach(name => {
            if (countMap[name] > 1) {
                console.log(`${name}: ${countMap[name]}`);
            }
        })
    }

    if (sum !== masterList.length) {
        console.error(`Error, found ${sum}, but should have ${masterList.length}.`);
    }
}

module.exports = async function searchForDuplicates() {
    const allClientsMaster = (await fetchAllClients()).rows;
    const length = allClientsMaster.length;
    // console.log('FIRST RECORD', allClientsMaster[0].id);
    // console.log('LAST RECORD', allClientsMaster[length - 1].id);
    console.log('TOTAL RECORDS', length);
    allClientsMaster.sort((a,b) => {
        return a > b ? 1 : -1;
    });
    allClientsMaster.forEach(_c => {
        _c.fullname = `${_c.firstname} ${_c.lastname}`;
    });

    countUniqueFields(allClientsMaster, 'phone');
    countUniqueFields(allClientsMaster, 'fullname');
};
