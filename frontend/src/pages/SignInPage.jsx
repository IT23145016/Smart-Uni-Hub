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
            <p className="signin-welcome">Welcome back!</p>
          </div>

          <form className="signin-form" onSubmit={(event) => event.preventDefault()}>
            <label className="signin-field-row">
              <span className="signin-field-label">Email</span>
              <div className="signin-input-wrap">
                <input type="email" placeholder="your email address" />
              </div>
            </label>

            <label className="signin-field-row">
              <span className="signin-field-label">Password</span>
              <div className="signin-input-wrap">
                <input type="password" placeholder="your password" />
              </div>
            </label>

            <button type="submit" className="signin-submit-button">
              Submit
            </button>
          </form>

          <button type="button" className="signin-forgot-link">
            Forgot your password?
          </button>

          {authMessage ? <p className="error">{authMessage}</p> : null}

          <div className="signin-provider-list">
            <a className="signin-provider-button google" href={`${apiBaseUrl}/oauth2/authorization/google`}>
              <span className="signin-provider-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="img">
                  <path
                    fill="#EA4335"
                    d="M12 10.2v3.9h5.4c-.24 1.26-.96 2.33-2.04 3.05l3.3 2.56c1.92-1.77 3.03-4.38 3.03-7.49 0-.72-.06-1.41-.19-2.07H12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 22c2.7 0 4.97-.9 6.63-2.44l-3.3-2.56c-.91.61-2.08.97-3.33.97-2.56 0-4.73-1.73-5.5-4.06l-3.41 2.63C4.74 19.86 8.1 22 12 22z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M6.5 13.91A5.98 5.98 0 0 1 6.19 12c0-.66.11-1.3.31-1.91l-3.41-2.63A10.02 10.02 0 0 0 2 12c0 1.61.38 3.13 1.09 4.54l3.41-2.63z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12 6.03c1.47 0 2.79.5 3.83 1.47l2.87-2.87C16.96 2.99 14.7 2 12 2 8.1 2 4.74 4.14 3.09 7.46l3.41 2.63c.77-2.33 2.94-4.06 5.5-4.06z"
                  />
                </svg>
              </span>
              <span>Sign in with Google</span>
            </a>
          </div>

          <Link className="back-link" to="/">
            Back to home page
          </Link>
        </section>
      </div>
      <SiteFooter />
    </div>
  );
}
