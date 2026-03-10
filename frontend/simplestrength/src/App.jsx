import { Routes, Route } from "react-router-dom";
import WeightTracker from "./WeightTracker";
import CalorieTracker from "./CalorieTracker";
import MealPlanner from "./MealPlanner";
import WorkoutCreator from "./WorkoutCreator";
import HomePage from "./HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/weighttracker" element={<WeightTracker />} />
      <Route path="/calorietracker" element={<CalorieTracker />} />
      <Route path="/mealplanner" element={<MealPlanner />} />
      <Route path="/workoutcreator" element={<WorkoutCreator />} />
    </Routes>
  );
}

export default App;