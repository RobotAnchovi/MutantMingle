import { useSelector } from "react-redux";
import ListGroupItem from "../ListGroupItem";
import "./ManageGroup.css";

const ManageGroup = () => {
  const user = useSelector((state) => state.session.user);
  const groupsObj = useSelector((state) => state.groups);
  const eventsObj = useSelector((state) => state.events);
  const groups = Object.values(groupsObj);
  const events = Object.values(eventsObj);

  const userGroups = [];
  groups?.forEach(async (group) => {
    if (group.organizerId == user.id) userGroups.push(group);
  });

  if (userGroups.length) {
    userGroups?.forEach((group) => {
      group.events = [];
      events?.forEach((event) => {
        if (event?.groupId == group.id) {
          group.events.push(event);
        }
      });
    });
  }

  return (
    <div className="user-factions-content">
      <h2>Manage Factions</h2>

      <h4>Your Factions in MutantMingle</h4>
      <div>
        <ul>
          {userGroups.length ? (
            userGroups?.map((group) => (
              <ListGroupItem
                group={group}
                isOwner={user.id == group.organizerId}
                isMember={user.id != group.organizerId}
                key={group.id}
              />
            ))
          ) : (
            <h2>Ah, a lone wolf...You are not aligned with any factions.</h2>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ManageGroup;
