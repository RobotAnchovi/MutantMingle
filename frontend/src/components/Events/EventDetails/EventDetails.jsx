import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventDetails, thunkRemoveEvent } from "../../../store/events";
import { fetchGroupDetails } from "../../../store/groups";
import "./EventDetails.css";

const EventDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const eventDetails = useSelector((state) => state.events.eventDetails);

  const groupDetails = useSelector((state) => state.groups.groupDetails);

  const currentUser = useSelector((state) => state.session.user); // Add this line to get the current user
  const userEvents = useSelector((state) => state.events.userEvents);

  const [isEventDetailsLoaded, setIsEventDetailsLoaded] = useState(false);
  const [isGroupDetailsLoaded, setIsGroupDetailsLoaded] = useState(false);

  // console.log(`EventDetails ~ isGroupDetailsLoaded:`, isGroupDetailsLoaded);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      await dispatch(fetchEventDetails(id));
      setIsEventDetailsLoaded(true);
    };

    fetchDetails();
  }, [dispatch, id]);

  useEffect(() => {
    const fetchGroup = async () => {
      if (isEventDetailsLoaded && eventDetails.Group?.id) {
        await dispatch(fetchGroupDetails(eventDetails.Group.id));
        setIsGroupDetailsLoaded(true);
      }
    };

    fetchGroup();
  }, [dispatch, isEventDetailsLoaded, eventDetails.Group?.id]);

  //^ get event image url`
  let eventImageWithPreview;
  if (eventDetails && eventDetails.EventImages) {
    eventImageWithPreview = eventDetails.EventImages.find(
      (image) => image.preview === true
    );
  }

  //^ get group image url
  let groupImageWithPreview;
  if (groupDetails && groupDetails.GroupImages) {
    groupImageWithPreview = groupDetails.GroupImages.find(
      (image) => image.preview === true
    );
  }
  // console.log(groupImageWithPreview);

  //^ Check if the user is logged in and is the event creator
  const isEventCreator =
    currentUser && groupDetails?.Organizer?.id === currentUser.id; //^ Modify this line as per your data structure
  // console.log("EventDetailPage ~ isEventCreator:", isEventCreator);

  //^ Handlers for the buttons
  const handleUpdateEvent = () => {
    //^ Logic to handle event update
  };

  const handleDeleteEvent = () => {
    setShowDeleteConfirmation(true);
  };

  // const handleDeleteClick = () => {
  //   setShowDeleteConfirmation(true);
  // };

  // console.log(`handleDeleteClick ~ handleDeleteClick:`, handleDeleteClick);

  const handleConfirmDelete = async () => {
    const result = await dispatch(thunkRemoveEvent(eventDetails.id));
    if (result.message === "Successfully deleted") {
      navigate(`/groups/${groupDetails.id}`);
    } else {
      //^ Handle error
    }
  };

  //^ formatting my dates
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return new Date(dateString)
      .toLocaleString("en-US", options)
      .replace(",", " ·");
  };

  //^ format price
  const formatPrice = (price) => {
    return price === 0 ? "FREE" : `$${price.toFixed(2)}`;
  };

  //*====> Check if event details and group details are loaded <====
  if (isEventDetailsLoaded && isGroupDetailsLoaded) {
    //*====> If userEvents is empty, display no events message <====
    if (userEvents && userEvents.length === 0) {
      return (
        <div className="no-events-message">
          <p>You are not a part of any campaigns currently!</p>
        </div>
      );
    }

    //*====> If eventDetails or groupDetails are not present, return loading <====
    if (
      !eventDetails ||
      Object.keys(eventDetails).length === 0 ||
      !groupDetails
    ) {
      return <div>Loading...</div>;
    }
    return (
      <div className="campaign-detail-page">
        <nav className="back-to-campaigns">
          <Link to="/events">&lt; Return to Campaigns</Link>
        </nav>
        <div className="campaign-card-heading">
          <h1>{eventDetails.name}</h1>
          {groupDetails && groupDetails.Organizer && (
            <p>
              Fearlessly Led by {groupDetails.Organizer.firstName}{" "}
              {groupDetails.Organizer.lastName}
            </p>
          )}
          {isEventCreator && (
            <div className="campaign-management-buttons">
              <button
                onClick={handleUpdateEvent}
                className="update-event-button"
              >
                Update Campaign Intel
              </button>
              <button
                onClick={handleDeleteEvent}
                className="delete-event-button"
              >
                Abort Campaign
              </button>
              {showDeleteConfirmation && (
                <div className="confirmation-modal">
                  <p>Are you sure you want to abort this Campaign?</p>
                  <button onClick={handleConfirmDelete}>
                    Yes, delete this campaign
                  </button>
                  <button onClick={() => setShowDeleteConfirmation(false)}>
                    No, keep this campaign.
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div>
          <div className="top-card">
            <div className="campaign-image-div">
              <img
                src={
                  eventImageWithPreview !== undefined
                    ? eventImageWithPreview.url
                    : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
                }
                alt={eventDetails.name}
                className="campaign-image"
              />
            </div>
            <div className="faction-info">
              <div className="faction-name">
                {
                  <img
                    src={
                      groupImageWithPreview !== undefined
                        ? groupImageWithPreview.url
                        : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
                    }
                    alt={groupDetails?.name}
                    className="faction-image"
                  />
                }
                <div className="faction-deets">
                  <h3>{eventDetails.Group.name}</h3>
                  <p>{eventDetails.Group.private ? "Private" : "Public"}</p>
                </div>
              </div>
              <div className="campaign-stats">
                <div className="campaign-date">
                  <img src="fa-regular fa-clock" alt="icon" className="clock" />
                  <div className="start-end-times">
                    <p>START {formatDate(eventDetails.startDate)}</p>
                    <p>END {formatDate(eventDetails.endDate)}</p>
                  </div>
                </div>
                <div className="campaign-price">
                  <img
                    src="fa-solid fa-dollar-sign"
                    alt="icon"
                    className="dollar-sign"
                  />
                  <p>Price: {formatPrice(eventDetails.price)}</p>
                </div>
                <div className="campaign-type">
                  <img
                    src="fa-solid fa-map-pin"
                    alt="icon"
                    className="map-pin"
                  />
                  <p>{eventDetails.type}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="campaign-details">
            <h1>Intel Briefing</h1>
            <p>{eventDetails.description}</p>
          </div>
        </div>
      </div>
    );
  }
};

export default EventDetails;
