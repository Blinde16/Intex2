import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddUserPage() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("AuthenticatedCustomer");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState<number>(0);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        age,
        gender,
        city,
        state,
        zip,
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
      const msg = await res.text();
      setError(msg || "Failed to create user.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="AuthenticatedCustomer">AuthenticatedCustomer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Name</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Age</label>
          <input className="form-control" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} required />
        </div>
        <div className="mb-3">
          <label>Gender</label>
          <input className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>City</label>
          <input className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>State</label>
          <input className="form-control" value={state} onChange={(e) => setState(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Zip</label>
          <input className="form-control" type="number" value={zip} onChange={(e) => setZip(Number(e.target.value))} required />
        </div>

        <div className="mb-3">
          <label>Streaming Services (1 = Yes, 0 = No)</label>
          <div>
            <input type="checkbox" checked={netflix === 1} onChange={() => setNetflix(netflix === 1 ? 0 : 1)} /> Netflix
          </div>
          <div>
            <input type="checkbox" checked={amazonPrime === 1} onChange={() => setAmazonPrime(amazonPrime === 1 ? 0 : 1)} /> Amazon Prime
          </div>
          <div>
            <input type="checkbox" checked={disney === 1} onChange={() => setDisney(disney === 1 ? 0 : 1)} /> Disney
          </div>
          <div>
            <input type="checkbox" checked={paramount === 1} onChange={() => setParamount(paramount === 1 ? 0 : 1)} /> Paramount
          </div>
          <div>
            <input type="checkbox" checked={max === 1} onChange={() => setMax(max === 1 ? 0 : 1)} /> Max
          </div>
          <div>
            <input type="checkbox" checked={hulu === 1} onChange={() => setHulu(hulu === 1 ? 0 : 1)} /> Hulu
          </div>
          <div>
            <input type="checkbox" checked={appleTV === 1} onChange={() => setAppleTV(appleTV === 1 ? 0 : 1)} /> Apple TV
          </div>
          <div>
            <input type="checkbox" checked={peacock === 1} onChange={() => setPeacock(peacock === 1 ? 0 : 1)} /> Peacock
          </div>
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button className="btn btn-primary me-2" type="submit">Create</button>
        <button className="btn btn-secondary" onClick={() => navigate("/admin/users")}>Cancel</button>
      </form>
    </div>
  );
}

export default AddUserPage;
