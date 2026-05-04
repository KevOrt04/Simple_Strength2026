import { useState } from "react";
import { EXERCISES } from "./exercises";
import "./WorkoutCreator.css";
import BackButton from "./BackButton";

const MUSCLE_GROUPS = [
  { id: "chest", label: "Chest" },
  { id: "back", label: "Back" },
  { id: "biceps", label: "Biceps" },
  { id: "triceps", label: "Triceps" },
  { id: "shoulders", label: "Shoulders" },
  { id: "legs", label: "Legs" },
  { id: "core", label: "Core" },
];

function WorkoutCreator() {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleGroup = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((g) => g !== groupId)
        : [...prev, groupId]
    );
    setGenerated(false);
    setExercises([]);
  };

  const generateWorkout = () => {
    if (selectedGroups.length === 0) return;
    const result = selectedGroups.flatMap((group) => EXERCISES[group] || []);
    const unique = result.filter(
      (ex, idx, self) => self.findIndex((e) => e.id === ex.id) === idx
    );
    setExercises(unique);
    setGenerated(true);
    setExpandedCard(null);
  };

  const selectedLabels = selectedGroups
    .map((g) => MUSCLE_GROUPS.find((m) => m.id === g)?.label)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="wc-container">
       <BackButton />
      <h2 className="wc-title">🏋️ Workout Creator</h2>
      <p className="wc-subtitle">Select the muscle groups you want to train today</p>

      {/* Muscle Group Selection */}
      <div className="wc-muscle-grid">
        {MUSCLE_GROUPS.map(({ id, label }) => (
          <button
            key={id}
            className={`wc-muscle-btn${selectedGroups.includes(id) ? " selected" : ""}`}
            onClick={() => toggleGroup(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Generate Button */}
      <button
        className="wc-generate-btn"
        onClick={generateWorkout}
        disabled={selectedGroups.length === 0}
      >
        Generate Workout
      </button>

      {/* Results */}
      {generated && exercises.length > 0 && (
        <div className="wc-results">
          <div className="wc-results-header">
            <h3 className="wc-results-title">
              {exercises.length} exercise{exercises.length !== 1 ? "s" : ""} for{" "}
              <span className="wc-highlight">{selectedLabels}</span>
            </h3>
          </div>

          <div className="wc-exercises-grid">
            {exercises.map((exercise) => {
              const isExpanded = expandedCard === exercise.id;
              return (
                <div key={exercise.id} className="wc-exercise-card">
                  <img
                    src={exercise.image}
                    alt={exercise.name}
                    className="wc-exercise-img"
                    onError={(e) => {
                      e.target.src = "https://picsum.photos/seed/fitness/400/250";
                    }}
                  />
                  <div className="wc-exercise-body">
                    <h4 className="wc-exercise-name">{exercise.name}</h4>
                    <div className="wc-muscles-tags">
                      {exercise.muscles.map((m) => (
                        <span key={m} className="wc-muscle-tag">
                          {m}
                        </span>
                      ))}
                    </div>
                    <p className="wc-exercise-desc">{exercise.description}</p>

                    <button
                      className="wc-toggle-btn"
                      onClick={() =>
                        setExpandedCard(isExpanded ? null : exercise.id)
                      }
                    >
                      {isExpanded ? "Hide Variations" : "Show Variations"}
                    </button>

                    {isExpanded && (
                      <div className="wc-variations">
                        <div className="wc-variation-section">
                          <h5 className="wc-variation-heading">Gym Variations</h5>
                          <ul className="wc-variation-list">
                            {exercise.gymVariations.map((v) => (
                              <li key={v}>{v}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="wc-variation-section">
                          <h5 className="wc-variation-heading">Bodyweight Variations</h5>
                          <ul className="wc-variation-list">
                            {exercise.bodyweightVariations?.map((v) => (
                              <li key={v}>{v}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {generated && exercises.length === 0 && (
        <p className="wc-empty">No exercises found for the selected muscle groups.</p>
      )}
    </div>
  );
}

export default WorkoutCreator;
