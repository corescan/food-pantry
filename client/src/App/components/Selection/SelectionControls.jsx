import { useDispatch } from 'react-redux';
import { removeFromSelection, swapSelectionAndTarget } from '../../../redux/actions/clientActions';
import css from './SelectionControls.module.css';

export default function SelectionControls(props) {
  const dispatch = useDispatch();

  const handleRemove = () => {
    removeFromSelection(props.record)(dispatch);
  }

  const handlePromote = () => {
    swapSelectionAndTarget(props.record)(dispatch);
  }
  return (
    <li className={css.container}>
      <ul className={css.control_wrap}>
        <li>
          <button
            className={css.remove}
            onClick={handleRemove}
          >
            Deselect
          </button>
        </li>
        <li>
          <button
            className={css.promote}
            onClick={handlePromote}
          >
            Use as Main
          </button>
        </li>
      </ul>
      {props.children}
    </li>
  )
}
