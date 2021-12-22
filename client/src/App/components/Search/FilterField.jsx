import css from './FilterField.module.css';
import PhoneInput from '../PhoneInput';

const placeholder = {
  firstname: 'First name',
  lastname: 'Last name',
  phone: 'Phone',
  address: 'Address'
}
export default function FilterField(props) {
  let renderInput = (
    <input
      type='text'
      className={css.text_input}
      placeholder={placeholder[props.name]}
      value={props.value}
      onChange={props.onChange}
    />
  );
  if (props.type === 'tel') {
    renderInput = (
      <PhoneInput
        className={css.text_input}
        placeholder={placeholder[props.name]}
        value={props.value}
        onChange={props.onChange}
      />
    );
  }
  return (
    <>
      <input
        id="target-text"
        type="checkbox"
        checked={props.enabled}
        onClick={props.onClick}
      />
      {renderInput}
    </>
  )
}
