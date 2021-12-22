import css from './ProgressBar.module.css';

export default function ProgressBar(props) {
  const format = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format;

  const { complete, total } = props;
  const percent = (complete / total) * 100;
  const barStyle = Object.assign(
    {backgroundColor: props.color},
    {width: `${percent}%`});

  return (
    <div className={css.container}>
      <div className={css.bar} style={barStyle} />
      {!isNaN(percent) ?
      <div className={css.percent}>
        {`${format(percent)}% (${complete}/${total})`}
      </div>
      : void 0}
    </div> 
  )
};

ProgressBar.defaultProps = {
  total: 1,
  complete: 0,
  color: '#0EAD69'
}