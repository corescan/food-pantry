import {
  RECEIVE_CLIENTS,
  UPDATE_CLIENT,
  RECEIVE_MAPPING,
  ADD_TO_SELECTION,
  REMOVE_FROM_SELECTION,
  SWAP_SELECTION_AND_TARGET,
  INSERT_MAPPING,
  SET_TARGET
} from './types/clientTypes';

export const receiveClients = (clients) => {
  return async (dispatch) => {
      dispatch({ type: RECEIVE_CLIENTS, payload: clients })
  }
}

export const receiveMaps = maps => {
  return async (dispatch) => {
    dispatch({ type: RECEIVE_MAPPING, payload: maps })
  }
}

export const insertMapping = (map) => {
  return async (dispatch) => {
      dispatch({ type: INSERT_MAPPING, payload: map })
  }
}

export const updateClients = (message) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_CLIENT, payload: message.payload })
  }
}

export const resolveClients = (payload) => {
  return async (dispatch) => {
    const mapping = payload.find(msg => msg.type === 'CREATE_MAPPING');
    const clients = payload.find(msg => msg.type === 'UPDATE_CLIENT');
    insertMapping(mapping)(dispatch);
    updateClients(clients)(dispatch);
  }
}

export const addToSelection = record => {
  return async (dispatch) => {
    dispatch({ type: ADD_TO_SELECTION, payload: record })
  }
}

export const removeFromSelection = record => {
  return async (dispatch) => {
      dispatch({ type: REMOVE_FROM_SELECTION, payload: record })
  }
}

export const swapSelectionAndTarget = record => {
  return async dispatch => {
    dispatch({ type: SWAP_SELECTION_AND_TARGET, payload: record})
  }
}

export const setTarget = record => {
  return async dispatch => {
    dispatch({ type: SET_TARGET, payload: record})
  }
}
