import Fuse from 'fuse.js';
import {
  UPDATE_SEARCH_FILTER,
  UPDATE_SEARCH_RESULTS,
  UPDATE_SEARCH_INDEX
} from './types/searchTypes';

export const updateSearchFilters = filters => {
  return async (dispatch) => {
      dispatch({ type: UPDATE_SEARCH_FILTER, payload: filters })
  }
}

function mergeScore(result, scoredClients) {
  let client = scoredClients[result.item.id];
  if (!client) {
    client = Object.assign({}, result.item);
    scoredClients[client.id] = client;
    client.score = 0;
  }
  client.score += (1 - result.score);
}

export const updateSearchResults = (index, target, filterState) => {
  if (!index || !Object.keys(index).length) {
    return async (dispatch) => {
      dispatch({
        type: UPDATE_SEARCH_RESULTS,
        payload: []
      });
    }; 
  }
  let results;
  const scoredClients = {};
  const { firstname,
    lastname,
    phone,
    address } = filterState;
  const fullnameEnabled = firstname.enabled && lastname.enabled;

  if (fullnameEnabled) {
    results = index.fullname.search(`${firstname.value} ${lastname.value}`);
    results.forEach(result => mergeScore(result, scoredClients));
  } 
  if (!fullnameEnabled && firstname.enabled) {
    results = index.firstname.search(filterState.firstname.value);
    results.forEach(result => mergeScore(result, scoredClients));
  }
  if (!fullnameEnabled && lastname.enabled) {
    results = index.lastname.search(filterState.lastname.value);
    results.forEach(result => mergeScore(result, scoredClients));
  }
  if (phone.enabled) {
    results = index.phone.search(phone.value);
    results.forEach(result => mergeScore(result, scoredClients));
  }
  if (address.enabled) {
    results = index.address.search(address.value);
    results.forEach(result => mergeScore(result, scoredClients));
  }

  // filter out target
  const storeResults = Object.values(scoredClients)
    .filter(_c => _c.id !== target.id)
    .sort((_a,_b) => _a.score < _b.score ? 1 : -1);

  return async (dispatch) => {
      dispatch({
        type: UPDATE_SEARCH_RESULTS,
        payload: storeResults
      });
  };
}

export const updateSearchIndex = clients => {
  // search only unmapped clients
  clients = clients.filter(_c => !_c.mapped);
  
  const fullnameIndex = new Fuse(clients.map(_c => { 
    return Object.assign(_c, {
      id: _c.id,
      fullname: `${_c.firstname} ${_c.lastname}`
    })}), 
    {
      includeScore: true,
      threshold: 0.3,
      keys: ['fullname'],
    });
  const firstnameIndex = new Fuse(clients, {
    includeScore: true,
    threshold: 0.3,
    keys: ['firstname'],
  });
  const lastnameIndex = new Fuse(clients, {
    includeScore: true,
    threshold: 0.3,
    keys: ['lastname'],
  });
  const phoneIndex = new Fuse(clients, {
    includeScore: true,
    threshold: 0.1,
    keys: ['phone'],
  });
  const addressIndex = new Fuse(clients.map(_c => { 
    return {id: _c.id, address: _c.address}
  }), {
    includeScore: true,
    threshold: 0.3,
    keys: ['address'],
  });

  return async (dispatch) => {
    dispatch({
      type: UPDATE_SEARCH_INDEX,
      payload: {
        fullname: fullnameIndex,
        firstname: firstnameIndex,
        lastname: lastnameIndex,
        phone: phoneIndex,
        address: addressIndex
      }
    })
  } 
}
