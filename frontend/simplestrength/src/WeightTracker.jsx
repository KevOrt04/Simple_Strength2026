
import { useState, useEffect } from "react";

function WeightTracker() {
  const [weight, setWeight] = useState("");
  const [entries, setEntries] = useState([]);

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
    // POSTing data if it's get implemented into backend
    try {
      const res = await fetch("http://localhost:3000/weights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          weight: Number(weight)
        })
      });

      const result = await res.json();
      console.log("POST result:", result);

      await fetchEntries();
    } catch (err) {
      console.log("POST route not ready yet");
    }

    setWeight("");
  }

  return (
    <div className="container">
      <h2>Track Weight</h2>

      {/* input field for weight */}
      <input
        type="number"
        placeholder="Enter Weight"
        value={weight}
        min="1"
        onChange={(e) => setWeight(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Add
      </button>

      {/* display list of entries */}
      {entries.map((entry) => (
        <p key={entry.id}>
          {entry.weight}
        </p>
      ))}
    </div>
  );
}


export default WeightTracker;
