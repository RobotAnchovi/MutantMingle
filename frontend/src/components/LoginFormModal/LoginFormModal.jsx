import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkLoadGroups } from "../../store/groups";
import { thunkLoadEvents } from "../../store/events";
import * as sessionActions from "../../store/session";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const { closeModal } = useModal();

  const isButtonDisabled =
    credential.length <= 4 && password.length <= 6 ? "" : "disabled";

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors("");
    return dispatch(sessionActions.thunkLoginUser({ credential, password }))
      .then(() => {
        closeModal();
        dispatch(thunkLoadGroups());
        dispatch(thunkLoadEvents());
        dispatch(sessionActions.thunkLoadUserGroups());
      })
      .catch((error) => {
        if (error && error.message) {
          setErrors(error.message);
        } else {
          setErrors("An error occurred. Please try again.");
        }
      });
  };
  //     .catch(async (res) => {
  //       const data = await res.json();
  //       console.log("data:", data);
  //       if (data && data.message) {
  //         setErrors(data.message);
  //       }
  //     });
  // };

  const demoLogin = (e) => {
    e.preventDefault();

    setErrors("");
    return dispatch(
      sessionActions.thunkLoginUser({
        credential: "Demo-lition",
        password: "password",
      })
    )
      .then(() => {
        closeModal();
        dispatch(thunkLoadGroups());
        dispatch(thunkLoadEvents());
        dispatch(sessionActions.thunkLoadUserGroups());
      })
      .catch(async (res) => {
        const data = await res.json();
        console.log("data:", data);
        if (data && data.message) {
          setErrors(data.message);
        }
      });
  };

  return (
    <div className="log-in">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        {errors && (
          <p className="error">PERMISSION DENIED: INVALID CREDENTIALS</p>
        )}
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
        <button type="submit" disabled={isButtonDisabled} className="button">
          Enter Your Portal (Log In)
        </button>
      </form>

      <form onSubmit={demoLogin}>
        <button className="demo">Infiltrate a Faction! (Demo)</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
