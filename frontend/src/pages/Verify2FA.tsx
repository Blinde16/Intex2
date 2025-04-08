import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Verify2FA() {
  const { state } = useLocation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const email = state?.email;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !code) {
      setError("Missing email or code.");
      return;
    }

    try {
      const response = await fetch(
        "https://localhost:5000/register/verify-2fa",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Invalid 2FA code.");
        return;
      }

      navigate("/movie");
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Verify 2FA</h2>
        <p>A code was sent to your email.</p>
        <input
          type="text"
          placeholder="Enter 2FA code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">Verify</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Verify2FA;
