import { useState } from "react"; // ✅ React hook for state management
import { useNavigate } from "react-router-dom"; // ✅ Hook for navigation between routes
import "./css/Identity.css"; // ✅ Styles specific to identity pages (register/login)

function RegisterPage() {
  // ✅ State variables for form inputs and error handling
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL; // ✅ API base URL from environment variables
  const navigate = useNavigate(); // ✅ Navigation function to programmatically change routes

  // ✅ Function to handle form submission for registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ Prevent default form submission behavior

    // ✅ Validate that all fields are filled
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // ✅ Check if passwords match
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
        credentials: "include", // ✅ Include cookies in request for authentication
        body: JSON.stringify({
          email,
          password,
          force2FA: true, // ✅ Optional flag to force two-factor authentication
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData?.message || "Registration failed."); // ✅ Show error message from response
        return;
      }

      navigate("/login", { state: { email } }); // ✅ Navigate to login page after successful registration
    } catch (err) {
      console.error("Register failed:", err);
      setError("Registration error."); // ✅ Set error state on catch
    }
  };

  return (
    <div className="register-page-wrapper"> {/* ✅ Wrapper for the entire registration page */}
      <div className="flex items-center justify-center py-12 flex-1"> {/* ✅ Centered flex container */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-xl p-8 w-full max-w-md border border-white/10"> {/* ✅ Form container with glassmorphism effect */}
          <h2 className="text-center text-3xl font-extrabold text-white mb-6"> {/* ✅ Page title */}
            Register
          </h2>

          <form onSubmit={handleRegister} className="space-y-5"> {/* ✅ Registration form */}
            {error && <div className="text-red-500 text-sm">{error}</div>} {/* ✅ Error message display */}

            <div> {/* ✅ Email input field */}
              <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
                Email address
              </label>
              <input
                className="w-full rounded-md bg-white/10 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent py-3 px-4 transition"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // ✅ Update email state
              />
            </div>

            <div> {/* ✅ Password input field */}
              <p>Password must be 12 characters and have 1 capital</p> {/* ✅ Password requirement note */}
              <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
                Password
              </label>
              <input
                className="w-full rounded-md bg-white/10 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent py-3 px-4 transition"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // ✅ Update password state
              />
            </div>

            <div> {/* ✅ Confirm password input field */}
              <label htmlFor="confirmPassword" className="block text-sm text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                className="w-full rounded-md bg-white/10 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent py-3 px-4 transition"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} // ✅ Update confirm password state
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#7e22ce] to-[#a855f7] text-white py-3 rounded-md hover:from-[#9333ea] hover:to-[#a855f7] transition shadow-lg"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-400 text-center"> {/* ✅ Link to login page if user already has an account */}
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

export default RegisterPage; // ✅ Export component for use in routing