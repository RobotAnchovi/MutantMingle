import EventsListItem from "../EventsListItem";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./EventsList.css";

const EventsList = () => {
  const eventsObj = useSelector((state) => state.events);
  const events = Object.values(eventsObj);

  events?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const upcoming = [];
  const past = [];
  const currentTime = Date.now();

  events.forEach((event) => {
    Date.parse(event.startDate) < currentTime
      ? past.push(event)
      : upcoming.push(event);
  });

  return (
    <div className="events-list-page">
      <section>
        <div className="page-links">
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/groups">Groups</NavLink>
        </div>
        <div>
          <span>Events in MutantMingle</span>
        </div>
      </section>
      <section>
        <ul className="events-list">
          {upcoming?.map((event) => (
            <EventsListItem eventId={event.id} key={event.id} />
          ))}
          {past.length > 0 && <h2>Past Events</h2>}
          {past.length > 0 &&
            past.map((event) => (
              <EventsListItem eventId={event.id} key={event.id} />
            ))}
        </ul>
      </section>
    </div>
  );
};

export default EventsList;
