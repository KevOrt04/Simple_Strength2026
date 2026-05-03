import "./Login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-left">
        <h1>SimpleStrength</h1>
        <p>
          A beginner-friendly fitness tracker for workouts, meals, calories, and weight progress.
        </p>

        <div className="login-features">
          <span>🔥 Track calories</span>
          <span>⚖️ Log weight</span>
          <span>🍽️ Get meal ideas</span>
          <span>🏋️ Workout suggestions</span>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">
            Sign in to continue your fitness journey.
          </p>

          <button
            className="login-btn"
            onClick={() => {
              window.location.href = "http://localhost:3000/auth/google";
            }}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;