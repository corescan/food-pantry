import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import RecordTile from '../../components/RecordTile';
import ResolutionControls from './ResolutionControls';
import RecordSelection from '../../components/Selection/RecordSelection';
import FilterForm from '../../components/Search/FilterForm';
import SearchResults from '../../components/Search/SearchResults';
import { setTarget } from '../../../redux/actions/clientActions';
import css from './ResolutionView.module.css';
 
export default function ResolutionView() {
  const { clientId } = useParams();
  const nav =  useNavigate();
  const dispatch = useDispatch();
  const { target, allClients } = useSelector(({ clientReducer }) => { 
    return {
      target: clientReducer.target,
      allClients: clientReducer.allClients
    }
  });

  useEffect(() => {
    const id = Number(clientId);
    let _t = allClients.find(_c => _c.id === id);
    if (_t && _t.mapped) {
      _t = allClients.find(_c => !_c.mapped && _c.active);
      nav(`/resolve/${target.id}`);
    }
    setTarget(_t)(dispatch);
  }, [clientId, allClients, dispatch])

  return (
    <div className={css.container}>
      {target?
        (<>
          <div className={css.left_pane}>
              <div className={css.target}>
                <ResolutionControls />
                <RecordTile
                  record={target}
                  target
                />
              </div>
              <div className={css.duplicates}>
                <RecordSelection />
              </div>
          </div>
          <div className={css.center_pane}>
            <FilterForm />
            <SearchResults />
          </div>
        </>)
      : void 0 }
    </div>
  );
}
