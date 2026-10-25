const menu = [
  {
    id: 'MENU-001',
    name: 'Chicken Rice Bowl',
    tenant: 'Campus Kitchen',
    price: 25000,
    availability: 'AVAILABLE',
  },
  {
    id: 'MENU-002',
    name: 'Vegetable Noodles',
    tenant: 'Noodle Corner',
    price: 18000,
    availability: 'AVAILABLE',
  },
  {
    id: 'MENU-003',
    name: 'Grilled Sandwich',
    tenant: 'Quick Bites',
    price: 20000,
    availability: 'SOLD_OUT',
  },
  {
    id: 'MENU-004',
    name: 'Fried Rice',
    tenant: 'Campus Kitchen',
    price: 22000,
    availability: 'AVAILABLE',
  },
  {
    id: 'MENU-005',
    name: 'Fruit Cup',
    tenant: 'Fresh Station',
    price: 12000,
    availability: 'AVAILABLE',
  },
  {
    id: 'MENU-006',
    name: 'Iced Lemon Tea',
    tenant: 'Drink Bar',
    price: 10000,
    availability: 'SOLD_OUT',
  },
];

const orders = [
  { id: 'ORDER-001', menuId: 'MENU-001', status: 'PREPARING' },
  { id: 'ORDER-002', menuId: 'MENU-005', status: 'READY' },
];

export function createSeedData() {
  return {
    menu: menu.map((menuItem) => ({ ...menuItem })),
    orders: orders.map((order) => ({ ...order })),
  };
}
