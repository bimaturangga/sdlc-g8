import { useEffect, useState } from 'react';
import LoginPage from './auth/LoginPage.jsx';
import { clearSession, loadSession, saveSession } from './auth/session.js';
import { ROLES } from './auth/users.js';
import { createSeedData, migrateStoredData } from './data/seed.js';
import AdminPage from './pages/admin/AdminPage.jsx';
import StudentPage from './pages/student/StudentPage.jsx';
import {
  canCreateDemoRequest,
  createDemoRequest,
} from './utils/equipmentUtils.js';
import { loadState, resetState, saveState } from './utils/storage.js';

const STORAGE_KEY = 'sdlc:case-d:v1';

export default function App() {
  const [user, setUser] = useState(loadSession);
  const [data, setData] = useState(() =>
    loadState(STORAGE_KEY, createSeedData, migrateStoredData),
  );

  useEffect(() => {
    saveState(STORAGE_KEY, data);
  }, [data]);

  function handleLogin(nextUser) {
    saveSession(nextUser);
    setUser(nextUser);
  }

  function handleLogout() {
    clearSession();
    setUser(null);
  }

  function handleCreateRequest(equipmentId) {
    setData((current) => {
      const equipmentItem = current.equipment.find((item) => item.id === equipmentId);
      if (!canCreateDemoRequest(equipmentItem)) return current;

      return {
        ...current,
        requests: [
          ...current.requests,
          createDemoRequest(current.requests, equipmentId),
        ],
      };
    });
  }

  function handleToggleMaintenance(equipmentId, unitId) {
    setData((current) => ({
      ...current,
      equipment: current.equipment.map((item) =>
        item.id === equipmentId
          ? {
              ...item,
              units: item.units.map((unit) =>
                unit.id === unitId
                  ? { ...unit, maintenance: !unit.maintenance }
                  : unit,
              ),
            }
          : item,
      ),
    }));
  }

  function handleAddUnit(equipmentId) {
    setData((current) => ({
      ...current,
      equipment: current.equipment.map((item) => {
        if (item.id !== equipmentId) return item;

        const nextUnitNumber =
          item.units.reduce((largest, unit) => {
            const number = Number(unit.id.split('-U').at(-1));
            return Number.isFinite(number) ? Math.max(largest, number) : largest;
          }, 0) + 1;

        return {
          ...item,
          units: [
            ...item.units,
            {
              id: `${item.id}-U${String(nextUnitNumber).padStart(2, '0')}`,
              maintenance: false,
            },
          ],
        };
      }),
    }));
  }

  function handleReset() {
    setData(resetState(STORAGE_KEY, createSeedData));
  }

  if (!user) return <LoginPage onLogin={handleLogin} />;

  if (user.role === ROLES.ADMIN) {
    return (
      <AdminPage
        user={user}
        data={data}
        onReset={handleReset}
        onToggleMaintenance={handleToggleMaintenance}
        onAddUnit={handleAddUnit}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <StudentPage
      user={user}
      data={data}
      onCreateRequest={handleCreateRequest}
      onLogout={handleLogout}
    />
  );
}
