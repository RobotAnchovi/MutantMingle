import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton-bonus";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="navigation-container">
      <ul className="nav-list">
        <li>
          <NavLink to="/">
            <img src={"#"} alt="Offline" />
          </NavLink>
        </li>
      </ul>
      <ul className="nav-list">
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navigation;
