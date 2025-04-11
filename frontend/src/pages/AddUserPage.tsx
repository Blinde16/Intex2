import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthorizeView from "../components/AuthorizeView";
import "../pages/css/UserForm.css";

function AddUserPage() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("AuthenticatedCustomer");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const [netflix, setNetflix] = useState(0);
  const [amazonPrime, setAmazonPrime] = useState(0);
  const [disney, setDisney] = useState(0);
  const [paramount, setParamount] = useState(0);
  const [max, setMax] = useState(0);
  const [hulu, setHulu] = useState(0);
  const [appleTV, setAppleTV] = useState(0);
  const [peacock, setPeacock] = useState(0);

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password || !name || !phone || !age || !gender || !city || !state || !zip) {
      setError("❌ Please fill out all fields.");
      return false;
    }

    if (isNaN(Number(age)) || isNaN(Number(zip))) {
      setError("❌ Age and Zip must be valid numbers.");
      return false;
    }

    if (Number(age) <= 0 || Number(zip) <= 0) {
      setError("❌ Age and Zip must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const res = await fetch(`${apiUrl}/register/users/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
        role,
        name,
        phone,
        age: Number(age),
        gender,
        city,
        state,
        zip: Number(zip),
        netflix,
        amazon_Prime: amazonPrime,
        disney,
        paramount,
        max,
        hulu,
        apple_TV: appleTV,
        peacock,
      }),
    });

    if (res.ok) {
      navigate("/admin/users");
    } else {
      try {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && data[0].description) {
          setError(`❌ ${data[0].description}`);
        } else if (typeof data === "string") {
          setError(`❌ ${data}`);
        } else {
          setError("❌ Failed to create user.");
        }
      } catch {
        const msg = await res.text();
        setError(`❌ ${msg || "Failed to create user."}`);
      }
    }
    
  };

  return (
    <>
      <Header />
      <AuthorizeView>
        <div className="user-form-container">
          <h2 className="form-title">👤 Add New User</h2>
          <form onSubmit={handleSubmit}>

            <div className="form-grid">
              <input
                className="form-control"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="form-control"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="AuthenticatedCustomer">Authenticated Customer</option>
                <option value="Admin">Admin</option>
              </select>
              <input
                className="form-control"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                className="form-control"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                className="form-control"
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/\D/, ""))}
                required
              />
              <select
                className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer Not to Say">Prefer Not to Say</option>
              </select>
              <input
                className="form-control"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <input
                className="form-control"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
              <input
                className="form-control"
                type="number"
                placeholder="Zip"
                value={zip}
                onChange={(e) => setZip(e.target.value.replace(/\D/, ""))}
                required
              />
            </div>

            <h4 className="form-section-title mt-6">📺 Streaming Services</h4>
            <div className="checkbox-group">
              {[
                { label: "Netflix", value: netflix, setter: setNetflix },
                { label: "Amazon Prime", value: amazonPrime, setter: setAmazonPrime },
                { label: "Disney", value: disney, setter: setDisney },
                { label: "Paramount", value: paramount, setter: setParamount },
                { label: "Max", value: max, setter: setMax },
                { label: "Hulu", value: hulu, setter: setHulu },
                { label: "Apple TV", value: appleTV, setter: setAppleTV },
                { label: "Peacock", value: peacock, setter: setPeacock },
              ].map((service) => (
                <label key={service.label} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={service.value === 1}
                    onChange={() => service.setter(service.value === 1 ? 0 : 1)}
                  />
                  {service.label}
                </label>
              ))}
            </div>

            {error && <p className="text-danger">{error}</p>}

            <div className="flex mt-6">
              <button type="submit" className="btn btn-primary">✅ Create</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/admin/users")}>❌ Cancel</button>
            </div>
          </form>
        </div>
      </AuthorizeView>
      <Footer />
    </>
  );
}

export default AddUserPage;
