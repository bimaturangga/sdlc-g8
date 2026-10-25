import { useEffect, useState } from 'react';
import LoginPage from './auth/LoginPage.jsx';
import { clearSession, loadSession, saveSession } from './auth/session.js';
import { ROLES } from './auth/users.js';
import { createSeedData } from './data/seed.js';
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
  const [data, setData] = useState(() => loadState(STORAGE_KEY, createSeedData));

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

  function handleReset() {
    setData(resetState(STORAGE_KEY, createSeedData));
  }

  if (!user) return <LoginPage onLogin={handleLogin} />;

  if (user.role === ROLES.ADMIN) {
    return (
      <AdminPage user={user} data={data} onReset={handleReset} onLogout={handleLogout} />
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
