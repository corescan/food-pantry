import Paginator from './PaginatorV2';
import renderPhone from '../../lib/renderPhone';
import classnames from 'classnames';
import css from './ClientList.module.css';

export default function ClientList(props) {
  const { clients } = props;

  const handleItemClick = client => props.onClientClick(client);

  const renderItem = (client) => (
    <li className={css.pager_item} key={client.id} onClick={handleItemClick.bind(void 0, client)}>
      <span className={classnames(css.id, {[css.active]: client.active, [css.invalid]: client.invalid})}>{client.id}</span>
      <span className={css.name}>{`${client.lastname || '[ null ]'}, ${client.firstname}`}</span>
      <span className={css.phone}>{renderPhone(client.phone)}</span>
      <span className={css.address}>{client.address}</span>
    </li>
  );
  
  return (
    <div className={css.container}>
      <div className={css.tableContainer}>
        <Paginator
          items={clients}
          itemsPerPage={11}
          renderItem={renderItem}
          onItemClick={handleItemClick}
        />
      </div>
    </div> 
  )
};

ClientList.defaultProps = {
  clients: [],
  onClientClick: () => {}
}