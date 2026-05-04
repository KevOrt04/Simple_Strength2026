
import { useState, useEffect } from "react";
import "./WeightTracker.css";
import BackButton from "./BackButton";

function WeightTracker() {
  // Get user's date
  const getTodayDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().split("T")[0];
}

  const [date, setDate] = useState(getTodayDate());
  const [entries, setEntries] = useState([]);
  const [editId, setEditId] = useState(null);
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  

  // GET data
  const fetchEntries = async () => {
    try {
      const activeDate = date || getTodayDate();

const res = await fetch(
  `http://localhost:3000/weights?date=${activeDate}`
);
      const data = await res.json();
      setEntries(data);
    } catch(err) {
      
    }
  };
  // RUN on load
  useEffect(() => {
    fetchEntries();
  }, [date]);

  // POST data 
const handleSubmit = async () => {
  setError(""); // clear previous error

  // 1. Empty input
  if (!weight) {
    setError("Weight is required");
    return;
  }

  // 3. Less than or equal to 0
  if (Number(weight) <= 0) {
    setError("Weight must be greater than 0");
    return;
  }

  const entryData = {
    weight: Number(weight),
    date: date
  };

  // EDIT MODE
  if (editId !== null) {
    await fetch(`http://localhost:3000/weights/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entryData)
    });

    await fetchEntries();

    setEditId(null);
    setWeight("");
    return;
  }

  //ADD MODE
  try {
    const res = await fetch("http://localhost:3000/weights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entryData)
    });

    await res.json();
    await fetchEntries();

    setWeight("");
    setError("");

    
  }catch (err) {
  console.error("Failed to add weight:", err);
  setError("Cannot connect to server");
}
  
 
};

  const handleEdit = (entry) => {
  setWeight(String(entry.weight));
  setDate(entry.date);
  setEditId(entry.id);
}



  // remove entry from local state
  const handleDelete = async (id) => {
  await fetch(`http://localhost:3000/weights/${id}`, {
    method: "DELETE"
  });

  await fetchEntries();
};

  // Format date entries into mm/dd/yyyy
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  };

  //DEFAULT TO TODAY IF NOTHING SELCTED
const activeDate = date || getTodayDate();

const filteredEntries = entries.filter((entry) => {
   if (!entry.date) return false;
  const entryDate = entry.date.split("T")[0];
  return entryDate === activeDate;
});


  return (
  <div className="container">
    <div className="card">
      <BackButton />
      <h2>⚖️ Weight Tracker</h2>
    
      {/* Inputs side-by-side */}
      <div
        className="input-row"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr", // weight wider, date smaller
          gap: "14px",
          marginBottom: "18px",
          
        }}
      >
        <input
          type="number"
          placeholder="Enter Weight (lbs)"
          value={weight}
          min="1"
          onChange={(e) => setWeight(e.target.value)}
          style={{
            width: "90%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #d1d5db",
            fontSize: "16px",
            outline: "none",
            backgroundColor: "#f9fafb",
          }}
        />

        <input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  style={{
    width: "87%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #1f2937",
    backgroundColor: "#1f2937",
    color: "white",     
    fontSize: "16px",
    outline: "none",
    cursor: "pointer",
  
  }}
/>
      </div>

      {/* Centered Add button */}
      <button
        className="submit-btn"
        onClick={handleSubmit}
        style={{
          display: "block",
          margin: "0 auto 20px auto",
          width: "100%",
        }}
      >
        {editId !== null ? "Save" : "Add"}
        
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
            
      <div className="entries">
         {filteredEntries.length === 0 && (
    <p style={{ color: "#777", marginTop: "10px" }}>
      No entries for this day
    </p>
  )}
        {
        [...filteredEntries]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((entry) => (
            <div key={entry.id} className="entry">
              <span>
                {entry.weight} lb(s) - {formatDate(entry.date)}
              </span>

              <div className="actions">
                 <button onClick={() => handleDelete(entry.id)}
                          style={{
                              backgroundColor: "#dc2626", // red
                               color: "white",
                                border: "none",
                               padding: "6px 10px",
                               borderRadius: "6px",
                              cursor: "pointer"
                               }}>
                             Delete
                   </button>
                <button onClick={() => handleEdit(entry)}
                        style={{
                          backgroundColor: "#16a34a", // green
                          color: "white",
                          border: "none",
                          padding: "6px 20px",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}>Edit</button>
               
              </div>
            </div>
          ))}
      </div>
    </div>
  </div>
);
}

export default WeightTracker;
