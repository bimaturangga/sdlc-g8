import MenuItemCard from './MenuItemCard.jsx';

export default function MenuItemList({ menu, selectedId, onSelect }) {
  if (menu.length === 0) {
    return <div className="empty-state">No menu items are available.</div>;
  }

  return (
    <ul className="record-list" aria-label="Canteen menu">
      {menu.map((menuItem) => (
        <li key={menuItem.id}>
          <MenuItemCard
            menuItem={menuItem}
            isSelected={menuItem.id === selectedId}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  );
}
