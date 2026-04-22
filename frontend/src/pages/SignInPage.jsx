import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";

export default function SignInPage() {
  const { authMessage } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

  return (
    <div className="landing-page">
      <SiteHeader />
      <div className="signin-page">
        <section className="signin-panel signin-action-card">
          <div className="signin-card-copy">
            <p className="eyebrow">Welcome back</p>
            <h2>Continue to Smart Uni Hub</h2>
            <p>Use your university Google account to enter the platform.</p>
          </div>

          <div className="signin-checklist">
            <span>Google OAuth authentication</span>
            <span>Role-based access control</span>
            <span>Secure campus workspace</span>
          </div>

          {authMessage ? <p className="error">{authMessage}</p> : null}

          <a className="signin-button" href={`${apiBaseUrl}/oauth2/authorization/google`}>
            Continue with Google
          </a>

          <Link className="back-link" to="/">
            Back to home page
          </Link>
        </section>

        <section className="signin-sidecard signin-overview-card">
          <p className="eyebrow">Campus Access</p>
          <h1>Sign in with Google to continue.</h1>
          <p className="hero-text">
            Access facilities, bookings, maintenance updates, and role-based features from one secure workspace.
          </p>

          <div className="signin-metrics">
            <article>
              <strong>Secure access</strong>
              <span>Google authentication with role-based visibility.</span>
            </article>
            <article>
              <strong>Clear workflows</strong>
              <span>Use one system for requests, updates, and operations.</span>
            </article>
            <article>
              <strong>Smart notifications</strong>
              <span>Stay updated with changes that matter to your role.</span>
            </article>
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
