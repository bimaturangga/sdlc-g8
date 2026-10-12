import { useEffect, useState } from 'react';
import MenuItemDetails from './components/MenuItemDetails.jsx';
import MenuItemList from './components/MenuItemList.jsx';
import OrderList from './components/OrderList.jsx';
import ResetControl from './components/ResetControl.jsx';
import { createSeedData } from './data/seed.js';
import { canPlaceDemoOrder, createDemoOrder } from './utils/orderUtils.js';
import { loadState, resetState, saveState } from './utils/storage.js';

const STORAGE_KEY = 'sdlc:case-b:v1';

export default function App() {
  const [data, setData] = useState(() => loadState(STORAGE_KEY, createSeedData));
  const [selectedId, setSelectedId] = useState(() => data.menu[0]?.id ?? null);

  useEffect(() => {
    saveState(STORAGE_KEY, data);
  }, [data]);

  const selectedMenuItem = data.menu.find((item) => item.id === selectedId) ?? null;
  const availableCount = data.menu.filter(
    (item) => item.availability === 'AVAILABLE',
  ).length;

  function handlePlaceOrder(menuId) {
    setData((current) => {
      const menuItem = current.menu.find((item) => item.id === menuId);
      if (!canPlaceDemoOrder(menuItem)) return current;

      return {
        ...current,
        orders: [...current.orders, createDemoOrder(current.orders, menuId)],
      };
    });
  }

  function handleReset() {
    const freshData = resetState(STORAGE_KEY, createSeedData);
    setData(freshData);
    setSelectedId(freshData.menu[0]?.id ?? null);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">SDLC Starter App</p>
          <h1>Campus Canteen Ordering</h1>
          <p className="subtitle">
            Browse a simple canteen menu and record local demo orders.
          </p>
        </div>
        <ResetControl onReset={handleReset} />
      </header>

      <p className="browser-note">Demo data is saved in this browser only.</p>

      <section className="overview-grid" aria-label="Overview">
        <article className="summary-card">
          <p className="summary-label">Total menu items</p>
          <p className="summary-value">{data.menu.length}</p>
        </article>
        <article className="summary-card">
          <p className="summary-label">Available items</p>
          <p className="summary-value">{availableCount}</p>
        </article>
      </section>

      <section className="content-grid">
        <section className="panel" aria-labelledby="menu-list-heading">
          <h2 id="menu-list-heading">Menu</h2>
          <MenuItemList
            menu={data.menu}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </section>
        <aside className="panel" aria-label="Selected menu item details">
          <MenuItemDetails menuItem={selectedMenuItem} onPlaceOrder={handlePlaceOrder} />
        </aside>
      </section>

      <section className="panel secondary-section" aria-labelledby="order-list-heading">
        <div className="panel-heading">
          <h2 id="order-list-heading">Demo Orders</h2>
          <span className="meta">{data.orders.length} total</span>
        </div>
        <OrderList orders={data.orders} menu={data.menu} />
      </section>
    </main>
  );
}
