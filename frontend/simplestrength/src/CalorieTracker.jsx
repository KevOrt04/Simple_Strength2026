import { useState , useEffect} from "react";



function CalorieTracker() {
  const [editId, setEditId] = useState(null);
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('en-CA')


 )

    // FILTER FIRST
  const filteredEntries = entries.filter((entry) => {
  const entryDate = entry.date ? entry.date.split("T")[0] : "";

  const today = new Date().toLocaleDateString('en-CA')

  if (!selectedDate) {
    return entryDate === today; // show only today by default
  }

  return entryDate === selectedDate; // filter when user picks date
});

  // TOTAL (must use filtered)
  const totalCalories = filteredEntries.reduce((sum, entry) => {
    return sum + Number(entry.calories);
  }, 0);

  //GET data
  const fetchEntries = async () => {
  console.log("fetchEntries running");


  try {
    const res = await fetch("http://localhost:3000/calories");

    if (!res.ok) {
      console.error("Server error while fetching entries");
      setError("Server error ocurred");
      return;
    }

    const data = await res.json();

    console.log("FETCHED:", data);
    setEntries(data);

    setError(""); //clear error if succesful

  } catch (err) {
    console.error("Network error while fetching entries:", err);
    setError("Cannot connect to server");
  }
};

  //RUN on load 
  useEffect(() => {
    fetchEntries();
  }, []);


  //POST data
  const handleSubmit = async () => {
     //input validation
    if (!food.trim()) {
      setError("Food name is required");
      return;
    }
    if (!/^[a-zA-Z\s]+$/.test(food)) {
      setError("Food name must contain only letters");
      return;
    }

    if (!calories) {
      setError("Calories are required");
      return;
    }

    if (Number(calories) <= 0 || Number(calories) > 2000){
      setError("Calories must be between 1 and 2000");
      return;
    }

    console.log("handleSubmit running");
    try{
    const url = editId
      ? `http://localhost:3000/calories/${editId}`
      : "http://localhost:3000/calories";
    const method = editId ? "PUT" : "POST";
    
    const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      food_name: food,
      calories: Number(calories),
      date: selectedDate
    })
  });
  
  if(!res.ok){
    console.error("Server error while adding entry");
    return;
  }

  const result = await res.json(); //  wait for backend response
  console.log("POST result:", result);

  await fetchEntries(); // ensure this waits

  setFood("");      //clear input
  setCalories("");
  setEditId(null);

} catch (err){
   console.error("Network error while adding entry:", err);
}
  }; //this closes handle submit

  //to delete user inputs
  const handleDelete = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/calories/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      console.error("Failed to delete");
      return;
    }

    await fetchEntries();
  } catch (err) {
    console.error("Delete error:", err);
  }
};
const handleEdit = (entry) => {
  setFood(entry.food_name);
  setCalories(entry.calories);
  setSelectedDate(entry.date);
  setEditId(entry.id);
};

  return (
    <div className="container">
      <h2>Track Calories</h2>

      {/*Date Picker*/}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "10px" }}>Select Date:</label>
        <input
           type="date"
           value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ padding: "5px" }}
      />
      </div>
      
      {/*Error*/}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Food name"
        value={food}
        onChange={(e) => {setFood(e.target.value);
          setError("");
        }}
      />

      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => {setCalories(e.target.value);
          setError("");
        }}
      />

      <button onClick={handleSubmit}>
        {editId ? "Update" : "Add"}
      </button>
      
      <h2>Total Calories: {totalCalories}</h2>

      {filteredEntries.map((entry)  => (
        <div
           key={entry.id}
           style={{
             display: "flex",
             justifyContent: "space-between",
             alignItems: "center",
             maxWidth: "500px",
             width: "100%",
             margin: "0 auto 12px auto",
             padding: "8px 12px",
             borderBottom: "1px solid #333"
     
  }}
>
  <span style={{ flex: 1, textAlign: "left" }}>
    {entry.food_name} - {entry.calories} - {entry.date}
  </span>
    
  <button style={{ minWidth: "70px" }}  onClick={() => handleDelete(entry.id)}>
    Delete
  </button>

  <button style={{ minWidth: "70px" }} onClick={() => handleEdit(entry)}>
    Edit
  </button>

</div>
      ))}

    </div>
  );
}

export default CalorieTracker;