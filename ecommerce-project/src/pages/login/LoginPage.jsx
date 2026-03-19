import { useMemo, useState } from 'react';
import { Navigate } from 'react-router';
import { demoUsers } from '../../data/auth';
import './LoginPage.css';

export function LoginPage({ currentUser, onLogin }) {
  const [email, setEmail] = useState(demoUsers[1].email);
  const [password, setPassword] = useState(demoUsers[1].password);
  const [error, setError] = useState('');

  const credentials = useMemo(() => demoUsers, []);
  const selectedCredential = credentials.find((user) => user.email === email.trim().toLowerCase());

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const handleCredentialSelect = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const matchedUser = demoUsers.find(
      (user) => user.email === email.trim().toLowerCase() && user.password === password
    );

    if (!matchedUser) {
      setError('Use one of the demo accounts shown below to sign in.');
      return;
    }

    setError('');
    onLogin(matchedUser);
  };

  return (
    <div className="login-page-shell">
      <div className="login-hero-panel">
        <div className="eyebrow">Northstar Market</div>
        <h1>Dark-mode storefront with instant demo access.</h1>
        <p>
          Sign in with either preloaded account to manage orders, track deliveries,
          and save favorites per user profile.
        </p>
        <div className="credentials-grid">
          {credentials.map((user) => {
            const isSelected = selectedCredential?.email === user.email && password === user.password;

            return (
              <button
                key={user.email}
                type="button"
                className={`credential-card${isSelected ? ' credential-card--selected' : ''}`}
                onClick={() => handleCredentialSelect(user)}
                aria-pressed={isSelected}
              >
                <span className="credential-role">{user.role}</span>
                <h2>{user.accent}</h2>
                <div className="credential-item">
                  <span>Email</span>
                  <strong>{user.email}</strong>
                </div>
                <div className="credential-item">
                  <span>Password</span>
                  <strong>{user.password}</strong>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form className="login-form-card" onSubmit={handleSubmit}>
        <div>
          <div className="eyebrow">Secure demo login</div>
          <h2>Welcome back</h2>
          <p>Click a credential card to autofill the demo account details.</p>
        </div>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="user@northstar.dev"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </label>

        {error ? <div className="login-error">{error}</div> : null}

        <button className="button-primary login-submit" type="submit">
          Sign in to dashboard
        </button>
      </form>
    </div>
  );
}
