import { useSelector } from "react-redux";
import GroupListItem from "../GroupListItem";
import "./ManageGroups.css";

const ManageGroups = () => {
  const user = useSelector((state) => state.session.user);
  const userGroupsObj = useSelector((state) => state.session.user.Groups);
  let userGroups;
  if (userGroupsObj) {
    userGroups = Object.values(userGroupsObj);
  }

  return (
    <div className="user-groups-content">
      <h2>Manage Groups</h2>

      <h4>Your groups in MutantMingle</h4>
      <div>
        <ul>
          {userGroups?.length ? (
            userGroups?.map((group) => (
              <GroupListItem
                group={group}
                isOwner={user.id == group.organizerId}
                isMember={user.id != group.organizerId}
                key={group.id}
              />
            ))
          ) : (
            <h2>You are not part of any groups yet!</h2>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ManageGroups;
