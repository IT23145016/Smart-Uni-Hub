import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SiteFooter from "./SiteFooter";

export default function Shell({ title, children }) {
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "SC";

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="shell">
      <header className="shell-topbar">
        <button type="button" className="menu-toggle" onClick={() => setMenuOpen((current) => !current)} aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>
        <div className="shell-title">
          <h1>{title}</h1>
        </div>
        <div className="shell-topbar-spacer" aria-hidden="true" />
      </header>

      <main className="content">
        {children}
        <SiteFooter compact />
      </main>

      {menuOpen ? <button type="button" className="drawer-backdrop" onClick={closeMenu} aria-label="Close menu" /> : null}

      <aside className={`drawer ${menuOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Navigation</p>
            <strong>Workspace Menu</strong>
          </div>
          <button type="button" className="secondary-button" onClick={closeMenu}>
            Close
          </button>
        </div>

        <p className="muted">Move between dashboard views, the facilities catalogue, and admin controls.</p>

        <nav className="nav">
          <Link to="/dashboard" onClick={closeMenu}>
            Dashboard
          </Link>
          <Link to="/resources" onClick={closeMenu}>
            Facilities Catalogue
          </Link>
          <Link to="/admin/roles" onClick={closeMenu}>
            Role Management
          </Link>
        </nav>

        {user ? (
          <a className="oauth-button" href={`${apiBaseUrl}/logout`}>
            End Session
          </a>
        ) : (
          <Link className="oauth-button" to="/signin" onClick={closeMenu}>
            Continue with Google
          </Link>
        )}

        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-chip">{user?.avatarUrl ? <img alt={user.fullName} src={user.avatarUrl} /> : initials}</div>
            <div>
              <p className="profile-label">{loading ? "Loading session" : user ? "Current session" : "Guest access"}</p>
              <strong>{loading ? "Preparing..." : user?.fullName || "Campus visitor"}</strong>
            </div>
          </div>
          <small>{user?.email || "Sign in to unlock the workspace"}</small>
          {user?.roles?.length ? (
            <div className="role-stack">
              {user.roles.map((role) => (
                <span className="mini-role" key={role}>
                  {role}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
