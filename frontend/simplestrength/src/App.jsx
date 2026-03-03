import { Routes, Route } from "react-router-dom";
import WeightTracker from "./WeightTracker";
import CalorieTracker from "./CalorieTracker";
import MealPlanner from "./MealPlanner";
import WorkoutCreator from "./WorkoutCreator";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/weighttracker" element={<WeightTracker />} />
      <Route path="/Calorietracker" element={<CalorieTracker />} />
      <Route path="/mealplanner" element={<MealPlanner />} />
      <Route path="/workoutcreator" element={<WorkoutCreator/>} />
    </Routes>
  );
}

export default App;