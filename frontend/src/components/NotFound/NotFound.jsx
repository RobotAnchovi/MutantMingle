import { useRouteError } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  let error = useRouteError();

  return (
    <div className="not-found-container">
      <div className="not-found">
        <h1>{error.status}</h1>
        <h2>Web Slinging Mishap!</h2>
        <h3>Oops! This Page Seems to Have Swung Away</h3>
        <p>
          Don&apos;t worry, it&apos;s not your Spidey senses failing you.
          Sometimes even superheroes take a wrong turn. Let&apos;s get you back
          on track!
        </p>
      </div>
    </div>
  );
}

export default NotFound;
