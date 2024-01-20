import { Link } from "react-router-dom";
import "./HomeCard.css";

export const HomeCard = ({
  activeLink,
  image,
  alt,
  path,
  linkText,
  description,
}) => {
  return (
    <Link to={path} className={activeLink}>
      <div className="home-card">
        <img className="home-card-img" src={image} alt={alt}></img>
        <h4 className={`home-link ${activeLink}`}>{linkText}</h4>
        <p>{description}</p>
      </div>
    </Link>
  );
};
