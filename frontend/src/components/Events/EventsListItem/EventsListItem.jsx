import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { EventDetails } from "../../../store/events";
import "./EventsListItem.css";
import { Link } from "react-router-dom";

const EventsListItem = ({ eventId }) => {
  const dispatch = useDispatch();
  const event = useSelector((state) => state.events[eventId]);
  let preview;
  let eventImagesPreview;
  if (event.previewImage) {
    preview = event.previewImage;
  } else if (event.EventImages) {
    eventImagesPreview = event.EventImages.find(
      (image) => image.preview === true
    );
  }

  useEffect(() => {
    dispatch(EventDetails(eventId));
    console.log(`EVENT_LIST EVENTS: `, eventId);
  }, [dispatch, eventId]);

  let date;
  let time;

  if (event && !event.message) {
    date = event.startDate.split(" ")[0];
    time = event.startDate.split(" ")[1];
    time = time?.slice(0, 5);
  }

  return (
    <Link to={`/events/${event.id}`} event={event}>
      <li>
        <div className="campaigns-list-item">
          <div className="campaign-card-img">
            {preview && (
              <img className="campaigns-list-image" src={preview} alt="" />
            )}
            {eventImagesPreview && (
              <img
                className="campaigns-list-image"
                src={eventImagesPreview.url}
                alt=""
              />
            )}
          </div>
          <div className="campaigns-list-info">
            <h3>
              {date} · {"<"}
              {time}
              {">"}
            </h3>
            <h2>{event.name}</h2>
            {event.Venue ? (
              <h4>
                {event.Venue?.city}, {event.Venue?.state}
              </h4>
            ) : (
              <h4>Location redacted..or online</h4>
            )}
          </div>
        </div>
        <div className="campaign-card-about">
          <p>{event.description}</p>
        </div>
      </li>
    </Link>
  );
};

export default EventsListItem;
