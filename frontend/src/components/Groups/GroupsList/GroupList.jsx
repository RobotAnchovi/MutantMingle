import { useDispatch, useSelector } from "react-redux";
import GroupListItem from "../GroupListItem/GroupListItem";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { LoadGroups /*LoadGroupEvents*/ } from "../../../store/groups";
import "./GroupList.css";

const GroupList = () => {
  const dispatch = useDispatch();
  const groupsObj = useSelector((state) => state.groups);
  const eventsObj = useSelector((state) => state.events);
  // const groups = Object.values(groupsObj);
  // const events = Object.values(eventsObj);

  // if (groups.length) {
  //   groups?.forEach((group) => {
  //     group.events = [];
  //     events?.forEach((event) => {
  //       if (event?.groupId == group.id) {
  //         group.events.push(event);
  //       }
  //     });
  //   });
  // }

  useEffect(() => {
    dispatch(LoadGroups());
    // dispatch(LoadEvents());
  }, [dispatch]);

  const groups = Object.values(groupsObj);
  const events = Object.values(eventsObj);
  console.log(`GROUPS: `, groups);
  console.log(`EVENTS: `, events);

  return (
    <div className="group-list-page">
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
      <section>
        <ul className="group-list">
          {groups.map((group) => {
            //^ Filter events for this group
            const groupEvents = events.filter(
              (event) => event.groupId === group.id
            );
            return (
              <GroupListItem
                key={group.id}
                group={group}
                groupEvents={groupEvents}
                // Pass other necessary props like isOwner, isMember if needed
              />
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default GroupList;
