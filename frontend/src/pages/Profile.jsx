import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  changePassword,
  requestEmailChange,
  updateProfile,
} from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import "./Profile.css";

function Profile() {
  const {
    user,
    updateUser,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [profileError, setProfileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleNameSubmit(event) {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");

    try {
      const data = await updateProfile({
        name,
      });

      updateUser(data.user);
      setProfileMessage("Name updated successfully.");
    } catch (error) {
      setProfileError(error.message);
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();

    setEmailMessage("");
    setEmailError("");

    try {
      const data = await requestEmailChange({
        newEmail,
        currentPassword: emailPassword,
      });

      setEmailMessage(data.message);
      setNewEmail("");
      setEmailPassword("");
    } catch (error) {
      setEmailError(error.message);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "The new password confirmation does not match."
      );
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      logout();

      navigate("/login", {
        state: {
          message:
            "Password changed successfully. Please sign in again.",
        },
      });
    } catch (error) {
      setPasswordError(error.message);
    }
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <section className="profile-card">
        <h2>Personal information</h2>

        <form onSubmit={handleNameSubmit}>
          <label htmlFor="profile-name">Name</label>

          <input
            id="profile-name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={2}
            maxLength={80}
            required
          />

          {profileError && (
            <p className="form-error">{profileError}</p>
          )}

          {profileMessage && (
            <p className="form-success">{profileMessage}</p>
          )}

          <button type="submit">
            Save name
          </button>
        </form>
      </section>

      <section className="profile-card">
        <h2>Email address</h2>

        <p>
          Current email: <strong>{user.email}</strong>
        </p>

        <p>
          Your current email will remain active until the new
          address is confirmed.
        </p>

        <form onSubmit={handleEmailSubmit}>
          <label htmlFor="new-email">New email address</label>

          <input
            id="new-email"
            name="newEmail"
            type="email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="email-current-password">
            Current password
          </label>

          <input
            id="email-current-password"
            name="currentPassword"
            type="password"
            value={emailPassword}
            onChange={(event) =>
              setEmailPassword(event.target.value)
            }
            autoComplete="current-password"
            required
          />

          {emailError && (
            <p className="form-error">{emailError}</p>
          )}

          {emailMessage && (
            <p className="form-success">{emailMessage}</p>
          )}

          <button type="submit">
            Send confirmation email
          </button>
        </form>
      </section>

      <section className="profile-card">
        <h2>Change password</h2>

        <form onSubmit={handlePasswordSubmit}>
          <label htmlFor="current-password">
            Current password
          </label>

          <input
            id="current-password"
            name="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(event) =>
              setCurrentPassword(event.target.value)
            }
            autoComplete="current-password"
            required
          />

          <label htmlFor="new-password">
            New password
          </label>

          <input
            id="new-password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(event) =>
              setNewPassword(event.target.value)
            }
            minLength={12}
            autoComplete="new-password"
            required
          />

          <label htmlFor="confirm-password">
            Confirm new password
          </label>

          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            minLength={12}
            autoComplete="new-password"
            required
          />

          {passwordError && (
            <p className="form-error">{passwordError}</p>
          )}

          {passwordMessage && (
            <p className="form-success">{passwordMessage}</p>
          )}

          <button type="submit">
            Change password
          </button>
        </form>
      </section>

      <button
        className="logout-button"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Log out
      </button>
    </div>
  );
}

export default Profile;