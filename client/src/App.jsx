import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [token, setToken] = useState(null);

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [showSignup, setShowSignup] = useState(false);
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // intro screen timeout
  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(t);
  }, []);

  // upload handlers

  const handleFileChange = (e) => {
    const selected = e.target.files[0] || null;
    setFile(selected);
    setResult(null);
    setError("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!droppedFile) {
      return;
    }

    setFile(droppedFile);
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("please select an image first");
      return;
    }

    if (!token) {
      setError("you must be logged in");  // שונה - לא דורש אדמין
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/api/estimate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("server returned an error");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  // login

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      setLoginLoading(true);
      console.log("🔵 Sending login request...");

      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      console.log("📨 Login response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Login error response:", errorText);
        throw new Error("invalid credentials");
      }

      const data = await response.json();
      console.log("✅ Login successful:", data);
      setToken(data.access_token);
      setLoginUsername("");
      setLoginPassword("");
      setLoginError("");
    } catch (err) {
      console.error("❌ Login error:", err);
      setLoginError("wrong username or password");
    } finally {
      setLoginLoading(false);
    }
  };

  // signup

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");

    try {
      setSignupLoading(true);
      console.log("🔵 Sending signup request...");

      const response = await fetch("http://127.0.0.1:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signupUsername,
          password: signupPassword,
          email: signupEmail,
        }),
      });

      console.log("📨 Signup response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "signup failed" }));
        console.error("❌ Signup error response:", errorData);
        throw new Error(errorData.detail || "signup failed");
      }

      const data = await response.json();
      console.log("✅ Signup successful:", data);
      setToken(data.access_token);
      setSignupUsername("");
      setSignupPassword("");
      setSignupEmail("");
      setSignupError("");
      setShowSignup(false);
    } catch (err) {
      console.error("❌ Signup error:", err);
      setSignupError(err.message || "failed to create account");
    } finally {
      setSignupLoading(false);
    }
  };

  // intro screen

  if (showIntro) {
    return (
      <div className="intro-screen">
        <div className="intro-logo">c2c</div>
        <p className="intro-text">crash2cost</p>
        <div className="intro-loader"></div>
      </div>
    );
  }

  // login screen – לפני שנכנסים לאפליקציה

  if (!token) {
    // אם נמצאים במסך הרשמה
    if (showSignup) {
      return (
        <div className="login-root">
          <div className="bg-orbit orbit-1" />
          <div className="bg-orbit orbit-2" />
          <div className="bg-orbit orbit-3" />

          <div className="login-card">
            <div className="login-header">
              <div className="logo-stack">
                <div className="logo-circle outer" />
                <div className="logo-circle inner">c2c</div>
              </div>
              <div>
                <h1 className="login-title">create account</h1>
                <p className="login-subtitle">
                  join crash2cost damage analysis platform
                </p>
              </div>
            </div>

            <div className="login-decorative">
              <div className="deco-line"></div>
              <span className="deco-text">register</span>
              <div className="deco-line"></div>
            </div>

            <form onSubmit={handleSignupSubmit} className="login-form">
              <label className="login-label">
                username
                <input
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  className="login-input"
                  placeholder="choose username"
                  required
                  autoComplete="username"
                />
              </label>

              <label className="login-label">
                email
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="login-input"
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                />
              </label>

              <label className="login-label">
                password
                <div className="password-input-wrapper">
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="login-input"
                    placeholder="choose password"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                  >
                    {showSignupPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </label>

              {signupError && <div className="login-error">{signupError}</div>}

              <button
                type="submit"
                className="login-button"
                disabled={signupLoading}
              >
                {signupLoading ? "creating account..." : "sign up"}
              </button>

              <p className="login-hint">
                already have an account?{" "}
                <span
                  onClick={() => setShowSignup(false)}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  sign in
                </span>
              </p>
            </form>
          </div>
        </div>
      );
    }

    // מסך התחברות
    return (
      <div className="login-root">
        <div className="bg-orbit orbit-1" />
        <div className="bg-orbit orbit-2" />
        <div className="bg-orbit orbit-3" />

        <div className="login-card">
          <div className="login-header">
            <div className="logo-stack">
              <div className="logo-circle outer" />
              <div className="logo-circle inner">c2c</div>
            </div>
            <div>
              <h1 className="login-title">admin console</h1>
              <p className="login-subtitle">
                sign in to access crash2cost damage analysis
              </p>
            </div>
          </div>

          <div className="login-decorative">
            <div className="deco-line"></div>
            <span className="deco-text">sign in</span>
            <div className="deco-line"></div>
          </div>

          <form onSubmit={handleLoginSubmit} className="login-form">
            <label className="login-label">
              username
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="login-input"
                placeholder="enter username"
                autoComplete="username"
              />
            </label>

            <label className="login-label">
              password
              <div className="password-input-wrapper">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="login-input"
                  placeholder="enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </label>

            {loginError && <div className="login-error">{loginError}</div>}

            <button
              type="submit"
              className="login-button"
              disabled={loginLoading}
            >
              {loginLoading ? "checking..." : "submit"}
            </button>

            <p className="login-hint">
              don't have an account?{" "}
              <span
                onClick={() => setShowSignup(true)}
                style={{ cursor: "pointer", textDecoration: "underline" }}
              >
                create new account
              </span>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // main app – אחרי לוגין

  return (
    <div className="app-root">
      <div className="bg-orbit orbit-1" />
      <div className="bg-orbit orbit-2" />
      <div className="bg-orbit orbit-3" />

      <div className="app-wrapper">
        <header className="app-header">
          <div className="logo-stack">
            <div className="logo-circle outer" />
            <div className="logo-circle inner">c2c</div>
          </div>
          <div className="header-text">
            <h1>crash2cost</h1>
            <p className="subtitle">
              ai-powered damage estimation
              <span className="subtitle-dot" />
            </p>
          </div>
          <div className="header-pill">
            <span className="pill-label">mode</span>
            <span className="pill-value">admin · dev</span>
          </div>
        </header>

        <main className="app-content">
        <section className="card card-left">
          <div className="card-header">
            <h2 className="card-title">upload frame</h2>
            <span className="card-chip">step 1</span>
          </div>
          <p className="card-subtitle">
            drop or select a damaged car image. we&apos;ll decode it and send it
            through the crash2cost pipeline.
          </p>

          <form onSubmit={handleSubmit} className="form">
            <label
              className={`file-input-label ${
                isDragging ? "drag-active" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="file-input-inner">
                <div className="file-icon" />
                <div className="file-text">
                  <span className="file-main">
                    click to browse or drag & drop
                  </span>
                  <span className="file-sub">supported: jpg, png, webp</span>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
            </label>

            <button
              type="submit"
              className="primary-button"
              disabled={loading || !file}
            >
              <span className="btn-glow" />
              <span className="btn-text">
                {loading ? "analyzing frame..." : "upload and analyze"}
              </span>
            </button>

            {error && <div className="error-banner">{error}</div>}
          </form>

          {file && (
            <div className="preview-card">
              <div className="preview-header">
                <span className="preview-badge">live preview</span>
                <span className="preview-filename">{file.name}</span>
              </div>
              <div className="preview-frame">
                <div className="preview-overlay" />
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="preview-image"
                />
              </div>
            </div>
          )}
        </section>

        <section className="card card-right">
          <div className="card-header">
            <h2 className="card-title">damage analysis</h2>
            <span className="card-chip alt">step 2</span>
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
              <p className="loading-text">running damage inference...</p>
            </div>
          )}

          {!result && !loading && (
            <div className="empty-state">
              <div className="empty-orbit" />
              <p className="empty-title">no analysis yet</p>
              <p className="empty-subtitle">
                upload an image on the left to run a full damage inference.
              </p>
            </div>
          )}

          {result && !loading && (
            <>
              <div className="summary-row">
                <div className="pill">
                  <span className="pill-label">estimate id</span>
                  <span className="pill-value">
                    {result.estimateId || "n/a"}
                  </span>
                </div>
                <div className="pill">
                  <span className="pill-label">file</span>
                  <span className="pill-value">{result.filename}</span>
                </div>
                {result.totalCost !== undefined && (
                  <div className="pill strong">
                    <span className="pill-label">total cost</span>
                    <span className="pill-value">
                      {result.totalCost} ₪
                    </span>
                  </div>
                )}
              </div>

              {result.analysis &&
                result.analysis.detected &&
                result.analysis.detected.length > 0 && (
                  <div className="detected-list">
                    {result.analysis.detected.map((d, index) => (
                      <div key={index} className="detected-item">
                        <div className="detected-main">
                          <span className="part">{d.part}</span>
                          <span className="badge">sev {d.severity}</span>
                          <span className="badge secondary">
                            {d.damageType}
                          </span>
                        </div>
                        <div className="detected-meta">
                          bbox: [{d.bbox.join(", ")}] · repair:
                          <span className="price"> {d.repairCost} ₪</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              <div className="json-header">
                <span className="json-title">raw payload</span>
                <span className="json-tag">debug · dev only</span>
              </div>
              <pre className="json-box">
                {JSON.stringify(result, null, 2)}
              </pre>
            </>
          )}
        </section>
      </main>
      </div>
    </div>
  );
}

export default App;
