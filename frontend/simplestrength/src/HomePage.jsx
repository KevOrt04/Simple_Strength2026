import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (!data.authenticated) {
          navigate("/login");
          return;
        }

        setUser(data.user);
      } catch (err) {
        navigate("/login");
      }
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    navigate("/login");
  };

  const formatName = (name) => {
    if (!name) return "";

    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const features = [
    {
      title: "🔥 Calorie Tracker",
      description: "Track your daily calorie intake",
      route: "/calorietracker",
    },
    {
      title: "⚖️ Weight Tracker",
      description: "Log and monitor your weight",
      route: "/weighttracker",
    },
    {
      title: "🍽️ Meal Planner",
      description: "Get meal suggestions based on your goals",
      route: "/mealplanner",
    },
    {
      title: "🏋️ Workout Suggestions",
      description: "Explore suggested workouts",
      route: "/workoutcreator",
    },
  ];

  return (
    <div className="home-container">
      <div className="top-bar">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="home-card">
        <h1>Welcome to SimpleStrength</h1>

        {user && (
          <p className="home-user">
            Signed in as {formatName(user.displayName || user.email)}
          </p>
        )}

        <p className="home-subtitle">
          Choose a tool to continue your fitness journey.
        </p>

        <div className="feature-grid">
          {features.map((feature) => (
            <div
              key={feature.route}
              className="feature-card"
              onClick={() => navigate(feature.route)}
            >
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;