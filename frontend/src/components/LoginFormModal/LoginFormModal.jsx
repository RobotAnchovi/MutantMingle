import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const disableLogin = credential.length < 4 || password.length < 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    //^ Dispatch the login action directly with demo credentials
    const response = await dispatch(
      sessionActions.login({ credential: "demo@user.io", password: "password" })
    );
    if (response.ok) {
      closeModal();
    } else {
      const data = await response.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  return (
    <div>
      <h1>Enter your Faction</h1>
      <form onSubmit={handleSubmit}>
        {Object.values(errors).map((error, idx) => (
          <div key={idx} className="error">
            {error}
          </div>
        ))}
        <label className="pop-up-label">
          Username or Email
          <input
            type="text"
            className="pop-up-input"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className="pop-up-label">
          Password
          <input
            type="password"
            className="pop-up-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {/* {errors.credential && <p>{errors.credential}</p>} */}
        <button
          type="submit"
          disabled={disableLogin}
          className="pop-up-submit-button"
        >
          Enter your Faction
        </button>
        <button onClick={handleDemoLogin} className="pop-up-demo-button">
          Infiltrate a Faction (Demo){" "}
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
