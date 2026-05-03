import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
  onClick={() => navigate("/home")}
  style={{
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "#28a745",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600"
  }}
>
  ← Back
</button>
  );
}

export default BackButton;