import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  GroupDetails,
  LoadGroupEvents,
  LoadMembers,
} from "../../../store/groups";
import { useEffect, useState } from "react";
// import EventsListItem from "../../Events/EventsListItem/";
import OpenModalButton from "../../OpenModalButton";
import DeleteGroupModal from "../DeleteGroupModal";
import "./GroupDetails.css";

const FetchGroupDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const user = useSelector((state) => state.session.user);
  const group = useSelector((state) => state.groups[groupId]);
  // const eventsState = useSelector((state) => state.events);
  let events = useSelector((state) => state.groups[groupId]?.Events);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  // useEffect(() => {
  //   dispatch(GroupDetails(groupId));
  //   dispatch(LoadGroupEvents(groupId));
  //   dispatch(LoadMembers(groupId));
  // }, [dispatch, groupId, group]);

  useEffect(() => {
    if (group?.Events) {
      const now = new Date();
      group.Events.forEach((event) => {
        const startDate = new Date(event.startDate);
        if (startDate >= now) {
          setUpcoming((prev) => [...prev, event]);
        } else {
          setPast((prev) => [...prev, event]);
        }
      });
    }
  }, [group?.Events]);

  const isOrganizer = user?.id == group?.organizerId;
  let isMember;
  if (group?.Members) {
    const members = Object.values(group?.Members);

    isMember =
      members.filter((member) => {
        return member.id == user.id;
      }).length > 0;
  }

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
            {/* If the user is logged in and not the Organizer and not a member, show the "Join this Faction!" button */}
            {user && !isOrganizer && !isMember && (
              <button
                id="join-group"
                onClick={() => alert("Feature Coming Soon...")}
              >
                Join this Faction!
              </button>
            )}
            {/* If the user is logged in and not the Organizer and is a member, show the "Abandon this Faction!" and "Initialize New Campaign" buttons */}
            {user && !isOrganizer && isMember && (
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
            {/* If the user is logged in and is the Organizer, show the "Update Faction Intel", "Delete", and "Initialize New Campaign" buttons */}
            {user && isOrganizer && (
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
                  <li key={event.id}>
                    {/* Render event details here */}
                    {event.name} -{" "}
                    {new Date(event.startDate).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {past.length != 0 && (
            <div className="past-events">
              <h2>Past Campaigns ({past.length})</h2>
              <ul>
                {past.map((event) => (
                  <li key={event.id}>
                    {/* Render event details here */}
                    {event.name} -{" "}
                    {new Date(event.startDate).toLocaleDateString()}
                  </li>
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
