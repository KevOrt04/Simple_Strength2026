import { useState } from "react";
import "./MealPlanner.css";
import BackButton from "./BackButton";


function MealPlanner() {
  const [goal, setGoal] = useState("weight_loss");
  const [diet, setDiet] = useState("none");
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleGenerate = async () => {
    setLoading(true);
    setMeals([]);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/mealplan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ goal, diet })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate meals");
      }

      setTimeout(() => {
        setMeals(data.meals);
        setLoading(false);
      }, 500);

    } catch (err) {
      setError("Failed to generate meals");
      setLoading(false);
    }
  };

  return (
      <div className="container">
        <div className="card">
          <BackButton />
      <h2>🍽️ Meal Planner</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="meal-form">
  <div className="field">
    <label>Fitness Goal:</label>
    <select value={goal} onChange={(e) => setGoal(e.target.value)}>
      <option value="weight_loss">Weight Loss</option>
      <option value="muscle_gain">Muscle Gain</option>
    </select>
  </div>

  <div className="field">
    <label>Dietary Preference:</label>
    <select value={diet} onChange={(e) => setDiet(e.target.value)}>
      <option value="none">None</option>
      <option value="vegetarian">Vegetarian</option>
      <option value="vegan">Vegan</option>
    </select>
  </div>

  <button
    className="Getsuggest-btn"
    onClick={handleGenerate}
    disabled={loading}
  >
    {loading ? "Generating..." : "Get Suggestions"}
  </button>
</div>

        <h3>
          Suggested Meals for{" "}
          {goal === "weight_loss" ? "Weight Loss" : "Muscle Gain"}{" "}
          {diet !== "none" && `(${diet.charAt(0).toUpperCase() + diet.slice(1)})`}
        </h3>

        {loading ? (
          <p style={{ color: "#777" }}>Generating meals...</p>
        ) : meals.length === 0 ? (
          <p style={{ color: "#777" }}>No suggestions yet</p>
        ) : (
          meals.map((meal, index) => (
            <div
              key={index}
              style={{
                padding: "10px",
                marginBottom: "8px",
                borderRadius: "8px",
                backgroundColor: "#e9f7ef",
                color: "green",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span>🥗{meal}</span>
              </div>
            
          ))
        )}
     
    </div>
    </div>
  );
}

export default MealPlanner;