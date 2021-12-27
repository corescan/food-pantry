import { useSelector, useDispatch } from 'react-redux';
import ClientList from '../ClientList';
import { addToSelection } from '../../../redux/actions/clientActions';
import css from './SearchResults.module.css';

export default function SearchResults() {
  const dispatch = useDispatch();
  const { selection, results, filters, globalFilters } = useSelector(
    ({ searchReducer, clientReducer }) => {
      return {
        selection: clientReducer.selection,
        results: searchReducer.results,
        filters: searchReducer.filters,
        globalFilters: searchReducer.globalFilters
      }
    }
  );

  const handleClientSelect = record => addToSelection(record)(dispatch);

  // Filter out selected clients from the search results
  // TO DO filter out MAPPED clients from the search results
  const selectedIDs = (selection && selection.map(_r => _r.id)) || [];
  const searchActive = Object.values(filters).reduce((isActive, filter) => isActive || filter.enabled, false);
  const displayedResults = results && 
    results.filter(_r => !selectedIDs.includes(_r.id))
    .filter(_r => globalFilters.active ? _r.active : true);

  return (
    <div className={css.container}>
      {searchActive && displayedResults?
      <div className={css.message}>
        {`${displayedResults.length} result${displayedResults.length === 1 ? '':'s'}`}
      </div>
      : void 0}
      <ul className={css.list}>
        <ClientList
          clients={displayedResults || []}
          onClientClick={handleClientSelect}
        />
      </ul>
    </div>
  );
}