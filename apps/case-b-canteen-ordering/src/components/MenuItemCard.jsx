import { formatPrice } from '../utils/orderUtils.js';
import StatusBadge from './StatusBadge.jsx';

export default function MenuItemCard({ menuItem, isSelected, onSelect }) {
  return (
    <button
      className={`record-card${isSelected ? ' selected' : ''}`}
      type="button"
      onClick={() => onSelect(menuItem.id)}
      aria-pressed={isSelected}
    >
      <span className="card-heading">
        <span>
          <strong>{menuItem.name}</strong>
          <span className="meta"> · {menuItem.tenant}</span>
        </span>
        <StatusBadge status={menuItem.availability} />
      </span>
      <span className="card-footer">
        <span>{menuItem.id}</span>
        <span>{formatPrice(menuItem.price)}</span>
      </span>
    </button>
  );
}
