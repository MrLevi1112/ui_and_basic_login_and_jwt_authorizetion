    import { useState } from "react";

    function SignupForm({ onSignupSuccess, onSwitchToLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
        setLoading(true);
        console.log("🔵 Sending signup request...");

        const response = await fetch("http://127.0.0.1:8001/api/signup", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            username,
            password,
            email,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: "signup failed" }));
            console.error("❌ Signup error response:", errorData);
            throw new Error(errorData.detail || "signup failed");
        }

        const data = await response.json();
        console.log("✅ Signup successful:", data);
        
        onSignupSuccess(data.access_token);
        
        } catch (err) {
        console.error("❌ Signup error:", err);
        setError(err.message || "failed to create account");
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

            <form onSubmit={handleSubmit} className="login-form">
            <label className="login-label">
                username
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                    placeholder="choose password"
                    required
                    autoComplete="new-password"
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
                {loading ? "creating account..." : "sign up"}
            </button>

            <p className="login-hint">
                already have an account?{" "}
                <span
                onClick={onSwitchToLogin}
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

    export default SignupForm;