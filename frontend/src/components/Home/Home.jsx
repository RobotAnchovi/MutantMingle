import "./Home.css";
import { HomeLinkCard } from "./HomeLinkCard";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import { useSelector } from "react-redux";
import landingImage from "/landing-page.png";

const Home = () => {
  const user = useSelector((state) => state.session.user);

  const activeLink = user ? "" : "disabled";

  return (
    <div className="content">
      <div className="landing">
        <div className="landing-info">
          <h1>Welcome to MutantMingle - Where Mutants can Mingle!</h1>
          <p>
            Whether you&apos;re a hero or villain, join forces with others who
            share your super interests! From bank robberies with villains to
            book club discussions with the X-Men, discover Factions of every
            kind. Join the adventure and create your own story in our world of
            MutantMingle.
          </p>
        </div>
        <div className="landing-img">
          <img src={landingImage} alt="Heroes gathered in the city streets." />
        </div>
      </div>
      <div className="lower-landing">
        <div className="how-works">
          <h2>How MutantMingle works</h2>
          <p>
            Embark on quests, join Factions, and partake in epic Campaigns.
            Whether you&apos;re rallying for a cause or sharing your
            extraordinary skills, there&apos;s a place for every unique talent
            and interest in our world of marvels and mysteries.
          </p>
        </div>
        <div className="cards">
          <HomeLinkCard
            image={"#"}
            alt={"Insert Pic"}
            path={`groups`}
            linkText={`See all Factions`}
          />
          <HomeLinkCard
            image={"#"}
            alt={"Insert Pic"}
            path={`events`}
            linkText={`Find a Campaign`}
          />
          <HomeLinkCard
            activeLink={activeLink}
            image={"#"}
            alt={"Insert Pic"}
            path={`groups/new`}
            linkText={`Start a new Faction`}
          />
        </div>
      </div>
      {!user && (
        <div className="home-join-btn-div">
          <OpenModalButton
            buttonText="Join MutantMingle"
            modalComponent={<SignupFormModal />}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
