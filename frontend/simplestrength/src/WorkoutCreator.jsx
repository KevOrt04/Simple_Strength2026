import { useState } from "react";

function WorkoutCreator() {
  const [muscleGroup, setMuscleGroup] = useState("");
  const [exercises, setExercises] = useState([]);

  const handleSubmit = async () => {
    await fetch("http://localhost:3000/exercises", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        muscle_group: muscleGroup,
        exercises: exercises
      })
    });

    setMuscleGroup("");
    setExercises([]);
  };

  return (
    <div className="container">
      <h2>Workout Creator</h2>

      <input
        type="text"
        placeholder="Muscle Group"
        value={muscleGroup}
        onChange={(e) => setMuscleGroup(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Generate Workout
      </button>

       <ul>
        {exercises.map((ex, i) => (
          <li key={i}>{ex.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default WorkoutCreator;