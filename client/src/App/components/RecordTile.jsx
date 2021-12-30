import PropTypes from 'prop-types';
import classnames from 'classnames';
import css from './RecordTile.module.css';
import renderPhone from '../../lib/renderPhone';

export default function RecordTile(props) {
  const { record, onClick } = props;
  return (
    <div className={classnames(css.container, {
      [css.target]: props.target,
      [css.selected]: props.selected,
      [css.clickable]: !!props.onClick,
      [css.active]: record.active && !record.invalid,
      [css.invalid]: record.invalid
      })}
      onClick={onClick}
    >
      <ul className={css.left}>
        <li className={css.field}>
          <label>name</label>
          <div className={css.name}>{`${record.lastname}, ${record.firstname}`}</div>
        </li>
        <li className={css.field}>
          <label>phone</label>
          <div className={css.phone}>{renderPhone(record.phone)}</div>
        </li>
        <li className={css.field}>
          <label>address</label>
          <div className={css.address}>{record.address}</div>
        </li>
      </ul>
      <div className={css.right}>
        <div className={css.record_id}><span>id</span>{record.id}</div>
        <div className={css.right_list_wrap}>
          <ul>
            <li className={css.field}>
              <label className={css.size_label}>family</label>
              <span className={css.size}>{record.thisfamilycount}</span>
            </li>
            <li className={css.field}>
              <label className={css.size_label}>youth</label>
              <span className={css.size}>{record.youthcount}</span>
            </li>
            <li className={css.field}>
              <label className={css.size_label}>elders</label>
              <span className={css.size}>{record.eldercount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

RecordTile.propTypes = {
  record: PropTypes.object,
  target: PropTypes.bool,
  onClick: PropTypes.func
};
