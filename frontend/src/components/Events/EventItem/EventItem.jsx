import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { thunkEventDetails } from "../../../store/events";
import "./EventItem.css";
import { Link } from "react-router-dom";

const EventItem = ({ event }) => {
  const dispatch = useDispatch();
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
    if (event.id) dispatch(thunkEventDetails(event.id));
  }, [dispatch, event.id]);

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
        <div className="campaign-list-item">
          <div className="campaign-card-img">
            {preview && (
              <img className="campaign-list-image" src={preview} alt="" />
            )}
            {eventImagesPreview && (
              <img
                className="campaign-list-image"
                src={eventImagesPreview.url}
                alt=""
              />
            )}
          </div>
          <div className="campaign-list-info">
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
              <h4>REDACTED</h4>
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

export default EventItem;
