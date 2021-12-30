import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useKeyPress from '../../../lib/hooks/useKeyPress';
import css from './MappingView.module.css';

import RecordTile from '../../components/RecordTile';
import ClientList from '../../components/ClientList';

const findClient = (id, clients) => {
  let record = clients.find(_c => _c.id === id);
  if (!record && !isNaN(id)) {
    record = {
      id: id,
      firstname: null,
      lastname: 'INVALID ID',
      phone: null,
      address: null,
      active: null,
      invalid: true
    }
  }
  return record;
}

const validateIDs = (idList, clientList) => {
  let valid = true;
  idList.forEach(id => {
    valid = clientList.findIndex(_c => _c.id === id) > -1 && valid;
  })
  return valid;
}

export default function MappingView() {
  const nav = useNavigate();
  const [ showInvalidOnly, setShowInvalidOnly ] = useState(true);
  const trueID = Number(useParams().trueId);
  const { clients = [], mapping = {} } = useSelector(({ clientReducer }) => { 
    return {
      clients: clientReducer.allClients,
      mapping: clientReducer.mapping
    }
  });
  const upPress = useKeyPress("ArrowUp");
  const downPress = useKeyPress("ArrowDown");

  const mapArray = Object.keys(mapping).map(key => {
    return {
      trueID: Number(key),
      dupeIDs: mapping[key]
    }
  });

  const visibleMapArray = showInvalidOnly ? (mapArray).filter(_m => !validateIDs([_m.trueID, ..._m.dupeIDs], clients)) : mapArray;

  const trueIDs = visibleMapArray.map(_m => Number(_m.trueID)).sort((a,b) => a > b ? 1 : -1);
  const currentIndex = trueIDs.indexOf(trueID);

  useEffect(() => {
    if (downPress && currentIndex > 0) {
      nav(`/mapping/${trueIDs[currentIndex-1]}`)
    }
  }, [downPress]);

  useEffect(() => {
    if (upPress && currentIndex < trueIDs.length - 1) {
      nav(`/mapping/${trueIDs[currentIndex+1]}`)
    }
  }, [upPress]);

  useEffect(() => {
    nav('/mapping');
  }, [showInvalidOnly]);

  const handleShowInvalidClick = () => {
    setShowInvalidOnly(!showInvalidOnly);
  }

  if ((!trueID || isNaN(trueID) || trueID === 0) && trueIDs.length > 0) {
    const redirectId = trueIDs[0];
    return (<Navigate replace to={`/mapping/${redirectId}`} />);
  }
  
  const permanentClient = findClient(trueID, clients);
  const dupIDs = mapping && mapping[trueID];
  const dupeRecords = dupIDs && dupIDs.map(id => findClient(id, clients));

  return (
    <div className={css.container}>
      <div className={css.showInvalid}>
        <input
          id='show-invalid-only'
          type='checkbox'
          checked={showInvalidOnly}
          onClick={handleShowInvalidClick}
        />
        <label for='show-invalid-only'>
          Show invalid only
        </label>
      </div>
      {permanentClient ?
        <>
          <div className={css.count}>
            {`${currentIndex + 1} of ${trueIDs.length} mappings`}
          </div>
          <div className={css.target}>
            <RecordTile
              record={permanentClient}
              target
            />
          </div>
        </>
        : void 0}
      {dupeRecords ?
        <div className={css.duplicates}>
          <ClientList
            clients={dupeRecords}
          />
        </div>
      : void 0}
    </div>
  )
}