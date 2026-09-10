import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";
import { confirmEmailChange } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import "./Profile.css";

function ConfirmEmailChange() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const {
    isLoggedIn,
    logout,
  } = useAuth();

  const hasRun = useRef(false);

  const [message, setMessage] = useState(
    token ? "Confirming your new email address..." : ""
  );

  const [error, setError] = useState("");

  useEffect(() => {
    if (hasRun.current || !token) {
      return;
    }

    hasRun.current = true;

    window.history.replaceState(
      null,
      "",
      window.location.pathname
    );

    let cancelled = false;

    confirmEmailChange(token)
      .then((data) => {
        if (cancelled) {
          return;
        }

        if (isLoggedIn) {
          logout();
        }

        setMessage(data.message);
      })
      .catch((requestError) => {
        if (cancelled) {
          return;
        }

        setMessage("");
        setError(requestError.message);
      });

    return () => {
      cancelled = true;
    };
  }, [token, isLoggedIn, logout]);

  return (
    <div className="profile-card">
      <h1>Email confirmation</h1>

      {!token && (
        <p className="form-error">
          This confirmation link is missing a token.
        </p>
      )}

      {message && (
        <p className="form-success">{message}</p>
      )}

      {error && (
        <p className="form-error">{error}</p>
      )}

      <p>
        <Link to="/login">Go to login</Link>
      </p>
    </div>
  );
}

export default ConfirmEmailChange;