import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import api from "./services/api";

function AdminDashboard() {
  const { logout } = useAuth();
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEstimates();
  }, []);

  const fetchEstimates = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("🔵 Fetching admin estimates...");
      const response = await api.get("/admin/estimates");

      console.log("✅ Admin estimates fetched:", response.data);
      setEstimates(response.data.estimates || []);
    } catch (err) {
      console.error("❌ Error fetching estimates:", err);
      setError(err.message || "Failed to fetch estimates");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="logo-stack">
          <div className="logo-circle outer" />
          <div className="logo-circle inner">c2c</div>
        </div>
        <div className="header-text">
          <h1>admin dashboard</h1>
          <p className="subtitle">
            manage all estimates
            <span className="subtitle-dot" />
          </p>
        </div>
        <div className="header-pill">
          <span className="pill-label">mode</span>
          <span className="pill-value">admin</span>
        </div>
      </header>

      <main className="app-content">
        <section className="card">
          <div className="card-header" style={{ justifyContent: "space-between" }}>
            <div>
              <h2 className="card-title">all estimates</h2>
              <p className="card-subtitle">
                Overview of all damage estimates submitted by users
              </p>
            </div>
            <button onClick={logout} className="primary-button" style={{ padding: "10px 16px", fontSize: "13px" }}>
              <span className="btn-text">logout</span>
            </button>
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
              <p className="loading-text">loading estimates...</p>
            </div>
          )}

          {error && <div className="error-banner">{error}</div>}

          {!loading && !error && (
            <div className="detected-list">
              {estimates.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-orbit" />
                  <p className="empty-title">no estimates yet</p>
                  <p className="empty-subtitle">
                    Estimates will appear here once users upload images
                  </p>
                </div>
              ) : (
                estimates.map((est) => (
                  <div key={est._id} className="detected-item">
                    <div className="detected-main">
                      <span className="part">{est.filename}</span>
                      <span className="badge">ID: {est._id.substring(0, 8)}...</span>
                      <span className="badge secondary">
                        {new Date(est.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="detected-meta">
                      Total Cost:
                      <span className="price"> {est.totalCost} ₪</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
