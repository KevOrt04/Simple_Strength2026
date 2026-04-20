import { useState , useEffect} from "react";



function CalorieTracker() {
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [entries, setEntries] = useState([]);

  const totalCalories = entries.reduce((sum, entry) => {
  return sum + Number(entry.calories);
}, 0);
//grab entries and add them
const caloriesByDate = entries.reduce((acc, entry) => {
  const date = entry.date ? entry.date.split("T")[0] : "unknown";

  if (!acc[date]) {
    acc[date] = 0;
  }

  acc[date] += Number(entry.calories);

  return acc;
}, {});

console.log("By Date:", caloriesByDate);

  //GET data
  const fetchEntries = async () => {
    console.log("fetchEntries running");

    const res = await fetch("http://localhost:3000/calories");
    const data = await res.json();

    console.log("FETCHED:", data); 
      setEntries(data);
  
  };

  //RUN on load 
  useEffect(() => {
    fetchEntries();
  }, []);


  //POST data
  const handleSubmit = async () => {
    //input validation
    if (food.trim() === "" || calories.trim() === ""){
      alert("missing fields");
      return;
    }

    console.log("handleSubmit running");

    const res = await fetch("http://localhost:3000/calories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      food_name: food,
      calories: Number(calories)
    })
  });

  const result = await res.json(); //  wait for backend response

  console.log("POST result:", result);

  await fetchEntries(); // ensure this waits

  setFood("");      //clear input
  setCalories("");
};



  return (
    <div className="container">
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

      <button onClick={handleSubmit}>Add</button>
      
      <h2>Total Calories: {totalCalories}</h2>

      {entries.map((entry)  => (
        <p  key={entry.id}>
          {entry.food_name} - {entry.calories} - {entry.date}
          </p>
      ))}

         {Object.entries(caloriesByDate).map(([date, total]) => (//formating the calories per group
  <p key={date}>
    {date}: {total} calories
  </p>
))}
    </div>
  );
}

export default CalorieTracker;