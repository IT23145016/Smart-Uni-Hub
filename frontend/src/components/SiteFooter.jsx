import { Link } from "react-router-dom";

export default function SiteFooter({ compact = false }) {
  return (
    <footer className={`site-footer ${compact ? "compact" : ""}`}>
      <div className="footer-brand">
        <h3>Smart Campus Operations Hub</h3>
        <p className="muted">
          A unified workspace for facilities, assets, maintenance coordination, approvals, and role-based
          administration across the university.
        </p>
      </div>

      <div className="footer-columns">
        <div>
          <p className="footer-heading">Platform</p>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/resources">Facilities Catalogue</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/admin/roles">Role Management</Link>
          </div>
        </div>

        <div>
          <p className="footer-heading">Operations</p>
          <div className="footer-links">
            <span>Facilities and assets</span>
            <span>Maintenance tracking</span>
            <span>Notifications and access control</span>
          </div>
        </div>

        <div>
          <p className="footer-heading">Technology</p>
          <div className="footer-links">
            <span>Spring Boot API</span>
            <span>React client application</span>
            <span>MongoDB data storage</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>Smart Campus Operations Hub</span>
        <span>Designed for clear workflows, auditability, and everyday campus operations.</span>
      </div>
    </footer>
  );
}
