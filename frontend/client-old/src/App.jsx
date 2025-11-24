import { useState, useEffect } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ImageUploader from "./ImageUploader";
import ResultsDisplay from "./ResultsDisplay";
import AdminDashboard from "./AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

function AppContent() {
  const { user, token, logout } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  // State lifted up to share between Uploader and Display
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  // Intro screen timeout
  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setAnalysisError("");
    setAnalysisResult(null);
  };

  const handleAnalysisComplete = (data) => {
    setAnalysisResult(data);
    setIsAnalyzing(false);
  };

  const handleAnalysisError = (msg) => {
    setAnalysisError(msg);
    setIsAnalyzing(false);
  };

  // --- Render Logic ---

  if (showIntro) {
    return (
      <div className="intro-screen">
        <div className="intro-logo">c2c</div>
        <p className="intro-text">crash2cost</p>
        <div className="intro-loader"></div>
      </div>
    );
  }

  if (!token) {
    return showSignup ? (
      <SignupForm 
        onSwitchToLogin={() => setShowSignup(false)}
      />
    ) : (
      <LoginForm 
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  // Main app - if admin, show admin dashboard
  if (user?.role === 'admin') {
    return (
      <div className="app-root">
        <div className="bg-orbit orbit-1" />
        <div className="bg-orbit orbit-2" />
        <div className="bg-orbit orbit-3" />

        <AdminDashboard />
      </div>
    );
  }

  // Regular user - show image uploader
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
          <button 
            onClick={logout} 
            className="primary-button" 
            style={{ 
              padding: "10px 20px", 
              fontSize: "14px",
              marginLeft: "auto"
            }}
          >
            <span className="btn-glow" />
            <span className="btn-text">logout</span>
          </button>
        </header>

        <main className="app-content">
          <ImageUploader 
            onAnalysisStart={handleAnalysisStart}
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleAnalysisError}
          />
          
          <ResultsDisplay 
            result={analysisResult}
            loading={isAnalyzing}
          />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;