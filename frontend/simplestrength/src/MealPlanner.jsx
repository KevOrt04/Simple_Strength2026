import { useState } from "react";

function MealPlanner() {
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");

  const handleSubmit = async () => {
    await fetch("http://localhost:3000/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        meal_name: mealName,
        meal_type: mealType,
        calories,
        protein,
        carbs,
        fats
      })
    });

    setMealName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFats("");
  };

  return (
  <div className="meal-container">
    <h2>Meal Planner</h2>

    <div className="form">
      <input
        type="text"
        placeholder="Meal name"
        value={mealName}
        onChange={(e) => setMealName(e.target.value)}
      />

      <select
        value={mealType}
        onChange={(e) => setMealType(e.target.value)}
      >
        <option>Breakfast</option>
        <option>Lunch</option>
        <option>Dinner</option>
        <option>Snack</option>
      </select>

      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />

      <input
        type="number"
        placeholder="Protein (g)"
        value={protein}
        onChange={(e) => setProtein(e.target.value)}
      />

      <input
        type="number"
        placeholder="Carbs (g)"
        value={carbs}
        onChange={(e) => setCarbs(e.target.value)}
      />

      <input
        type="number"
        placeholder="Fats (g)"
        value={fats}
        onChange={(e) => setFats(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Add Meal
      </button>
    </div>
  </div>
);

}

export default MealPlanner;