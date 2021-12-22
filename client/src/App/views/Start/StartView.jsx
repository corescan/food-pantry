import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateSearchFilters } from '../../../redux/actions/searchActions';
import ProgressBar from '../../components/ProgressBar';
import ClientList from '../../components/ClientList';
import css from './StartView.module.css';
import makeFilterState from '../../../lib/search/makeFilterState';

export default function StartView() {
  const dispatch = useDispatch()
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
  const total1 = active.length;
  const complete1 = total1 - activeUnmapped.length;
  const total2 = inactive.length;
  const complete2 = total2 - inactiveUnmapped.length;

  const clientList = allClients.filter(_c => _c.active && !_c.mapped)
  const nav = useNavigate();
  const handleClientClick = client => {
    updateSearchFilters(makeFilterState(client))(dispatch);
    nav(`/resolve/${client.id}`);
  }
  return (
    <div className={css.container}>
      <ProgressBar total={total1} complete={complete1} />
      <div className={css.space} />
      <ProgressBar total={total2} complete={complete2} color='#999' />
      <div className={css.callout}>Select a client to resolve...</div>
      <ClientList
        clients={clientList}
        onClientClick={handleClientClick}
      />
    </div>
  );
}

