import {
    RECEIVE_CLIENTS,
    UPDATE_CLIENT,
    RECEIVE_MAPPING,
    ADD_TO_SELECTION,
    REMOVE_FROM_SELECTION,
    SWAP_SELECTION_AND_TARGET,
    INSERT_MAPPING,
    SET_TARGET
} from '../actions/types/clientTypes';

const initialState = {
    target: null,
    allClients: [],
    selection: null,
    mapping: {}
};

const processMapping = payload => {
    const mapping = {};
    console.log(payload);
    payload.forEach(map => {
        let dupes = mapping[map.true_id];
        if (!dupes) {
            dupes = [];
            mapping[map.true_id] = dupes;
        }
        dupes.push(map.duplicate_id);
    });
    return mapping;
};

const findAndRemove = (record, set) => {
    const { id } = record;
    return set.filter(rec => rec.id !== id);
}

const updateClient = (record, set) => {
    const index = set.findIndex(_r => _r.id === record.id);
    set.splice(index,1);
    set.push(record);
}

const clientReducer = (state = initialState, action) => {
    // console.log(action);
    switch (action.type) {
        case RECEIVE_MAPPING: 
            const mapping = processMapping(action.payload);
            return { 
                ...state,
                mapping: mapping
            };

        case RECEIVE_CLIENTS: 
            const sortedClients = action.payload.sort((_a,_b)=> _a.id > _b.id ? 1:-1);
            return { 
                allClients: sortedClients,
            };

        case ADD_TO_SELECTION: {
            const currentSel = state.selection || [];
            const updatedSel = currentSel.concat([action.payload]);
            return {
                ...state,
                selection: updatedSel,
            };
        }

        case REMOVE_FROM_SELECTION: {
            const updatedSel = findAndRemove(action.payload, state.selection);
            return {
                ...state,
                selection: updatedSel,
            };
        }

        case SWAP_SELECTION_AND_TARGET: {
            const updatedSel = findAndRemove(action.payload, state.selection)
                .concat([state.target]);

            return {
                ...state,
                target: action.payload,
                selection: updatedSel,
            };
        }

        case SET_TARGET: {
            return {
                ...state,
                target: action.payload,
                selection: []
            }
        }

        case INSERT_MAPPING: {
            let message = action.payload;
            return {
                ...state,
                mapping: processMapping(message.payload)
            }
        }

        case UPDATE_CLIENT: {
            const updatedClients = state.allClients.slice();
            let updates = action.payload;
            updates.forEach(record => updateClient(record, updatedClients));
            return {
                ...state,
                allClients: updatedClients
            }
        }

        default: return state;
    }
}

export default clientReducer;