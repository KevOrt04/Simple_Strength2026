import { Routes, Route } from "react-router-dom";
import WeightTracker from "./WeightTracker";
import CalorieTracker from "./CalorieTracker";
import MealPlanner from "./MealPlanner";
import WorkoutCreator from "./WorkoutCreator";
import HomePage from "./HomePage";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Routes>
  {/* Public routes */}
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />

  {/* Protected routes */}
  <Route
    path="/home"
    element={
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    }
  />

  <Route
    path="/calorietracker"
    element={
      <ProtectedRoute>
        <CalorieTracker />
      </ProtectedRoute>
    }
  />

  <Route
    path="/weighttracker"
    element={
      <ProtectedRoute>
        <WeightTracker />
      </ProtectedRoute>
    }
  />

  <Route
    path="/mealplanner"
    element={
      <ProtectedRoute>
        <MealPlanner />
      </ProtectedRoute>
    }
  />

  <Route
    path="/workoutcreator"
    element={
      <ProtectedRoute>
        <WorkoutCreator />
      </ProtectedRoute>
    }
  />

  {/* fallback */}
  <Route path="*" element={<Login />} />
</Routes>
  );
}

export default App;