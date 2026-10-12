export function canPlaceDemoOrder(menuItem) {
  return menuItem?.availability === 'AVAILABLE';
}

export function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function getMenuName(menu, menuId) {
  return menu.find((menuItem) => menuItem.id === menuId)?.name ?? 'Unknown menu item';
}

export function createDemoOrder(orders, menuId) {
  const nextNumber =
    orders.reduce((largest, order) => {
      const number = Number(order.id.split('-').at(-1));
      return Number.isFinite(number) ? Math.max(largest, number) : largest;
    }, 0) + 1;

  return {
    id: `ORDER-${String(nextNumber).padStart(3, '0')}`,
    menuId,
    status: 'NEW',
  };
}
