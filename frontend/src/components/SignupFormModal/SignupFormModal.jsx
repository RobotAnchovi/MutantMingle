import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const disableLogin =
    email.length === 0 ||
    username.length < 4 ||
    firstName.length === 0 ||
    lastName.length === 0 ||
    password.length < 6 ||
    confirmPassword.length === 0; // true or false based on required fields

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
      return;
    }

    try {
      await dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      );
      closeModal();
    } catch (error) {
      // Check if the error object has the 'errors' field and update state
      if (error && error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({
          general: "An error occurred during signup. Please try again.",
        });
      }
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label className="pop-up-label">
          Email
          <input
            type="text"
            className="pop-up-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {/* {errors.email && <p>{errors.email}</p>} */}
        <label className="pop-up-label">
          Username
          <input
            type="text"
            className="pop-up-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {/* {errors.username && <p>{errors.username}</p>} */}
        <label className="pop-up-label">
          First Name
          <input
            type="text"
            className="pop-up-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {/* {errors.firstName && <p>{errors.firstName}</p>} */}
        <label className="pop-up-label">
          Last Name
          <input
            type="text"
            className="pop-up-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {/* {errors.lastName && <p>{errors.lastName}</p>} */}
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
        {/* {errors.password && <p>{errors.password}</p>} */}
        <label className="pop-up-label">
          Confirm Password
          <input
            type="password"
            className="pop-up-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {/* {errors.confirmPassword && <p>{errors.confirmPassword}</p>} */}
        {Object.values(errors).map((error, idx) => (
          <div key={idx} className="error">
            {error}
          </div>
        ))}
        <button type="submit" disabled={disableLogin} className="main-button-1">
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
