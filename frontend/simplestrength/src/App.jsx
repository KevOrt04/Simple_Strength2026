import { Routes, Route } from "react-router-dom";
import WeightTracker from "./WeightTracker";
import CalorieTracker from "./CalorieTracker";
import MealPlanner from "./MealPlanner";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/weighttracker" element={<WeightTracker />} />
      <Route path="/Calorietracker" element={<CalorieTracker />} />
      <Route path="/MealPlanner" element={<MealPlanner />} />
    </Routes>
  );
}

export default App;