import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { thunkEventDetails } from "../../../store/events";
import { thunkGroupDetails, thunkLoadGroups } from "../../../store/groups";
import OpenModalButton from "../../OpenModalButton";
import DeleteEvent from "../DeleteEvent";
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
      await dispatch(thunkLoadGroups());
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
    const starting = event.startDate.split(" ");
    startingDate = starting[0];
    startingTime = starting[1];
    startingTime = startingTime.slice(0, 5);
    const ending = event.endDate?.split(" ");
    endingDate = ending[0];
    endingTime = ending[1];
    endingTime = endingTime.slice(0, 5);
  }

  if (!event) return null;

  return (
    <>
      <div className="campaign-heading">
        <span>{"<"}</span>
        <Link id="back-to-campaigns" to={"/events"}>
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
                    <span>COMMENCING</span>
                  </p>
                  <p>
                    <span>COMPLETION</span>
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
                  <span>{event?.price == 0 ? "FREE" : event?.price}</span>
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
                      Update Intel
                    </button>
                  )}
                  {isUserOwner && (
                    <OpenModalButton
                      buttonText="Abort Campaign"
                      modalComponent={<DeleteEvent event={event} />}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="campaign-description">
          <h2>Campaign Briefing</h2>
          <p>{event?.description}</p>
        </div>
      </section>
    </>
  );
};

export default EventDetails;
