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
    <div className="campaigns-list-page">
      <section>
        <div className="page-links">
          <NavLink to="/events">Campaigns</NavLink>
          <NavLink to="/groups">Factions</NavLink>
        </div>
        <div>
          <span> All Campaigns in MutantMingle</span>
        </div>
      </section>
      <section>
        <ul className="campaigns-list">
          {upcoming?.map((event) => (
            <EventsListItem eventId={event.id} key={event.id} />
          ))}
          {past.length > 0 && <h2>Past Campaigns</h2>}
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
