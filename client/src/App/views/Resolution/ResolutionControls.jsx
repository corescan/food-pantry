import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ClientAPI from '../../../API/ClientAPI';
import makeFilterState from '../../../lib/search/makeFilterState';
import { resolveClients } from '../../../redux/actions/clientActions';
import { updateSearchFilters } from '../../../redux/actions/searchActions';
import css from './ResolutionControls.module.css';

export default function ResolutionControls() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { target, selection, clients } = useSelector(
    ({ clientReducer }) => {
      return {
        selection: clientReducer.selection,
        target: clientReducer.target,
        clients: clientReducer.allClients
      }
    }
  );

  const handleResolution = async () => {
    const payload = await ClientAPI.resolveClients(target, selection);
    resolveClients(payload)(dispatch);
    const nextTarget = clients.find(_c => !_c.mapped && _c.active);
    updateSearchFilters(makeFilterState(nextTarget))(dispatch);
    nav(`/resolve/${nextTarget.id}`);
  }

  return (
    <div className={css.container} >
      {/* <button
        className={css.existing}
      >
        Add To Existing
      </button> */}
      <button
        onClick={handleResolution}
        className={css.resolve}
      >
        Resolve
      </button>
    </div>
  )
}
