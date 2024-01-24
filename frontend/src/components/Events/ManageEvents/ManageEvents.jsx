import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { LoadUserEvents } from "../../../store/session";
import "./ManageEvents.css";
import EventsListItem from "../EventsListItem";

const ManageEvents = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const events = useSelector((state) => state.session.user.Events);
  console.log("EVENTS: ", events);

  let ownedEvents;
  let attendingEvents;

  if (events) {
    ownedEvents = Object.values(events.ownedEvents);
    attendingEvents = Object.values(events.attendingEvents);
  }

  ownedEvents?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  attendingEvents?.sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  useEffect(() => {
    if (!user.Events) dispatch(LoadUserEvents());
    console.log("USER EVENTS: ", user.Events);
    console.log("USER: ", user);
  }, [dispatch, user]);

  return (
    <div className="user-groups-content">
      <h2>Manage Campaigns</h2>

      <h4>Your campaigns in MutantMingle</h4>

      {ownedEvents?.length ? (
        <div>
          <h2>Campaigns you lead:</h2>
          <ul>
            {ownedEvents.map((event) => (
              <EventsListItem event={event} eventId={event.id} key={event.id} />
            ))}
          </ul>
        </div>
      ) : (
        <h2>You have no campaigns yet!</h2>
      )}
      {attendingEvents?.length ? (
        <div>
          <h2>Campaigns that you are attending:</h2>
          <ul>
            {attendingEvents.map((event) => (
              <EventsListItem event={event} eventId={event.id} key={event.id} />
            ))}
          </ul>
        </div>
      ) : (
        <h2>You&apos;re just not cool enough for campaigns yet.</h2>
      )}
    </div>
  );
};

export default ManageEvents;
