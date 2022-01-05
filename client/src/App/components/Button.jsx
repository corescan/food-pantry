import css from './Button.module.css';

export default function Button(props) {
  const classNames = [css.button, props.className];
  return (
    <button
      className={classNames.join(' ')}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  )
}