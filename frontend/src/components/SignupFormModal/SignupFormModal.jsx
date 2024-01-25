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

  // const disableLogin =
  //   email.length === 0 ||
  //   username.length < 4 ||
  //   firstName.length === 0 ||
  //   lastName.length === 0 ||
  //   password.length < 6 ||
  //   confirmPassword.length === 0; // true or false based on required fields

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Ummm...that doesn't look like an email address.";
    }
    if (username.length < 4)
      newErrors.username =
        "Username must be at least 4 characters. Sorry, Zod.";
    if (firstName.length < 2 || !/[a-zA-Z]/.test(firstName)) {
      newErrors.firstName =
        "First Name is required, but promise we won't tell.";
    }
    if (lastName.length < 2 || !/[a-zA-Z]/.test(lastName)) {
      newErrors.lastName = "Last Name is required, but promise we won't tell.";
    }
    if (password.length < 6)
      newErrors.password =
        "Passwords deserve more effort than that. Let's go for more than 6 characters.";
    if (password !== confirmPassword)
      newErrors.confirmPassword =
        "Can't save the world if your passwords don't match!";

    setErrors(newErrors); // Set errors immediately
    console.log("Error State:", newErrors);
    if (Object.keys(newErrors).length === 0) {
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch((error) => {
          // Assuming the error thrown by your thunk action is an object
          if (error && error.errors) {
            setErrors(error.errors);
          } else {
            // Fallback for other types of errors
            setErrors({
              general: "An error occurred during signup. Please try again.",
            });
          }
        });
    }
  };
  //       .catch(async (res) => {
  //         const data = await res.json();
  //         if (data?.errors) setErrors(data.errors);
  //       });
  //   }
  // };

  return (
    <>
      <h1>The World Needs You!</h1>
      <form onSubmit={handleSubmit}>
        <label className="pop-up-label">
          Email
          <input
            type="text"
            className="pop-up-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Ex. spiderman@marvel.io"
          />
        </label>
        {errors.email && <p className="error">{errors.email}</p>}
        <label className="pop-up-label">
          Username
          <input
            type="text"
            className="pop-up-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Ex. Spidey-Tingles62"
          />
        </label>
        {errors.username && <p className="error">{errors.username}</p>}
        <label className="pop-up-label">
          First Name
          <input
            type="text"
            className="pop-up-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="Ex. Peter"
          />
        </label>
        {errors.firstName && <p className="error">{errors.firstName}</p>}
        <label className="pop-up-label">
          Last Name
          <input
            type="text"
            className="pop-up-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Ex. Parker"
          />
        </label>
        {errors.lastName && <p className="error">{errors.lastName}</p>}
        <label className="pop-up-label">
          Password
          <input
            type="password"
            className="pop-up-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Ex. DocOckStinks123"
          />
        </label>
        {errors.password && <p className="error">{errors.password}</p>}
        <label className="pop-up-label">
          Confirm Password
          <input
            type="password"
            className="pop-up-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Do the same thing you did above"
          />
        </label>
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}
        {/* {Object.values(errors).map((error, idx) => (
          <div key={idx} className="error">
            {error}
          </div>
        ))} */}
        <button
          type="submit"
          // disabled={disableLogin}
          className="pop-up-submit-button"
        >
          Enlist!
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
