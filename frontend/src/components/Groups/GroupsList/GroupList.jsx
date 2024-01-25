import { useDispatch, useSelector } from "react-redux";
// import GroupListItem from "../GroupListItem/GroupListItem";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { fetchGroups } from "../../../store/groups";
import "./GroupList.css";

const GroupList = () => {
  const dispatch = useDispatch();

  const groups = useSelector((state) => state.groups.list);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);
  // const groupsObj = useSelector((state) => state.groups);
  // const eventsObj = useSelector((state) => state.events);
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

  // useEffect(() => {
  //   dispatch(LoadGroups());
  //   // dispatch(LoadEvents());
  // }, [dispatch]);

  // const groups = Object.values(groupsObj);
  // const events = Object.values(eventsObj);
  // console.log(`GROUPS: `, groups);
  // console.log(`EVENTS: `, events);

  return (
    <div className="faction-list-page">
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
        {groups.map((group) => (
          <a
            href={`/groups/${group.id}`}
            key={group.id}
            className="faction-container"
          >
            <div>
              <img
                src={
                  group.previewImage !== "No preview image found."
                    ? group.previewImage
                    : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
                }
                alt={group.name}
              />
              <div>
                <h2>{group.name}</h2>
                <p>
                  {group.city}, {group.state}
                </p>
                <p>{group.about}</p>
                <p>
                  {group.numEvents} Campaigns ·{" "}
                  {group.private ? "Private" : "Public"}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
