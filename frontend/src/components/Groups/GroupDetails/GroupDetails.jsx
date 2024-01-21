import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { thunkGroupDetails } from "../../../store/groups";
import { useEffect } from "react";
import EventItem from "../../Events/EventItem";
import OpenModalButton from "../../OpenModalButton";
import DeleteGroup from "../DeleteGroup";

import "./GroupDetails.css";

const GroupDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const user = useSelector((state) => state.session.user);
  const group = useSelector((state) => state.groups[groupId]);
  const eventsObj = useSelector((state) => state.events);
  let events = Object.values(eventsObj);
  const now = new Date();

  useEffect(() => {
    dispatch(thunkGroupDetails(groupId));
  }, [dispatch, groupId]);

  useEffect(() => {
    if (!group) {
      navigate("*");
    }
  }, [group, navigate]);

  events = events.filter((event) => event.groupId == groupId);

  const upcoming = [];
  const past = [];

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
        <Link id="back-to-factions" to={"/groups"}>
          Factions
        </Link>
      </div>
      <section className="faction-landing">
        <div>
          <img className="faction-image" src={groupPreviewImage?.url} alt="" />
        </div>

        <div className="faction-info">
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
          <div className="faction-info-buttons">
            {user && user?.id !== group?.organizerId && (
              <button
                id="join-faction"
                onClick={() =>
                  alert("This faction is not currently recruiting")
                }
              >
                Align with this Faction
              </button>
            )}
            {user?.id == group?.organizerId && (
              <button onClick={() => navigate(`/groups/${groupId}/events/new`)}>
                Launch Campaign!
              </button>
            )}
            {user?.id == group?.organizerId && (
              <button onClick={() => navigate(`/groups/${groupId}/edit`)}>
                Update Intel
              </button>
            )}
            {user?.id == group?.organizerId && (
              <OpenModalButton
                buttonText="Delete"
                modalComponent={<DeleteGroup group={group} />}
              />
            )}
          </div>
        </div>
      </section>
      <section className="faction-campaigns-section">
        <div className="faction-campaigns">
          <div>
            <h2>Leader</h2>
            <h4>
              {group?.Organizer?.firstName} {group?.Organizer?.lastName}
            </h4>
            <h2>Our Origin Story and Purpose</h2>
            <p>{group?.about}</p>
          </div>
          {!upcoming.length && !past.length && <h2>No Upcoming Campaigns</h2>}
          {upcoming.length != 0 && (
            <div className="upcoming-campaigns">
              <h2>Upcoming Campaigns ({upcoming.length})</h2>
              <ul>
                {upcoming.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </ul>
            </div>
          )}
          {past.length != 0 && (
            <div className="past-campaigns">
              <h2>Past Campaigns ({past.length})</h2>
              <ul>
                {past.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GroupDetails;
