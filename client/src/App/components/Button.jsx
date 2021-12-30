import css from './Button.module.css';

export default function Button(props) {
  return (
    <button
      className={css.button}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  )
}