import { useDispatch, useSelector } from "react-redux";
import GroupListItem from "../GroupListItem";
import "./ManageGroups.css";
import { useEffect } from "react";
import { LoadUserGroups } from "../../../store/session";
import { useNavigate } from "react-router-dom";

const ManageGroups = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);
  const userGroupsObj = useSelector((state) => state.session.user.Groups);
  let userGroups;
  if (userGroupsObj) {
    userGroups = Object.values(userGroupsObj);
  }

  const onGroupDeleted = () => {
    navigate("/groups");
  };

  useEffect(() => {
    dispatch(LoadUserGroups());
  }, [dispatch]);

  return (
    <div className="user-groups-content">
      <h2>Manage Factions</h2>

      <h4>Your Factions in MutantMingle</h4>
      <div>
        <ul>
          {userGroups?.length ? (
            userGroups?.map((group) => (
              <GroupListItem
                group={group}
                isOwner={user.id == group.organizerId}
                isMember={user.id != group.organizerId}
                key={group.id}
                onGroupDeleted={onGroupDeleted}
              />
            ))
          ) : (
            <h2>
              Ah..Lone-Wolf, I see. You aren&apos;t part of any factions yet!
            </h2>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ManageGroups;
