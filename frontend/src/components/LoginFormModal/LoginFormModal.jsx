import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors("");
    dispatch(sessionActions.login({ credential, password }))
      .then((response) => {
        if (response.ok) {
          closeModal();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data && data.errors) {
          setErrors(data.errors);
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setErrors("INVALID CREDENTIALS: Are you a spy?");
      });
  };

  const demoLogin = (e) => {
    e.preventDefault();
    setErrors("");

    dispatch(
      sessionActions.login({ credential: "demo@user.io", password: "password" })
    )
      .then((response) => {
        if (response.ok) {
          closeModal();
        } else {
          return response.json();
        }
      })
      .then((data) => {
        if (data && data.errors) {
          setErrors(data.errors);
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setErrors("An unexpected error occurred.");
      });
  };

  const buttonStatus = credential.length < 4 || password.length < 6;

  return (
    <div className="log-in">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        {errors && <p className="error">{errors}</p>}
        <label htmlFor="credential">Username or Email</label>
        <input
          type="text"
          name="credential"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="button" type="submit" disabled={buttonStatus}>
          Log In
        </button>
      </form>

      <form onSubmit={demoLogin}>
        <button className="demo" type="submit">
          Infiltrate a Faction (Demo)
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
