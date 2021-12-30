import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateSearchFilters } from '../../../redux/actions/searchActions';
import { clearSelection } from '../../../redux/actions/clientActions';
import ProgressBar from '../../components/ProgressBar';
import ClientList from '../../components/ClientList';
import css from './StartView.module.css';
import makeFilterState from '../../../lib/search/makeFilterState';

export default function StartView() {
  const [isChecked, setIsChecked] = useState(true);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const allClients = useSelector(
    ({ clientReducer }) => {
      return clientReducer.allClients;
    }
  );

  const active = allClients.filter(_c => _c.active);
  const activeUnmapped = active.filter(_c => !_c.mapped);
  const inactive = allClients.filter(_c => !_c.active);
  const inactiveUnmapped = inactive.filter(_c => !_c.mapped);
  
  // calculate width of bar
  const activeCount = active.length;
  const activeMappedCount = activeCount - activeUnmapped.length;
  const inactiveCount = inactive.length;
  const inactiveMappedCount = inactiveCount - inactiveUnmapped.length;

  const clientList = isChecked ? activeUnmapped : 
    activeUnmapped.concat(inactiveUnmapped).sort((_a,_b) => _a.id > _b.id ? 1 : -1);

  const handleClientClick = client => {
    updateSearchFilters(makeFilterState(client))(dispatch);
    clearSelection()(dispatch);
    nav(`/resolve/${client.id}`);
  }

  const handleCheckbox = () => setIsChecked(!isChecked);

  return (
    <div className={css.container}>
      <ProgressBar total={activeCount} complete={activeMappedCount} />
      <div className={css.space} />
      <ProgressBar total={inactiveCount} complete={inactiveMappedCount} color='#999' />
      <div className={css.callout}>
        Select a client to resolve...
        <span className={css.toggle_active}>
          <input
            id='active_client_toggle'
            type='checkbox'
            checked={isChecked}
            onChange={handleCheckbox}
          />
          <label for='active_client_toggle'>active clients only</label>
        </span>
      </div>
      <ClientList
        clients={clientList}
        onClientClick={handleClientClick}
      />
      <hr />
    </div>
  );
}

