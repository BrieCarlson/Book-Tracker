import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const data = await login(formData);

      loginUser(
        data.user,
        data.token,
        rememberMe
      );

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <h1>Log In</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) =>
              setRememberMe(event.target.checked)
            }
          />
          Keep me signed in
        </label>

        <button type="submit">
          Log In
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default Login;