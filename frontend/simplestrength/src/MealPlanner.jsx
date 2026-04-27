import { useState, useEffect } from "react";


function MealPlanner() {
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [calories, setCalories] = useState("");
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState("");

  function getLocalDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}
  const [selectedDate, setSelectedDate] = useState(getLocalDate());


  const fetchMeals = async () => {
  const res = await fetch("http://localhost:3000/meals");
  const data = await res.json();
  setMeals(data);
};


useEffect(() => {
  fetchMeals();
}, []);

  const handleSubmit = async () => {

    if (!mealName.trim()){
      setError("food name is required");
      return;
    }

   if (!mealName || !/^[a-zA-Z\s]+$/.test(mealName)) {
     setError("Food name must contain only letters");
     return;
   }

    if (calories && (isNaN(calories) || calories <= 0 || calories > 2000)) {
     setError("Calories must be between 1 and 2000");
     return;
  }
   //Fetch runs only if valid
    await fetch("http://localhost:3000/meals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        meal_name: mealName,
        meal_type: mealType,
        calories,
        date: selectedDate
      })
    });

    setMealName("");
    setCalories("");

    await fetchMeals();
  };


  const breakfastMeals = meals.filter(
  m => m.meal_type === "Breakfast" && m.date === selectedDate
);

const lunchMeals = meals.filter(
  m => m.meal_type === "Lunch" && m.date === selectedDate
);

const dinnerMeals = meals.filter(
  m => m.meal_type === "Dinner" && m.date === selectedDate
);



  return (
  <div className="meal-container">
    <h2>Meal Planner</h2>

    {error && <p style={{ color: "red" }}>{error}</p>}

    
      <div style={{ marginBottom: "15px" }}>
        <label>Select Date: </label>
        <input
           type="date"
           value={selectedDate}
           onChange={(e) => setSelectedDate(e.target.value)}
        />
</div>
    <div className="form">
      <select
        value={mealType}
        onChange={(e) => setMealType(e.target.value)}
      >
        <option>Breakfast</option>
        <option>Lunch</option>
        <option>Dinner</option>
      
      </select>

      <input
        type="text"
        placeholder="Food Name"
        value={mealName}
        onChange={(e) => { setMealName(e.target.value);
        setError("");
        }}
      />


      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => { setCalories(e.target.value);
          setError("");
        }}
      />


      <button onClick={handleSubmit}>
        Add Meal
      </button>
    </div>
    <div style={{ marginTop: "20px" }}>

  <h3>Breakfast</h3>
{breakfastMeals.length === 0 ? (
  <p style={{ color: "#777" }}>No meals</p>
) : (
  breakfastMeals.map((meal, index) => (
    <div key={index}>
      {meal.meal_name} - {meal.calories} kcal
    </div>
  ))
)}

  <h3>Lunch</h3>
  {lunchMeals.length === 0 ? (
    <p style={{ color: "#777" }}>No meals</p>
) : (
  lunchMeals.map((meal, index) => (
    <div key={index}>
      {meal.meal_name} - {meal.calories} kcal
    </div>
  ))
)}

  <h3>Dinner</h3>
    {dinnerMeals.length === 0 ? (
      <p style={{ color: "#777" }}>No meals</p>
) : (
  dinnerMeals.map((meal, index) => (
    <div key={index}>
      {meal.meal_name} - {meal.calories} kcal
    </div>
  ))
)}

</div>
  
  </div>
);

}

export default MealPlanner;