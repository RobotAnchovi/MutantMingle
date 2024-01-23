import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
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
  const isUserOwner = group?.organizerId == user?.id;

  useEffect(() => {
    if (!event?.EventImages) dispatch(thunkEventDetails(eventId));
    if (group && !group.Organizer) dispatch(thunkGroupDetails(group?.id));
  }, [dispatch, eventId, group, group?.id, event?.EventImages]);

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
      <div className="campaign-heading">
        <span>{"<"}</span>
        <Link id="back-to-campaigns" to={"/campaigns"}>
          Campaigns
        </Link>
        <h1>{event?.name}</h1>
        <h4>
          Led by: {group?.Organizer?.firstName} {group?.Organizer?.lastName}
        </h4>
      </div>
      <section className="campaign-section">
        <div className="campaign-detail">
          <div className="campaign-img">
            {event?.EventImages && <img src={eventImagesPreview} alt="" />}
          </div>
          <div className="campaign-stats-section">
            <Link to={`/groups/${event.groupId}`}>
              <div className="campaign-group-card">
                <div className="campaign-group-image">
                  {group?.GroupImages && <img src={groupPreview} />}
                </div>
                <div className="campaign-group-info">
                  <h3>{group?.name}</h3>
                  <h4>{group?.private ? "Private" : "Public"}</h4>
                </div>
              </div>
            </Link>
            <div className="campaign-stats">
              <div className="times">
                <div className="icon-div">
                  <i className="fa-regular fa-clock"></i>
                </div>
                <div className="times-headers">
                  <p>
                    <span>Mission Commence</span>
                  </p>
                  <p>
                    <span>End of Operation</span>
                  </p>
                </div>
                <div className="campaign-stats-stats">
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

              <div className="campaign-price">
                <div className="icon-div">
                  <i className="fa-solid fa-dollar-sign"></i>
                </div>
                <div className="campaign-price-stat">
                  <span>
                    {event?.price == 0
                      ? "FREE"
                      : event?.price?.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                  </span>
                </div>
              </div>

              <div className="campaign-type">
                <div className="icon-div">
                  <i className="fa-solid fa-map-pin"></i>
                </div>
                <div className="campaign-type-stat">
                  <span>{event?.type}</span>
                </div>

                <div className="campaign-details-user-buttons">
                  {isUserOwner && (
                    <button onClick={() => navigate(`/events/${eventId}/edit`)}>
                      Update Campaign Intel
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
          <h2>Intelligence Briefing</h2>
          <p>{event?.description}</p>
        </div>
      </section>
    </>
  );
};

export default EventDetails;
