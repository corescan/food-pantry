import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useDocumentClicked from '../../lib/hooks/useDocumentClick';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faDownload, faEye } from '@fortawesome/free-solid-svg-icons';
import css from './Header.module.css';

export default function Header() {
  const nav = useNavigate();
  const docClicked = useDocumentClicked('header-menu-trigger');
  const [ isOpen, setIsOpen ] = useState(false);

  const handleMenuClick = callback => {
    setIsOpen(false);
    if (typeof callback === 'function') {
      callback();
    }
  }

  useEffect(() => {
    if (docClicked) {
      setIsOpen(false);
    }
  }, [docClicked, setIsOpen])

  return (
    <header className={css.container}>
      <div className={css.title_wrap}>
        <Link to='/' className={css.main_title}>Client Records</Link>
        <span className={css.title_separator}>{`>`}</span>
        <span className={css.subtitle}>Duplicate Resolution</span>
      </div>
      <div
        id='header-menu-trigger'
        className={css.dropdownBtn}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faBars} />
        <ul className={classnames(css.dropdownWrap, {[css.open]: isOpen})}>
          <li onClick={handleMenuClick.bind(null, () => nav(`/mapping`))}>
            <FontAwesomeIcon icon={faEye} />
            <span>Review Mappings</span>
          </li>
          <li onClick={handleMenuClick.bind(null, () => window.open('/system/report'))}>
            <FontAwesomeIcon icon={faDownload} />
            <span>Download CSV</span>
          </li>
        </ul>
      </div>
    </header>
  )
}