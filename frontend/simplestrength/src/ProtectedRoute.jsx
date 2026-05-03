import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          credentials: "include"
        });

        const data = await res.json();

        if (!data.authenticated) {
          navigate("/login");
        } else {
          setLoading(false);
        }
      } catch {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  return children;
}

export default ProtectedRoute;