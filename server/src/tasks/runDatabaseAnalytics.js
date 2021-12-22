const searchForDuplicates = require("./lib/searchForDuplicates");
const writeDBFromCSV = require("./lib/writeDBFromCSV");

(async function main() {
    await writeDBFromCSV();
    searchForDuplicates();
})();
