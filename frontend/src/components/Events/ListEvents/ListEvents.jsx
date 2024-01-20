import EventItem from "../EventItem";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./ListEvent.css";

const ListEvents = () => {
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
    <div className="campaign-list-page">
      <section>
        <div className="page-links">
          <NavLink to="/events">Campaigns</NavLink>
          <NavLink to="/groups">Factions</NavLink>
        </div>
        <div>
          <span>Active Campaigns in MutantMerge</span>
        </div>
      </section>
      <section>
        <ul className="campaigns-list">
          {upcoming?.map((event) => (
            <EventItem event={event} key={event.id} />
          ))}
          {past.length > 0 && <h2>Past Events</h2>}
          {past.length > 0 &&
            past.map((event) => <EventItem event={event} key={event.id} />)}
        </ul>
      </section>
    </div>
  );
};

export default ListEvents;
