```javascript
import { useState } from "react";
import { useAuth } from "./context/AuthContext";

function LoginForm({ onSwitchToSignup }) {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);
            console.log("🔵 Sending login request...");
            
            await login(username, password);
            console.log("✅ Login successful");
            
        } catch (err) {
            console.error("❌ Login error:", err);
            // Check if it's an axios error with response data
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("wrong username or password");
            }
        } finally {
            setLoading(false);
        }
    };

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

        <form onSubmit={handleSubmit} className="login-form">
            <label className="login-label">
            username
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
                placeholder="enter username"
                autoComplete="username"
            />
            </label>

            <label className="login-label">
            password
            <div className="password-input-wrapper">
                <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="enter password"
                autoComplete="current-password"
                />
                <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? "🙈" : "👁️"}
                </button>
            </div>
            </label>

            {error && <div className="login-error">{error}</div>}

            <button
            type="submit"
            className="login-button"
            disabled={loading}
            >
            {loading ? "checking..." : "submit"}
            </button>

            <p className="login-hint">
            don't have an account?{" "}
            <span
                onClick={onSwitchToSignup}
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

export default LoginForm;
```