import { useState, useEffect } from "react";
import "./CalorieTracker.css";

function CalorieTracker() {

  const getLocalDate = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now - offset).toISOString().split("T")[0];
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  };

  const [editId, setEditId] = useState(null);
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(getLocalDate());

  const totalCalories = entries.reduce((sum, entry) => {
    return sum + Number(entry.calories);
  }, 0);


  const fetchEntries = async () => {
    try {
      const activeDate = selectedDate || getLocalDate();

      const res = await fetch(
        `http://localhost:3000/calories?date=${activeDate}`
      );

      if (!res.ok) {
        let errMsg = "Server error";
        try {
          const errData = await res.json();
          errMsg = errData.error;
        } catch {}
        setError(errMsg);
        return;
      }

      const data = await res.json();
      setEntries(data);
      setError("");

    } catch (err) {
      console.error("Network error while fetching entries:", err);
      setError("Cannot connect to server");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [selectedDate]);

  // POST / PUT
  const handleSubmit = async () => {
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

    if (Number(calories) <= 0 || Number(calories) > 2000) {
      setError("Calories must be between 1 and 2000");
      return;
    }

    try {
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

      if (!res.ok) {
        let errMsg = "Server error";
        try {
          const errData = await res.json();
          errMsg = errData.error;
        } catch {}
        setError(errMsg);
        return;
      }

      await res.json();
      await fetchEntries();

      setFood("");
      setCalories("");
      setEditId(null);

    } catch (err) {
      console.error("Network error while adding entry:", err);
      setError("Cannot connect to server");
    }
  };

  // DELETE
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
    setEditId(entry.id);
  };

  return (
    <div className="calorie-tracker">
      <div className="page">
        <div className="container">
          <div className="card">

            <h2>Calorie Tracker</h2>

            {/* Inputs */}
            <div className="input-row">
              
              <input
                type="text"
                placeholder="Food name"
                value={food}
                onChange={(e) => {
                  setFood(e.target.value);
                  setError("");
                  
                }}
              />

              <input
                type="number"
                placeholder="Calories"
                value={calories}
                onChange={(e) => {
                  setCalories(e.target.value);
                  setError("");
                }}
              />
            </div>

            <button className="add-btn" onClick={handleSubmit}>
              {editId ? "Update" : "Add"}
            </button>

            {/* Error */}
            {error && <p className="error">{error}</p>}

            {/* Total */}
            <div className="total-section">
              <div className="total-circle">
                <p className="total-label">Your Calories</p>
                <h1 className="total-value">{totalCalories}</h1>
                <span className="kcal">kcal</span>
              </div>
            </div>

            {/* Date */}
            <div className="date-section">
              <label>Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedDate(value || getLocalDate());
                }}
              />
            </div> 

            {/* Entries */}
            <div className="entries">
              {entries.length === 0 && (
                <p style={{ color: "#777", marginTop: "10px" }}>
                  No entries for this day
                </p>
              )}

              {entries.map((entry) => (
                <div key={entry.id} className="entry">
                  <span>
                    {entry.food_name} - {entry.calories} - {formatDate(entry.date)}
                  </span>

                  <div className="actions">
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(entry.id)}
                    >
                      Delete
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(entry)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CalorieTracker;