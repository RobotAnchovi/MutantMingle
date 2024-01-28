import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { thunkCreateEvent, thunkAddEventImage } from "../../../store/events";
import "./CreateEventForm.css";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { groupId, groupName } = location.state;
  const dispatch = useDispatch();

  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("In person");
  const [eventPrice, setEventPrice] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {}, []);

  const validateForm = () => {
    const errors = {};
    if (!eventName) errors.eventName = "Hulk smash! Event name is required.";
    if (!startDate)
      errors.startDate = "Iron Man needs a start date for this event.";
    if (!endDate) errors.endDate = "Thor's hammer says end date is required.";
    if (!imageUrl)
      errors.imageUrl = "Wolverine wants an image URL for this event.";
    if (!description || description.length < 30)
      errors.description =
        "Black Widow says your description needs to be at least 30 characters long.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      const newEvent = {
        name: eventName,
        type: eventType,
        price: eventPrice,
        startDate,
        endDate,
        description,
      };

      const createdEvent = await dispatch(thunkCreateEvent(groupId, newEvent));
      // console.log("handleSubmit ~ createdEvent:", createdEvent);
      if (createdEvent.errors) {
        setValidationErrors(createdEvent.errors);
      } else {
        await dispatch(
          thunkAddEventImage(createdEvent.id, { url: imageUrl, preview: true })
        );
        navigate(`/events/${createdEvent.id}`);
      }
    }
  };

  return (
    <div className="campaign-form">
      <h1>Assemble a new campaign for {groupName}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            What will your campaign be called?
            <input
              type="text"
              placeholder="Campaign Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </label>
          {validationErrors.eventName && (
            <p className="form-error">{validationErrors.eventName}</p>
          )}
        </div>

        <div>
          <label>
            Is this an in-person or online campaign?
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="In person">In person</option>
              <option value="Online">Online</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            How much will this cost the heroes?
            <input
              type="number"
              placeholder="0"
              value={eventPrice}
              onChange={(e) => setEventPrice(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            When does your campaign start?
            <input
              type="datetime-local"
              placeholder={startDate}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          {validationErrors.startDate && (
            <p className="form-error">{validationErrors.startDate}</p>
          )}
        </div>

        <div>
          <label>
            When does your campaign end?
            <input
              type="datetime-local"
              placeholder={endDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          {validationErrors.endDate && (
            <p className="form-error">{validationErrors.endDate}</p>
          )}
        </div>

        <div>
          <label>
            Add an img url for your campaign:
            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </label>
          {validationErrors.imageUrl && (
            <p className="form-error">{validationErrors.imageUrl}</p>
          )}
        </div>

        <div>
          <label>
            Brief us on your campaign:
            <textarea
              className="description-textarea"
              placeholder="Include at least 30 characters."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>
          {validationErrors.description && (
            <p className="form-error">{validationErrors.description}</p>
          )}
        </div>

        <button type="submit">Assemble Campaign!!!</button>
      </form>
    </div>
  );
};

export default CreateEventPage;
