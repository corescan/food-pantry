import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useKeyPress from '../../../lib/hooks/useKeyPress';
import css from './MappingView.module.css';

import RecordTile from '../../components/RecordTile';
import ClientList from '../../components/ClientList';

const findClient = (id, clients) => {
  const record = clients.find(_c => _c.id === id);
  return record || {
    id: id,
    firstname: null,
    lastname: 'INVALID ID',
    phone: null,
    address: null,
    active: null,
    invalid: true
  }
}

export default function MappingView() {
  const nav = useNavigate();
  const trueId = Number(useParams().trueId);
  const { clients, mapping = [] } = useSelector(({ clientReducer }) => { 
    return {
      clients: clientReducer.allClients,
      mapping: clientReducer.mapping
    }
  });
  const upPress = useKeyPress("ArrowUp");
  const downPress = useKeyPress("ArrowDown");

  const trueIDs = Object.keys(mapping).map(key => Number(key)).sort((a,b) => a > b ? 1 : -1);
  const currentIndex = trueIDs.indexOf(trueId);

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

  if ((!trueId || isNaN(trueId) || trueId === 0) && trueIDs.length > 0) {
    let redirectId = trueIDs[0];
    return (<Navigate replace to={`/mapping/${redirectId}`} />);
  }
  
  const permanentClient = clients.find(_c => _c.id === trueId);
  const dupIDs = mapping && mapping[trueId];
  const clientList = dupIDs && dupIDs.map(id => findClient(id, clients));

  return (
    <div className={css.container}>
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
      {clientList ?
        <div className={css.duplicates}>
          <ClientList
            clients={clientList}
          />
        </div>
      : void 0}
    </div>
  )
}