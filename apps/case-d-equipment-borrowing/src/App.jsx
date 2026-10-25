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
  getNextUnitId,
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

  function handleCreateRequest(requestInput) {
    setData((current) => {
      const inputs = Array.isArray(requestInput) ? requestInput : [requestInput];
      let newRequests = [...current.requests];

      for (const input of inputs) {
        const equipmentId =
          typeof input === 'object' ? input.equipmentId : input;
        const equipmentItem = current.equipment.find((item) => item.id === equipmentId);
        if (!equipmentItem) continue;

        newRequests = [
          ...newRequests,
          createDemoRequest(newRequests, input),
        ];
      }

      return {
        ...current,
        requests: newRequests,
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
      equipment: current.equipment.map((item) =>
        item.id === equipmentId
          ? {
              ...item,
              units: [...item.units, { id: getNextUnitId(item), maintenance: false }],
            }
          : item,
      ),
    }));
  }

  function handleConfirmRequest(requestId) {
    setData((current) => ({
      ...current,
      requests: current.requests.map((request) =>
        request.id === requestId && request.status === 'REQUESTED'
          ? { ...request, status: 'CONFIRMED' }
          : request,
      ),
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
        onConfirmRequest={handleConfirmRequest}
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
