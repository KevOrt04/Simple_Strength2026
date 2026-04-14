import { useState } from "react";

function WorkoutCreator() {
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
    <div className="container">
      <h2>Workout Creator</h2>

      <input
        type="text"
        placeholder="Workout Name"
        value={food}
        onChange={(e) => setFood(e.target.value)}
      />

      <input
        type="number"
        placeholder="Number of reps"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
}

export default WorkoutCreator;