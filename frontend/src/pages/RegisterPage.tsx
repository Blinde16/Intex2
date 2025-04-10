import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Identity.css";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ⚠️ IMPORTANT for cookies
        body: JSON.stringify({
          email,
          password,
          force2FA: true, // optional, but useful if needed
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData?.message || "Registration failed.");
        return;
      }

      navigate("/login", { state: { email } });
    } catch (err) {
      console.error("Register failed:", err);
      setError("Registration error.");
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="flex items-center justify-center py-12 flex-1">
        <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-xl p-8 w-full max-w-md border border-white/10">
          <h2 className="text-center text-3xl font-extrabold text-white mb-6">
            Register
          </h2>

          <form onSubmit={handleRegister} className="space-y-5">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div>
              <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
                Email address
              </label>
              <input
                className="w-full rounded-md bg-white/10 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent py-3 px-4 transition"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
                Password
              </label>
              <input
                className="w-full rounded-md bg-white/10 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent py-3 px-4 transition"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                className="w-full rounded-md bg-white/10 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent py-3 px-4 transition"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#7e22ce] to-[#a855f7] text-white py-3 rounded-md hover:from-[#9333ea] hover:to-[#a855f7] transition shadow-lg"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-400 text-center">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-purple-400 hover:text-purple-300 transition"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;