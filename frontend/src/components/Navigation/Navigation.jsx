import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import ProfileButton from "./ProfileButton";
import { Link } from "react-router-dom";
import "./Navigation.css";
import cyclopsLogo from "/cyclopsLogo.png";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  return (
    <nav>
      <div className="nav-bar-logo">
        <Link to="/">
          <img id="logo" src={cyclopsLogo} alt="Pic" />
        </Link>
      </div>

      {sessionUser ? (
        <div className="nav-bar-user-links">
          <Link to={"/groups/new"} className="link">
            Start a new Faction!
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
