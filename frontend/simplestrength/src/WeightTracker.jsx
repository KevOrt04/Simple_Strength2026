
import { useState, useEffect } from "react";

function WeightTracker() {
  // Get user's date
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  }

  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(getTodayDate());
  const [entries, setEntries] = useState([]);
  const [editId, setEditId] = useState(null);

  // GET data
  const fetchEntries = async () => {
    try {
      const res = await fetch("http://localhost:3000/weights");
      const data = await res.json();
      setEntries(data);
    } catch(err) {
      console.log("GET route not ready yet");
    }
  };
  // fetch entries when page is loaded
  useEffect(() => {
    fetchEntries();
  }, []);

  // POST data 
  const handleSubmit = async () => {
    // Input Validation
    if (!Number.isInteger(Number(weight)) || Number(weight) <= 0) {
      alert("Make sure you enter a proper integer value for weights");
      return;
    }
    
    const entryData = {
      weight: Number(weight),
      date: date
    };

    // Edit Mode
    if (editId !== null) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editId ? { ...entry, ...entryData} : entry
        )
      );

      setEditId(null);
      setWeight("");
      setDate(getTodayDate());
      return;
    }

    // Add mode
    try {
      const res = await fetch("http://localhost:3000/weights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(entryData)
      });

      const result = await res.json();
      console.log("POST result:", result);

      await fetchEntries();
    } catch (err) {
      console.log("POST route not ready yet");

      // fallback when backend not applied
      setEntries((prev) => [
        {
          id: Date.now(),
          ...entryData
        },
        ...prev
      ]);
    }

    setWeight("");
    setDate(getTodayDate());
  }

  // load entry values back into inputs
  const handleEdit = (entry) => {
    setWeight(String(entry.weight));
    setDate(entry.date);
    setEditId(entry.id);
  }

  // remove entry from local state
  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));

    if (editId === id) {
      setEditId(null);
      setWeight("");
      setDate(getTodayDate());
    }
  }

  // Format date entries into mm/dd/yyyy
  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  };

  return (

    <div className="container">
      <h2>Track Weight</h2>

      {/* weight input */}
      <input
        type="number"
        placeholder="Enter Weight (in lbs)"
        value={weight}
        min="1"
        onChange={(e) => setWeight(e.target.value)}
      />

      {/* date input */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={handleSubmit}>
        {editId !== null ? "Save" : "Add"}
      </button>

      {/* display list of entries */}
      {/*entries are sorted newest to oldest by date*/}
      {[...entries]
        .sort((a,b) => new Date(b.date) - new Date(a.date))
        .map((entry) => (
          <p key={entry.id}>
            {entry.weight} lb(s) - {formatDate(entry.date)}

            <button onClick={() => handleEdit(entry)}>
              Edit
            </button>

            <button onClick={() => handleDelete(entry.id)}>
              Delete
            </button>
          </p>
        ))
      }
    </div>
  );
}


export default WeightTracker;
