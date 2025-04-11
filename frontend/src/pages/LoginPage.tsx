import { useState } from "react"; // ✅ Import React hook for state management
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Import hooks for navigation and accessing route location state
import "./css/Identity.css"; // ✅ Import page-specific styles
import "@fortawesome/fontawesome-free/css/all.css"; // ✅ Import FontAwesome icons (if used in the future)

function LoginPage() {
  // ✅ State variables for form fields and error handling
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberme, setRememberme] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const apiUrl = import.meta.env.VITE_API_URL; // ✅ Get API base URL from environment variables
  const navigate = useNavigate(); // ✅ Hook to navigate between routes
  const location = useLocation(); // ✅ Hook to access location state
  location.state?.mode || "login"; // ✅ Determine mode from location state (not currently used)

  // ✅ Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      setRememberme(checked); // ✅ Update remember me checkbox state
    } else if (name === "email") {
      setEmail(value); // ✅ Update email field state
    } else if (name === "password") {
      setPassword(value); // ✅ Update password field state
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ✅ Prevent default form submission behavior
    setError(""); // ✅ Reset error state

    if (!email || !password) {
      setError("Please fill in all fields."); // ✅ Validate required fields
      return;
    }

    // ✅ Determine login URL based on remember me option
    const loginUrl = rememberme
      ? `${apiUrl}/login?useCookies=true`
      : `${apiUrl}/login?useSessionCookies=true`;

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        credentials: "include", // ✅ Include cookies in request
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // ✅ Send email and password in request body
      });

      const contentLength = response.headers.get("content-length"); // ✅ Check if response has content
      let data = null;
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json(); // ✅ Parse response JSON if content exists
      }

      if (!response.ok) {
        throw new Error(data?.message || "Invalid email or password."); // ✅ Handle unsuccessful response
      }

      navigate("/movie"); // ✅ Redirect to movies page on successful login
    } catch (error: any) {
      setError(error.message || "Error logging in."); // ✅ Set error message
    }
  };

  return (
    <div className="login-page-wrapper"> {/* ✅ Main container for login page */}
      <div className="flex items-center justify-center py-12 flex-1"> {/* ✅ Centered flex container */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-xl p-8 w-full max-w-md border border-white/10"> {/* ✅ Form container with glassmorphism effect */}
          <h2 className="text-center text-3xl font-extrabold text-white mb-6"> {/* ✅ Page title */}
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5"> {/* ✅ Login form */}
            <div> {/* ✅ Email input field */}
              <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={handleChange}
                className="w-full rounded-md bg-white/10 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent py-3 px-4 transition"
                placeholder="you@example.com"
              />
            </div>

            <div> {/* ✅ Password input field */}
              <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={handleChange}
                className="w-full rounded-md bg-white/10 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent py-3 px-4 transition"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center text-sm text-gray-400"> {/* ✅ Remember me checkbox */}
              <input
                id="rememberme"
                name="rememberme"
                type="checkbox"
                checked={rememberme}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberme" className="ml-2">
                Remember password
              </label>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>} {/* ✅ Display error message if any */}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#7e22ce] to-[#a855f7] text-white py-3 rounded-md hover:from-[#9333ea] hover:to-[#a855f7] transition shadow-lg"
            >
              Sign in
            </button>
          </form>

          <div className="my-6 border-t border-gray-700"></div> {/* ✅ Separator line */}

          <div className="space-y-3"></div> {/* ✅ Placeholder for additional content (optional) */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage; // ✅ Export the component for routing and use in the app
