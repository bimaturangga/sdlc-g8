import { DEMO_USERS } from './users.js';

export default function LoginPage({ onLogin }) {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">SDLC Starter App</p>
          <h1>Campus Equipment Access &amp; Borrowing</h1>
          <p className="subtitle">Choose a demo account to continue.</p>
        </div>
      </header>

      <section className="panel" aria-labelledby="login-heading">
        <h2 id="login-heading">Sign in as</h2>
        <ul className="secondary-list">
          {DEMO_USERS.map((user) => (
            <li className="secondary-row" key={user.id}>
              <div>
                <p>
                  <strong>{user.name}</strong>
                </p>
                <span className="meta">{user.role}</span>
              </div>
              <button className="primary-button" type="button" onClick={() => onLogin(user)}>
                Sign in
              </button>
            </li>
          ))}
        </ul>
        <p className="helper-text">Demo accounts only. There is no password or backend.</p>
      </section>
    </main>
  );
}
