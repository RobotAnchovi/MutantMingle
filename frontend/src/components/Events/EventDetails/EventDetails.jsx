import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { thunkEventDetails } from "../../../store/events";
import { thunkGroupDetails } from "../../../store/groups";
import OpenModalButton from "../../OpenModalButton";
import DeleteEventModal from "../DeleteEventModal";
import "./EventDetails.css";

const EventDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const user = useSelector((state) => state.session.user);
  const event = useSelector((state) => state.events[eventId]);
  const group = useSelector((state) => state.groups[event?.groupId]);
  const [ueRan, setUeRan] = useState(false);
  const isUserOwner = group?.organizerId == user?.id;

  useEffect(() => {
    const helper = async () => {
      await dispatch(thunkEventDetails(eventId));
      setUeRan(true);
    };
    if (ueRan) {
      dispatch(thunkGroupDetails(group?.id));
    } else {
      helper();
    }
  }, [dispatch, ueRan, eventId, group?.id]);

  let eventImagesPreview;
  if (event?.previewImage) {
    eventImagesPreview = event.previewImage;
  } else if (event?.EventImages) {
    eventImagesPreview = event?.EventImages?.find(
      (image) => image?.preview === true
    )?.url;
  }

  let groupPreview;
  if (group?.GroupImages) {
    groupPreview = group?.GroupImages?.find(
      (image) => image.preview === true
    )?.url;
  } else if (group?.previewImage) {
    groupPreview = group.previewImage;
  }

  let startingDate;
  let startingTime;
  let endingDate;
  let endingTime;

  if (event?.startDate) {
    const startingDateObject = new Date(event.startDate);
    startingDate = startingDateObject.toLocaleDateString();
    const endingDateObject = event.endDate ? new Date(event.endDate) : null;
    endingDate = endingDateObject
      ? endingDateObject.toLocaleDateString()
      : null;
  }

  if (!event) return null;

  return (
    <>
      <div className="event-heading">
        <span>{"<"}</span>
        <Link id="back-to-events" to={"/events"}>
          Events
        </Link>
        <h1>{event?.name}</h1>
        <h4>
          Hosted by: {group?.Organizer?.firstName} {group?.Organizer?.lastName}
        </h4>
      </div>
      <section className="event-section">
        <div className="event-detail">
          <div className="event-img">
            {event?.EventImages && <img src={eventImagesPreview} alt="" />}
          </div>
          <div className="event-stats-section">
            <Link to={`/groups/${event.groupId}`}>
              <div className="event-group-card">
                <div className="event-group-image">
                  {group?.GroupImages && <img src={groupPreview} />}
                </div>
                <div className="event-group-info">
                  <h3>{group?.name}</h3>
                  <h4>{group?.private ? "Private" : "Public"}</h4>
                </div>
              </div>
            </Link>
            <div className="event-stats">
              <div className="times">
                <div className="icon-div">
                  <i className="fa-regular fa-clock"></i>
                </div>
                <div className="times-headers">
                  <p>
                    <span>START</span>
                  </p>
                  <p>
                    <span>END</span>
                  </p>
                </div>
                <div className="event-stats-stats">
                  <p>
                    {startingDate} · {"<"}
                    {startingTime}
                    {">"}
                  </p>
                  <p>
                    {endingDate} · {"<"}
                    {endingTime}
                    {">"}
                  </p>
                </div>
              </div>

              <div className="event-price">
                <div className="icon-div">
                  <i className="fa-solid fa-dollar-sign"></i>
                </div>
                <div className="event-price-stat">
                  <span>
                    {event?.price == 0
                      ? "FREE"
                      : event?.price?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                  </span>
                </div>
              </div>

              <div className="event-type">
                <div className="icon-div">
                  <i className="fa-solid fa-map-pin"></i>
                </div>
                <div className="event-type-stat">
                  <span>{event?.type}</span>
                </div>

                <div className="event-details-user-buttons">
                  {isUserOwner && (
                    <button onClick={() => navigate(`/events/${eventId}/edit`)}>
                      Update
                    </button>
                  )}
                  {isUserOwner && (
                    <OpenModalButton
                      buttonText="Delete"
                      modalComponent={<DeleteEventModal event={event} />}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="event-description">
          <h2>Description</h2>
          <p>{event?.description}</p>
        </div>
      </section>
    </>
  );
};

export default EventDetails;
