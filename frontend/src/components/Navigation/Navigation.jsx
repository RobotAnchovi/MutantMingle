// import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { Link } from "react-router-dom";
import cyclopsLogo from "../../../public/cyclopsLogo.png";
import "./Navigation.css";

// function Navigation({ isLoaded }) {
//   const sessionUser = useSelector((state) => state.session.user);

//   const sessionLinks = sessionUser ? (
//     <li>
//       <ProfileButton user={sessionUser} />
//     </li>
//   ) : (
//     <>
//       <li>
//         <OpenModalButton
//           buttonText="Enter your Faction"
//           modalComponent={<LoginFormModal />}
//         />
//         {/* <NavLink to="/login">Log In</NavLink> */}
//       </li>
//       <li>
//         <OpenModalButton
//           buttonText="Enlist Today!"
//           modalComponent={<SignupFormModal />}
//         />
//         {/* <NavLink to="/signup">Sign Up</NavLink> */}
//       </li>
//     </>
//   );

//   return (
//     <ul>
//       <li>
//         <NavLink to="/">Home</NavLink>
//       </li>
//       {isLoaded && sessionLinks}
//     </ul>
//   );
// }

// export default Navigation;

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  return (
    <nav>
      <div className="nav-bar-logo">
        <Link to="/">
          <img id="logo" src={cyclopsLogo} alt="Home" />
          <span className="logo-text">MutantMingle</span>
        </Link>
      </div>

      {sessionUser ? (
        <div className="nav-bar-user-links">
          <Link to={"/groups/new"} className="link">
            Start a new faction!
          </Link>
          <ProfileButton user={sessionUser} />
        </div>
      ) : (
        <div className="nav-bar-no-user">
          <OpenModalButton
            buttonText="Enter your Portal"
            modalComponent={<LoginFormModal />}
          />
          <OpenModalButton
            buttonText="Enlist Today!"
            modalComponent={<SignupFormModal />}
          />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
