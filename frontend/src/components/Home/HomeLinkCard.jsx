import { Link } from "react-router-dom";
import "./HomeLinkCard.css";

export const HomeLinkCard = ({
  activeLink,
  image,
  alt,
  path,
  linkText,
  pLinkText,
}) => {
  return (
    <Link to={path} className={activeLink}>
      <div className="home-link-card">
        <img className="home-link-img" src={image} alt={alt}></img>
        <h4 className={`home-link ${activeLink}`}>{linkText}</h4>
        <p>{pLinkText}</p>
      </div>
    </Link>
  );
};
