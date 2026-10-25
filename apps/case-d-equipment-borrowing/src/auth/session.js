import { DEMO_USERS } from './users.js';

const SESSION_KEY = 'sdlc:case-d:session';

export function loadSession() {
  try {
    const userId = localStorage.getItem(SESSION_KEY);
    return DEMO_USERS.find((user) => user.id === userId) ?? null;
  } catch {
    return null;
  }
}

export function saveSession(user) {
  try {
    localStorage.setItem(SESSION_KEY, user.id);
  } catch {
    // The in-memory session still works when browser storage is unavailable.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clear when browser storage is unavailable.
  }
}
