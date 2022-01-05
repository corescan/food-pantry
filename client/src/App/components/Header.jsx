import { useNavigate, Link } from 'react-router-dom';
import Button from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import css from './Header.module.css';

export default function Header() {
  const nav = useNavigate();

  return (
    <header className={css.container}>
      <div className={css.title_wrap}>
        <Link to='/' className={css.main_title}>Client Records</Link>
        <span className={css.title_separator}>{`>`}</span>
        <span className={css.subtitle}>Duplicate Resolution</span>
      </div>
      <div className={css.buttonWrap}>
        <Button
          text='Review Mappings'
          onClick={() => nav(`/mapping`)}
        />
      </div>
    </header>
  )
}