import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">
      <h1>Book Tracker</h1>

      <p>
        Track every book you've read, your thoughts,
        and your reading goals.
      </p>

      <div>
        <Link to="/login">
          <button>Log In</button>
        </Link>

        <Link to="/register">
          <button>Create Account</button>
        </Link>
      </div>
    </div>
  );
}

export default Landing;