import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { updateSearchResults, updateSearchIndex, updateSearchFilters } from '../../../redux/actions/searchActions';
import makeFilterState from '../../../lib/search/makeFilterState';
import FilterField from './FilterField';
import css from './FilterForm.module.css';

export default function FilterForm() {
  const dispatch = useDispatch();
  const {
    filters,
    target,
    index,
    clients
  } = useSelector(({ searchReducer, clientReducer }) => {
    return { 
      filters: searchReducer.filters,
      index: searchReducer.index,
      target: clientReducer.target,
      clients: clientReducer.allClients
    }
  });

  // Update search index when searchable clients changes
  useEffect(() => {
    updateSearchIndex(clients)(dispatch);
  }, [clients, dispatch]);

  // Update search results when index, filters, clients, or target changes
  useEffect(() => {
    updateSearchResults(index, target, filters)(dispatch);
  }, [index, filters, target, dispatch]);

  // Update filters when target changes
  useEffect(() => {
    updateSearchFilters(makeFilterState(target, filters))(dispatch)
  }, [target, dispatch]);

  // Toggle filter on/off
  const handleFilterClick = filterName => {
    updateSearchFilters({
      [filterName]: {
        ...(filters[filterName]),
        enabled: !filters[filterName].enabled
      }
    })(dispatch);
  };
  
  // Update text filter
  const handleTextInput = (filterName, ev) => {
    updateSearchFilters({
      [filterName]: {
        enabled: true,
        value: ev.target.value
      }
    })(dispatch);
  };

  return (
    <form className={css.form}>
      <div className={css.title}>Search records by:</div>
      <ul className={css.list}>
        {
          Object.keys(filters).map(filterName => (
            <li>
              <FilterField
                enabled={filters[filterName].enabled}
                name={filterName}
                value={filters[filterName].value}
                type={filterName === 'phone' ? 'tel':'text'}
                onChange={handleTextInput.bind(this, filterName)}
                onClick={handleFilterClick.bind(this, filterName)}
              />
            </li>
          ))
        }
      </ul>
    </form>
  )
}
