import { getMenuName } from '../utils/orderUtils.js';
import StatusBadge from './StatusBadge.jsx';

export default function OrderList({ orders, menu }) {
  if (orders.length === 0) {
    return <div className="empty-state">No demo orders have been recorded.</div>;
  }

  return (
    <ul className="secondary-list" aria-label="Demo orders">
      {orders.map((order) => (
        <li className="secondary-row" key={order.id}>
          <div>
            <p>
              <strong>{getMenuName(menu, order.menuId)}</strong>
            </p>
            <span className="meta">{order.id}</span>
          </div>
          <StatusBadge status={order.status} />
        </li>
      ))}
    </ul>
  );
}
