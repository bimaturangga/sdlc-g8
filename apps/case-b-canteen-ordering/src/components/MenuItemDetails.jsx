import { canPlaceDemoOrder, formatPrice } from '../utils/orderUtils.js';
import StatusBadge from './StatusBadge.jsx';

export default function MenuItemDetails({ menuItem, onPlaceOrder }) {
  if (!menuItem) {
    return <div className="empty-state">Select a menu item to view its details.</div>;
  }

  const canOrder = canPlaceDemoOrder(menuItem);

  return (
    <>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{menuItem.id}</p>
          <h2>{menuItem.name}</h2>
        </div>
        <StatusBadge status={menuItem.availability} />
      </div>

      <dl className="details-list">
        <dt>Tenant</dt>
        <dd>{menuItem.tenant}</dd>
        <dt>Price</dt>
        <dd>{formatPrice(menuItem.price)}</dd>
        <dt>Availability</dt>
        <dd>{menuItem.availability.replaceAll('_', ' ')}</dd>
      </dl>

      <button
        className="primary-button"
        type="button"
        onClick={() => onPlaceOrder(menuItem.id)}
        disabled={!canOrder}
      >
        {canOrder ? 'Place Demo Order' : 'Sold Out'}
      </button>
      {!canOrder && <p className="helper-text">This menu item is not available.</p>}
    </>
  );
}
