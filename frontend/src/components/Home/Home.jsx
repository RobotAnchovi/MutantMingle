import "./Home.css";
import { HomeCard } from "./HomeCard";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.session.user);

  const activeLink = user ? "" : "disabled";

  return (
    <div className="content">
      <div className="landing">
        <div className="landing-info">
          <h1>Welcome to MutantMingle - Unite Your Super Powers!</h1>
          <p>
            Whether you are a hero or villain, join forces with others who share
            your super interests! From urban destruction to book club
            discussions, discover Factions of every kind. Join the adventure and
            create your own story in our world of MutantMingle.
          </p>
        </div>
        <div className="landing-img">
          <img src="#" alt="Comic Themed Illustration Placeholder" />
        </div>
      </div>
      <div className="lower-landing">
        <div className="how-it-works">
          <h2>
            Our Superpower is Uniting Heroes and Villains for Epic Campaigns
          </h2>
          <p>
            Embark on quests, join Factions, and partake in epic Campaigns.
            Whether you are rallying for a cause or sharing your extraordinary
            skills, there is a place for every unique talent and interest in our
            world of marvels and mysteries. (Unless you are from the DC
            universe)
          </p>
        </div>
        <div className="cards">
          <HomeCard
            image={"#"}
            alt={"placeholder for Faction Img"}
            path={`groups`}
            linkText={`Discover Factions`}
          />
          <HomeCard
            image={"#"}
            alt={"placeholder for Campaign Img"}
            path={`events`}
            linkText={`Discover Campaigns`}
          />
          <HomeCard
            activeLink={activeLink}
            image={"#"}
            alt={"Placeholder for Create Faction Img"}
            path={`groups/new`}
            linkText={`Create Your Own Faction`}
          />
        </div>
      </div>
      {!user && (
        <div className="home-join-btn-div">
          <OpenModalButton
            buttonText="Pursue Your Destiny: Join MutantMingle"
            modalComponent={<SignupFormModal />}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
