import "./EditGroup.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkEditGroup, thunkGroupDetails } from "../../../store/groups";

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
    if (!name)
      errors.name =
        "Your true identity is required, but trust we will tell no one.";
    if (about.length < 30)
      errors.about =
        "Description must be at least 30 characters long. Unless your tentacles prohibit this.";
    if (type == "placeholder" || !type)
      errors.type = "Faction Type is required";
    if (privacy == "placeholder")
      errors.privacy = "Visibility Type is required even if you are invisible";

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
        // console.log("editedGroup.errors:", editedGroup.errors)
      } else {
        // await dispatch(thunkAddImage(groupId, newImageReqBody))
        navigate(`/groups/${groupId}`);
      }
    }
  };

  return (
    <section className="faction-section">
      <h4>DECLARE YOUR FACTION&apos;S NEW ALLEGIANCES!</h4>
      <h2>Update your Faction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Declare your faction&apos;s secret location</h2>
          <p>
            MutantMingle factions gather locally, in person and online.
            <br />
            We&apos;ll connect you with mutants, heroes, or villains in your
            area.
          </p>
          <label>
            <input
              type="text"
              id="faction-city"
              placeholder="City of Origin"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <span id="comma-span">,</span>
          <label>
            <input
              type="text"
              id="faction-state"
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
          <h2>What shall we call your faction?</h2>
          <p>
            Choose a name that will provide hope or strike fear in the hearts of
            your enemies.
            <br />
            Waste little time! Evil runs rampant in the streets.You can always
            change it later.
          </p>
          <label>
            <input
              type="text"
              id="faction-name"
              placeholder="Your faction shall be called..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          {"name" in validationErrors && (
            <p className="errors">{validationErrors.name}</p>
          )}
        </div>
        <div>
          <h2>Proclaim the purpose of your faction!</h2>
          <label>
            <p>
              This will be made public to all! Should your purpose change or
              evil forces prevail, you can always change it later.
              <br />
              <br />
              1. What&apos;s the purpose or destiny of the faction?
              <br />
              2. Who should align themselves with your faction?
              <br />
              3. What type of events will your faction pursue?
            </p>
          </label>
          <textarea
            name=""
            id="faction-about"
            cols="30"
            rows="10"
            placeholder="State your purpose with at least 30 characters"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
          {"about" in validationErrors && (
            <p className="errors">{validationErrors.about}</p>
          )}
        </div>
        <div id="final-steps-div">
          <h2>Almost Complete...</h2>
          <label htmlFor="type">
            <p>Does your faction meet in person or online?</p>
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
            <p>
              Does this faction operate in the shadows as private or openly in
              the public eye?
            </p>
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
          <button onSubmit={handleSubmit}>Re-Assemble your Faction</button>
        </div>
      </form>
    </section>
  );
};

export default EditGroupForm;
