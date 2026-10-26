export default function AppHeader({ user, onLogout, children }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">
          {user.name} ({user.role})
        </p>
        <h1>Campus Equipment Access &amp; Borrowing</h1>
        <p className="subtitle">
          Browse campus equipment and record local demo requests.
        </p>
      </div>
      <div className="app-header-actions">
        {children}
        <button className="secondary-button" type="button" onClick={onLogout}>
          Sign out
        </button>
      </div>
    </header>
  );
}
