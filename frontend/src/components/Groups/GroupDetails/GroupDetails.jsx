import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  GroupDetails,
  LoadGroupEvents,
  LoadMembers,
} from "../../../store/groups";
import { useEffect, useState } from "react";
import EventsListItem from "../../Events/EventsListItem/";
import OpenModalButton from "../../OpenModalButton";
import DeleteGroupModal from "../DeleteGroupModal";
import "./GroupDetails.css";

const FetchGroupDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const user = useSelector((state) => state.session.user);
  const group = useSelector((state) => state.groups[groupId]);
  const eventsState = useSelector((state) => state.events);
  const events = useSelector((state) => state.groups[groupId]?.Events);

  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  useEffect(() => {
    // console.log("LOADED EVENTS: ", events);
    dispatch(GroupDetails(groupId));
    dispatch(LoadGroupEvents(groupId));
    dispatch(LoadMembers(groupId));
  }, [dispatch, groupId]);

  useEffect(() => {
    if (events) {
      const now = new Date();
      const sortedEvents = [...events].sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      const upcomingEvents = sortedEvents.filter(
        (event) => new Date(event.startDate) >= now
      );
      const pastEvents = sortedEvents.filter(
        (event) => new Date(event.startDate) < now
      );

      setUpcoming(upcomingEvents);
      setPast(pastEvents);
    }
  }, [events]);

  if (!eventsState) return null;

  const isOwner = user?.id == group?.organizerId;
  let isMember;
  if (group?.Members) {
    const members = Object.values(group?.Members);

    isMember =
      members.filter((member) => {
        return member.id == user.id;
      }).length > 0;
  }

  const now = new Date();
  // const upcoming = [];
  // const past = [];

  events?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  events?.forEach((event) => {
    new Date(event.startDate) < now ? past.push(event) : upcoming.push(event);
  });

  const groupPreviewImage = group?.GroupImages?.find(
    (image) => image.preview == true
  );

  return (
    <div>
      <div className="back-link">
        <span>{"<"}</span>
        <Link id="back-to-groups" to={"/groups"}>
          Factions
        </Link>
      </div>
      <section className="group-landing">
        <div>
          <img className="group-image" src={groupPreviewImage?.url} alt="" />
        </div>

        <div className="group-info">
          <div>
            <h1>{group?.name}</h1>
            <h4>
              {group?.city}, {group?.state}
            </h4>
            <h4>
              {events?.length ? events?.length : 0} Campaigns ·{" "}
              {group?.private ? "Private" : "Public"}
            </h4>
            <h4>
              Led by {group?.Organizer?.firstName} {group?.Organizer?.lastName}
            </h4>
          </div>
          <div className="group-info-buttons">
            {/* If the user is not logged in, show the "Join this Faction!" button */}
            {!user && (
              <button
                id="join-group"
                onClick={() => alert("Feature Coming Soon...")}
              >
                Join this Faction!
              </button>
            )}
            {/* If the user is logged in and not the owner and not a member, show the "Join this Faction!" button */}
            {user && !isOwner && !isMember && (
              <button
                id="join-group"
                onClick={() => alert("Feature Coming Soon...")}
              >
                Join this Faction!
              </button>
            )}
            {/* If the user is logged in and not the owner and is a member, show the "Abandon this Faction!" and "Initialize New Campaign" buttons */}
            {user && !isOwner && isMember && (
              <>
                <button
                  id="leave-group"
                  onClick={() => alert("Feature Coming Soon...")}
                >
                  Abandon this Faction!
                </button>
                <button
                  onClick={() => navigate(`/groups/${groupId}/events/new`)}
                >
                  Initialize New Campaign
                </button>
              </>
            )}
            {/* If the user is logged in and is the owner, show the "Update Faction Intel", "Delete", and "Initialize New Campaign" buttons */}
            {user && isOwner && (
              <>
                <button onClick={() => navigate(`/groups/${groupId}/edit`)}>
                  Update Faction Intel
                </button>
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteGroupModal group={group} />}
                />
                <button
                  onClick={() => navigate(`/groups/${groupId}/events/new`)}
                >
                  Initialize New Campaign
                </button>
              </>
            )}
          </div>
        </div>
      </section>
      <section className="group-events-section">
        <div className="group-events">
          <div>
            <h2>Campaign Leader</h2>
            <h4>
              {group?.Organizer?.firstName} {group?.Organizer?.lastName}
            </h4>
            <h2>What we&apos;re about</h2>
            <p>{group?.about}</p>
          </div>
          {!upcoming.length && !past.length && <h2>No Upcoming Campaigns</h2>}
          {upcoming.length != 0 && (
            <div className="upcoming-events">
              <h2>Upcoming Campaigns ({upcoming.length})</h2>
              <ul>
                {upcoming.map((event) => (
                  <EventsListItem key={event.id} eventId={event.id} />
                ))}
              </ul>
            </div>
          )}
          {past.length != 0 && (
            <div className="past-events">
              <h2>Past Campaigns ({past.length})</h2>
              <ul>
                {past.map((event) => (
                  <EventsListItem key={event.id} eventId={event.id} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FetchGroupDetails;
