import { useState } from "react";

function CalorieTracker() {
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");

  const handleSubmit = async () => {
    await fetch("http://localhost:3000/calories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        food_name: food,
        calories: calories
      })
    });

    setFood("");
    setCalories("");
  };

  return (
    <div>
      <h2>Track Calories</h2>

      <input
        type="text"
        placeholder="Food name"
        value={food}
        onChange={(e) => setFood(e.target.value)}
      />

      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
}

export default CalorieTracker;