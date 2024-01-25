import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
// import { LoadGroups } from "../../store/groups";
// import { LoadEvents } from "../../store/events";
import * as sessionActions from "../../store/session";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isButtonDisabled = credential.length < 4 || password.length < 6; // true or false based on username or pw length

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

  const demoLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    // login action directly with demo credentials
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setErrors("");
  //   return dispatch(sessionActions.LoginUser({ credential, password }))
  //     .then(() => {
  //       closeModal();
  //       dispatch(LoadGroups());
  //       dispatch(LoadEvents());
  //       dispatch(sessionActions.LoadUserGroups());
  //     })
  //     .catch((error) => {
  //       if (error && error.message) {
  //         setErrors(error.message);
  //       } else {
  //         setErrors("An error occurred. Please try again.");
  //       }
  //     });
  //     .catch(async (res) => {
  //       const data = await res.json();
  //       console.log("data:", data);
  //       if (data && data.message) {
  //         setErrors(data.message);
  //       }
  //     });
  // };

  // const demoLogin = (e) => {
  //   e.preventDefault();
  //   setErrors("");

  //   const response = await dispatch(sessionActions.login({ credential: "demo@user.io", password: "password" }));
  //   if (response.ok) {
  //     closeModal();
  //   } else {
  //     const data = await response.json();
  //     if (data && data.errors) {
  //       setErrors(data.errors);
  //     }
  //   }
  // };

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
