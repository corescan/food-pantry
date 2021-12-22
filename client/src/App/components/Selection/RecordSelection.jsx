import { useSelector } from 'react-redux';
import RecordTile from '../RecordTile';
import SelectionControls from './SelectionControls';
import css from './RecordSelection.module.css';

export default function RecordSelection() {
  const selection = useSelector(
    ({ clientReducer }) => {
      return clientReducer.selection;
    }
  );
  
  return (
    <div className={css.container}>
      <ul className={css.list}>
        {selection && selection.map(client => (
          <SelectionControls record={client}>
            <RecordTile
              selected
              record={client}
            />
          </SelectionControls>
        ))}
      </ul>
    </div>
  );
}
