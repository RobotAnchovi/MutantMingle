import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { thunkGroupDetails } from "../../../store/groups";
import { thunkCreateEvent } from "../../../store/events";
import { thunkAddEventImage } from "../../../store/events";
import "./CreateEvent.css";

const CreateEvent = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [type, setType] = useState("select-one");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const group = useSelector((state) => state.groups[groupId]);

  useEffect(() => {
    dispatch(thunkGroupDetails(groupId));
  }, [dispatch, groupId]);

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
      const newEventReqBody = {
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

      const createdEvent = await dispatch(
        thunkCreateEvent(groupId, newEventReqBody)
      );
      if (createdEvent.ok === false) {
        //^ set validation errors
        //^ errors.startDate = 'Event start date and time must be after the current date and time'
      } else {
        //^ dispatch the image to the new group's id
        //^ the dispatch needs the group id AND the body
        await dispatch(thunkAddEventImage(createdEvent.id, newEventImgBody));
        navigate(`/events/${createdEvent.id}`);
      }
    }
  };

  return (
    <form className="campaign-form" onSubmit={handleSubmit}>
      <div id="campaign-top-div">
        <h1>Assemble a new campaign for {group?.name}</h1>
        <label htmlFor="campaign-name">
          <p>What shall we call your epic campaign?</p>
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
          <p>Explain the nature of the campaign. Are we avenging Uncle Ben?</p>
        </label>
        <textarea
          name="description"
          id="campaign-input-description"
          cols="30"
          rows="10"
          placeholder="Add Campaign Intelligence..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {"description" in validationErrors && (
          <p className="errors">{validationErrors.description}</p>
        )}
      </div>
      <button>Create Campaign</button>
    </form>
  );
};

export default CreateEvent;
