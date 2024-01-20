import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { thunkEventDetails } from "../../../store/events";
import { thunkUpdateEvent, thunkAddEventImage } from "../../../store/events";

import "./EditEvent.css";

const EditEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const event = useSelector((state) => state.events[eventId]);
  const user = useSelector((state) => state.session.user);
  const group = useSelector((state) => state.groups[event?.groupId]);

  const [name, setName] = useState(event?.name);
  const [type, setType] = useState(event?.type);
  const [capacity, setCapacity] = useState(event?.capacity);
  const [price, setPrice] = useState(event?.price);
  const [startDate, setStartDate] = useState(event?.startDate);
  const [endDate, setEndDate] = useState(event?.endDate);
  const [description, setDescription] = useState(event?.description);
  const [url, setUrl] = useState(
    event?.previewImage || event?.EventImages[0]?.url
  );
  const [validationErrors, setValidationErrors] = useState({});
  const isUserOwner = group?.organizerId == user?.id;

  if (isUserOwner == false) {
    navigate("/");
  }

  useEffect(() => {
    dispatch(thunkEventDetails(eventId));
  }, [dispatch, eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setValidationErrors({});

    const urlEndings = [".png", ".jpg", ".jpeg"];
    const urlEnding3 = url.slice(-4);
    const urlEnding4 = url.slice(-5);

    const errors = {};
    if (!name)
      errors.name = "Your campaign is blank? Name your campaign, hero!";
    if (name.length < 5)
      errors.name = "True campaigns have names longer than 5 characters";
    if (type == "placeholder")
      errors.type =
        "Let your minions know if this is an in person or online event";
    if (capacity == "placeholder" || !capacity)
      errors.capacity = "How many heroes can fit on your QuinnJet?";
    if (price == "placeholder" || !price)
      errors.price = "Should we rob a bank, or no?";
    if (price.startsWith("0") && price.length > 1)
      errors.price =
        "Our system does not accept Galactic Credits. Enter a valid price";
    if (!startDate)
      errors.startDate = "Campaign initialization date is required";
    if (new Date(startDate).getTime() <= new Date().getTime())
      errors.startDate =
        "Your Time Stone is broken. Campaign must be in the future.";
    if (new Date(startDate).getTime() > new Date(endDate).getTime())
      errors.endDate =
        "Check your dates, Evil Genius. Campaign must end after it starts.";
    if (!endDate) errors.endDate = "No campaign can last forever!";
    if (!urlEndings.includes(urlEnding3) && !urlEndings.includes(urlEnding4))
      errors.imageUrl = "Image URL must end in .png, .jpg, or .jpeg";
    if (description.length < 30)
      errors.description =
        "Epic campaigns have epic details! Extend the deets to at least 30 characters.";

    if (Object.values(errors).length) {
      setValidationErrors(errors);
    } else {
      const venueId = null;
      const updatedEventReqBody = {
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      };

      const newEventImgBody = {
        url,
        preview: true,
      };

      const updatedEvent = await dispatch(
        thunkUpdateEvent(eventId, updatedEventReqBody)
      );
      if (updatedEvent.ok === false) {
        //^ set validation errors
        //^ errors.startDate = 'Event start date and time must be after the current date and time'
      } else {
        //^ dispatch the image to the new group's id
        //^ the dispatch needs the group id AND the body
        await dispatch(thunkAddEventImage(eventId, newEventImgBody));
        navigate(`/events/${updatedEvent.id}`);
      }
    }
  };

  return (
    <form className="campaign-form" onSubmit={handleSubmit}>
      <div id="campaign-top-div">
        <h1>Update your Campaign</h1>
        <label htmlFor="event-name">
          <p>What are we calling your campaign this time?</p>
        </label>
        <input
          name="campaign-name"
          id="campaign-input-name"
          type="text"
          placeholder="Epic Campaign Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {"name" in validationErrors && (
          <p className="errors">{validationErrors.name}</p>
        )}
      </div>
      <div>
        <label htmlFor="">
          <p>Choose Your Dimension: In Person or Online?</p>
        </label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option disabled value="select-one">
            (select one)
          </option>
          <option value="In person">In person</option>
          <option value="Online">Online</option>
        </select>
        {"type" in validationErrors && (
          <p className="errors">{validationErrors.type}</p>
        )}
        <label htmlFor="">
          <p>What is the capacity of the QuinnJet for your Campaign?</p>
        </label>
        <input
          type="number"
          id="campaign-input-capacity"
          placeholder="QuinnJet Capacity"
          min={0}
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
        {"capacity" in validationErrors && (
          <p className="errors">{validationErrors.capacity}</p>
        )}
        <label htmlFor="price">
          <p>How much cheddar is required to attend?</p>
        </label>
        <div id="campaign-div-price">
          <i className="fa-solid fa-dollar-sign"></i>
          <input
            id="campaign-input-price"
            step="0.01"
            name="price"
            type="number"
            placeholder="0.00"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {"price" in validationErrors && (
          <p className="errors">{validationErrors.price}</p>
        )}
      </div>
      <div>
        <label htmlFor="">
          <p>When is &quot;GO&quot; time?</p>
        </label>
        <input
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        {"startDate" in validationErrors && (
          <p className="errors">{validationErrors.startDate}</p>
        )}
        <label htmlFor="">
          <p>Campaign end date? (Please note: survival is not guaranteed)</p>
        </label>
        <input
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        {"endDate" in validationErrors && (
          <p className="errors">{validationErrors.endDate}</p>
        )}
      </div>
      <div>
        <label htmlFor="imageUrl">
          <p>
            Add campaign surveillance image from an approved intelligence source
            below:
          </p>
        </label>
        <input
          type="url"
          id="campaign-input-imageUrl"
          name="imageUrl"
          placeholder="Image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {"imageUrl" in validationErrors && (
          <p className="errors">{validationErrors.imageUrl}</p>
        )}
      </div>
      <div>
        <label htmlFor="description">
          <p>Please describe your event:</p>
        </label>
        <textarea
          name="description"
          id="event-input-description"
          cols="30"
          rows="10"
          placeholder="Please include at least 30 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {"description" in validationErrors && (
          <p className="errors">{validationErrors.description}</p>
        )}
      </div>
      <button>Update Campaign Intel</button>
    </form>
  );
};

export default EditEvent;
