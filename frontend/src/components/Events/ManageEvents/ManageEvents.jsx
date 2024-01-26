import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchEvents } from "../../../store/events";
import "./ManageEvents.css";

const ManageEvents = () => {
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events.list);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  //^ Sort events by date
  const sortedEvents = events.sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  const now = new Date();

  //^ Separate upcoming and past events
  const upcomingEvents = sortedEvents.filter(
    (event) => new Date(event.startDate) >= now
  );
  const pastEvents = sortedEvents.filter(
    (event) => new Date(event.startDate) < now
  );

  //^ Sort past events by most recent
  const sortedPastEvents = pastEvents.sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  );

  //^ Combine the events
  const sortedAndFilteredEvents = [...upcomingEvents, ...sortedPastEvents];

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

  return (
    <div className="campaigns-page">
      <section>
        <div className="page-links">
          <NavLink className="" to="/events">
            Campaigns
          </NavLink>
          <NavLink className="" to="/groups">
            Factions
          </NavLink>
        </div>
        <div>
          <span> Active Factions on MutantMingle</span>
        </div>
      </section>
      <div className="faction-list">
        {sortedAndFilteredEvents.map(
          (event) => (
            console.log("Campaigns Page: event:", event),
            (
              <a
                href={`/events/${event.id}`}
                key={event.id}
                className="faction-container"
              >
                <div>
                  {/* Check if event.previewImage is not the specific string */}
                  <img
                    src={
                      event.previewImage !== "No preview image found."
                        ? event.previewImage
                        : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
                    }
                    alt={event.name}
                  />
                  <div>
                    <p className="faction-date">
                      {formatDate(event.startDate)}
                    </p>
                    <h2 className="faction-name">{event.name}</h2>
                    {/* Check if event.Venue exists before trying to access its properties */}
                    <p>
                      {event.Venue ? (
                        <span className="faction-location">
                          {event.Venue.city}, {event.Venue.state}
                        </span>
                      ) : (
                        "There is not a venue, or it is CLASSIFIED"
                      )}
                    </p>
                    <div>
                      <p className="faction-about">
                        (Insert Campaign Description here.)
                      </p>
                      {console.log(
                        `🚀 ~ ManageEvents ~ description:`,
                        event.description
                      )}
                    </div>
                    <p className="faction-attendance">
                      {event.numAttending} attending
                    </p>
                  </div>
                </div>
              </a>
            )
          )
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
