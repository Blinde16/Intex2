import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/Identity.css";
import "@fortawesome/fontawesome-free/css/all.css";
import Footer from "../components/Footer";

function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberme, setRememberme] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();
  location.state?.mode || "login";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      setRememberme(checked);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const loginUrl = rememberme
      ? "https://cineniche-intex2-410-dmage4djbadjbvbw.eastus-01.azurewebsites.net/login?useCookies=true"
      : "https://cineniche-intex2-410-dmage4djbadjbvbw.eastus-01.azurewebsites.net/login?useSessionCookies=true";

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const contentLength = response.headers.get("content-length");
      let data = null;
      if (contentLength && parseInt(contentLength, 10) > 0) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data?.message || "Invalid email or password.");
      }

      navigate("/movie");
    } catch (error: any) {
      setError(error.message || "Error logging in.");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="flex items-center justify-center py-12 flex-1">
        <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-xl p-8 w-full max-w-md border border-white/10">
          <h2 className="text-center text-3xl font-extrabold text-white mb-6">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
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

            <div>
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

            <div className="flex items-center text-sm text-gray-400">
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#7e22ce] to-[#a855f7] text-white py-3 rounded-md hover:from-[#9333ea] hover:to-[#a855f7] transition shadow-lg"
            >
              Sign in
            </button>
          </form>

          <div className="my-6 border-t border-gray-700"></div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center bg-purple-800/30 text-white py-3 rounded-md hover:bg-purple-800/50 transition"
            >
              <i className="fa-brands fa-google me-2"></i> Sign in with Google
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center bg-purple-800/30 text-white py-3 rounded-md hover:bg-purple-800/50 transition"
            >
              <i className="fa-brands fa-facebook-f me-2"></i> Sign in with Facebook
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LoginPage;

