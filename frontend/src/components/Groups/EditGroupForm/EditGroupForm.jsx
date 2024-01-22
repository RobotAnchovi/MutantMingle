import "./EditGroupForm.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGroupDetails, thunkEditGroup } from "../../../store/groups";

const EditGroupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const group = useSelector((state) => state.groups[groupId]);
  const user = useSelector((state) => state.session.user);
  const [city, setCity] = useState(group?.city);
  const [state, setState] = useState(group?.state);
  const [name, setName] = useState(group?.name);
  const [about, setAbout] = useState(group?.about);
  const [type, setType] = useState(group?.type);
  const [privacy, setPrivacy] = useState(group?.private);
  const [validationErrors, setValidationErrors] = useState({});
  const isUserOwner = group?.organizerId == user?.id;

  if (isUserOwner == false) {
    navigate("/");
  }

  useEffect(() => {
    dispatch(thunkGroupDetails(groupId));
  }, [dispatch, groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!name) errors.name = "Name is required";
    if (about.length < 30)
      errors.about = "Description must be at least 30 characters long";
    if (type == "placeholder" || !type) errors.type = "Group Type is required";
    if (privacy == "placeholder")
      errors.privacy = "Visibility Type is required";

    setValidationErrors(errors);

    if (!Object.values(validationErrors).length) {
      const newGroupReqBody = {
        name,
        about,
        type,
        private: privacy,
        city,
        state,
      };

      const editedGroup = await dispatch(
        thunkEditGroup(groupId, newGroupReqBody)
      );

      if (editedGroup.errors) {
        setValidationErrors(editedGroup.errors);
      } else {
        navigate(`/groups/${groupId}`);
      }
    }
  };

  return (
    <section className="group-section">
      <h4>UPDATE YOUR FACTION&apos;S INFORMATION</h4>
      <h2>Update your Faction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Set your faction&apos;s location</h2>
          <p>
            MutantMingle factions meet locally, in person and online.
            <br />
            We&apos;ll connect you with heroes or villains in your area.
          </p>
          <label>
            <input
              type="text"
              id="group-city"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <span id="comma-span">,</span>
          <label>
            <input
              type="text"
              id="group-state"
              placeholder="STATE"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </label>
          {"city" in validationErrors && (
            <p className="errors">{validationErrors.city}</p>
          )}
          {"state" in validationErrors && (
            <p className="errors">{validationErrors.state}</p>
          )}
        </div>
        <div>
          <h2>What will your faction&apos;s name be?</h2>
          <p>
            Choose a name that will strike fear in the hearts of citizens or
            villains.
            <br />
            Be creative! Your faction name is critical! You can always change it
            later.
          </p>
          <label>
            <input
              type="text"
              id="group-name"
              placeholder="What is your group name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          {"name" in validationErrors && (
            <p className="errors">{validationErrors.name}</p>
          )}
        </div>
        <div>
          <h2>Describe the destiny of your faction.</h2>
          <label>
            <p>
              Other Heroes will see this when we promote your faction, but
              you&apos;ll be able to add to it later, too.
              <br />
              <br />
              1. What&apos;s the purpose of the faction?
              <br />
              2. Who should join?
              <br />
              3. What will you do at your campaigns?
            </p>
          </label>
          <textarea
            name=""
            id="group-about"
            cols="30"
            rows="10"
            placeholder="Please write at least 30 characters"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
          {"about" in validationErrors && (
            <p className="errors">{validationErrors.about}</p>
          )}
        </div>
        <div id="final-steps-div">
          <h2>Final steps...</h2>
          <label htmlFor="type">
            <p>Is this an in person or online faction?</p>
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
          {"type" in validationErrors && (
            <p className="errors">{validationErrors.type}</p>
          )}
          <label htmlFor="privacy">
            <p>Is this faction private or public?</p>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
              <option
                className="placeholder-select"
                disabled
                value="placeholder"
              >
                (select one)
              </option>
              <option value={false}>Public</option>
              <option value={true}>Private</option>
            </select>
          </label>
          {"privacy" in validationErrors && (
            <p className="errors">{validationErrors.privacy}</p>
          )}
        </div>
        <div>
          <button onSubmit={handleSubmit}>Re-Assemble Faction!</button>
        </div>
      </form>
    </section>
  );
};

export default EditGroupForm;
