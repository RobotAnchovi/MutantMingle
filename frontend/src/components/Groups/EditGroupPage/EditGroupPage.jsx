import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { thunkUpdateGroup } from "../../../store/groups";
import "./EditGroupPage.css";
import { useSelector } from "react-redux";

const EditGroupPage = () => {
  const location = useLocation();

  const {
    groupId,
    groupName,
    groupCity,
    groupState,
    groupAbout,
    groupType,
    groupPrivate,
    userId,
  } = location.state;
  console.log("🚀 ~ EditGroupPage ~ location.state:", location.state);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session?.user);
  console.log("🚀 ~ EditGroupPage ~ user:", user);

  if (user === null || userId !== user.id) {
    navigate("/");
  }

  const [city, setCity] = useState(groupCity);
  const [state, setState] = useState(groupState);
  const [name, setName] = useState(groupName);
  const [about, setAbout] = useState(groupAbout);
  const [type, setType] = useState(groupType);
  const [privacy, setPrivacy] = useState(groupPrivate ? "true" : "false");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (user === null) {
      navigate("/");
      setCity("");
      setState("");
      setName("");
      setAbout("");
      setType("");
      setPrivacy("");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!city) errors.city = "Spider-Sense tingling! City is required.";
    if (!state) errors.state = "State initials, like SH, are required.";
    if (state.length !== 2)
      errors.state =
        "Wakanda Forever! State initials must be 2 characters long.";
    if (!name) errors.name = "Avengers, assemble! A group name is required.";
    if (about.length < 30)
      errors.about =
        "Doctor Strange says it must be at least 30 characters long.";
    if (type === "placeholder" || !type)
      errors.type = "Type, like mutant or hero, is required.";
    if (privacy === "placeholder" || !privacy)
      errors.privacy = "Guardians of the Galaxy say this is required.";

    if (Object.values(errors).length) {
      setValidationErrors(errors);
    } else {
      const newGroupReqBody = {
        name,
        about,
        type,
        private: privacy,
        city,
        state: state.toUpperCase(),
      };

      const createdGroup = await dispatch(
        thunkUpdateGroup(groupId, newGroupReqBody)
      );

      if (createdGroup.errors) {
        setValidationErrors(createdGroup.errors);
      } else {
        navigate(`/groups/${createdGroup.id}`);
      }
    }
  };

  return (
    <section className="faction-section">
      <h1>Update your Faction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Set your Faction&apos;s Base of Operation</h2>
          <p>
            MutantMingle faction&apos;s gather locally, in person, and online.
            We&apos;ll connect you with heroes (or villains) in your area.
          </p>
          <label htmlFor="city">
            <input
              type="text"
              name="city"
              id="group-city"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <span id="comma-span"></span>
          <label htmlFor="state">
            <input
              type="text"
              id="faction-state"
              placeholder="STATE"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </label>
          <div className="errors-div">
            {"city" in validationErrors && (
              <span className="errors" id="faction-error-city">
                {validationErrors.city}
              </span>
            )}
            {"state" in validationErrors && (
              <span className="errors" id="faction-error-state">
                {validationErrors.state}
              </span>
            )}
          </div>
        </div>
        <div>
          <h2>What shall we call your Faction?</h2>
          <p>
            Choose a name that will give people a clear idea of what the faction
            is about. Feel free to get creative! You can edit this later if you
            change your mind.
          </p>
          <label>
            <input
              type="text"
              id="faction-name"
              placeholder="Faction name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <div className="errors-div">
            {"name" in validationErrors && (
              <span className="errors">{validationErrors.name}</span>
            )}
          </div>
        </div>
        <div>
          <h2>Describe the mission of your faction.</h2>
          <label>
            <p>
              People will see this when we promote your faction, but you&apos;ll
              be able to add to it later, too. 1. What&apos;s the mission of the
              faction? 2. Who should join? 3. What heroic deeds will you do at
              your events?
            </p>
          </label>
          <textarea
            name=""
            id="faction-about"
            cols="30"
            rows="10"
            placeholder="Please write at least 30 characters"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
          <div className="errors-div">
            {"about" in validationErrors && (
              <span className="errors">{validationErrors.about}</span>
            )}
          </div>
        </div>
        <div id="final-steps-div">
          <h2>Additional Information.</h2>
          <label htmlFor="type">
            <p>Is this an in-person or online group?</p>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option
                className="placeholder-select"
                disabled
                value="placeholder"
              >
                (select one)
              </option>
              <option value="In person">In person</option>
              <option value="Online">Online</option>
            </select>
          </label>
          <div className="errors-div">
            {"type" in validationErrors && (
              <span className="errors">{validationErrors.type}</span>
            )}
          </div>
          <label htmlFor="privacy">
            <p>Is this faction private or public?</p>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <option value="false">Public</option>
              <option value="true">Private</option>
            </select>
          </label>
          <div className="errors-div">
            {"privacy" in validationErrors && (
              <span className="errors">{validationErrors.privacy}</span>
            )}
          </div>
        </div>
        <div>
          <button onSubmit={handleSubmit}>Re-Assemble Faction!!</button>
        </div>
      </form>
    </section>
  );
};

export default EditGroupPage;
