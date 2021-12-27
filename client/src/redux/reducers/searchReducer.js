import makeFilterState from '../../lib/search/makeFilterState';
import { 
  UPDATE_SEARCH_FILTER,
  UPDATE_GLOBAL_SEARCH_FILTER,
  UPDATE_SEARCH_INDEX,
  UPDATE_SEARCH_RESULTS
} from '../actions/types/searchTypes';

const initialState = {
  results: null,
  filters: makeFilterState(),
  globalFilters: {
    active: true
  },
  index: {}
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SEARCH_FILTER: return { 
      ...state,  
      filters: mergeFilterState(state, action.payload),
    };

    case UPDATE_GLOBAL_SEARCH_FILTER: return { 
      ...state,  
      globalFilters: action.payload,
    };

    case UPDATE_SEARCH_RESULTS: return {
      ...state,
      results: action.payload,
    };

    case UPDATE_SEARCH_INDEX: return {
      ...state,
      index: action.payload
    }

    default: return state;
  }
}

function mergeFilterState(state, payload) {
  let filters = Object.assign({}, state.filters);
  Object.keys(payload).forEach(key => {
    filters[key] = payload[key];
  });

  return filters;
}

export default searchReducer;