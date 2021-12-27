
// DEPRECATED / UNUSED

export default function search(records, filterState) {
  const filterFns = getFilterFunctions(filterState);
  let searchResults = [];

  if (filterFns.length === 0) {
    return null;
  }

  records.forEach(_r => {
    let match = true;
    filterFns.forEach(fn => {
      match &&= fn(_r);
    });
    if (match) {
      searchResults.push(_r);
    }
  });

  return searchResults;
}

function getFilterFunctions(filterState) {
  const filterFunctions = [];
  Object.keys(filterState).forEach(key => {
    if (key !== 'text' && filterState[key].enabled) {
      const filterVal = filterState[key].value.toLowerCase();
      filterFunctions.push(record => record[key] && record[key].toLowerCase().includes(filterVal));
    }
  });

  if (filterState.text.enabled && filterState.text.value.length > 2) {
    const searchTerms = filterState.text.value.trim().split(/\s+/);
    // console.log('SEARCH TERMS', searchTerms);
    const textFilter = record => {
      let result = true;
      searchTerms.forEach(term => {
        let match = false;
        term = term.toLowerCase();
        Object.keys(record).forEach(key => {
          let val = record[key];
          if (typeof val !== 'string') {
            match ||= false;
          } else {
            val = val.toLowerCase();
            match ||= val.length && ((val.includes(term) || term.includes(val)));
            // if (match) console.log('Matched:', term, val);
          }
        });
        result &&= match; 
      });
      
      return result;
    }

    filterFunctions.push(textFilter);
  }
  return filterFunctions;
}
