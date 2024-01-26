import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupEvents } from "../../../store/groups";
// import OpenModalButton from "../../OpenModalButton";
// import DeleteGroupModal from "../DeleteGroupModal";
import "./groupEvents.css";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { LoadGroupEvents } from "../../../store/groups";

const GroupEvents = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const groupEvents = useSelector((state) => state.groups.groupEvents);

  useEffect(() => {
    dispatch(fetchGroupEvents(id));
  }, [dispatch, id]);

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

  //^ Sort events by startDate
  const sortedEvents = groupEvents
    .slice()
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  //^ Filter upcoming and past events
  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.startDate) > new Date()
  );
  const pastEvents = sortedEvents.filter(
    (event) => new Date(event.startDate) <= new Date()
  );

  return (
    <div className="faction-campaign-list">
      <section className="upcoming-campaigns">
        <h2>Upcoming Campaigns</h2>
        {upcomingEvents.map((event) => (
          <a
            href={`/events/${event.id}`}
            key={event.id}
            className="campaign-container"
          >
            <div key={event.id} className="campaign">
              <img src={event.previewImage} alt={event.name} />
              <p>{formatDate(event.startDate)}</p>
              <h3>{event.name}</h3>
              {event.Venue ? (
                <p>
                  {event.Venue.city}, {event.Venue.state}
                </p>
              ) : (
                <p>There is not a venue...or it&apos;s TOP-SECRET</p>
              )}
              <p>{event.description}</p>
            </div>
          </a>
        ))}
      </section>

      <section className="past-campaigns">
        <h2>Past Campaigns</h2>
        {pastEvents.map((event) => (
          <a
            href={`/events/${event.id}`}
            key={event.id}
            className="campaign-container"
          >
            <div key={event.id} className="event">
              <img src={event.previewImage} alt={event.name} />
              <p>{formatDate(event.startDate)}</p>
              <h3>{event.name}</h3>
              {event.Venue ? (
                <p>
                  {event.Venue.city}, {event.Venue.state}
                </p>
              ) : (
                <p>TThere is not a venue...or it&apos;s TOP-SECRET</p>
              )}
              <p>{event.description}</p>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
};

export default GroupEvents;
