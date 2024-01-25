// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   GroupDetails,
//   LoadGroupEvents,
//   LoadMembers,
// } from "../../../store/groups";
// import { useEffect } from "react";
// import EventsListItem from "../../Events/EventsListItem/";
// import OpenModalButton from "../../OpenModalButton";
// import DeleteGroupModal from "../DeleteGroupModal";
// import "./GroupDetails.css";

// const FetchGroupDetails = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { groupId } = useParams();
//   const user = useSelector((state) => state.session.user);
//   const group = useSelector((state) => state.groups[groupId]);
//   const eventsState = useSelector((state) => state.events);
//   const events = useSelector((state) => state.groups[groupId]?.events?.Events);
//   console.log(`GROUP_DETAILS_EVENTS: `, events);
//   console.log(`GROUP_DETAILS_GROUP_STATE: `, group);

//   useEffect(() => {
//     dispatch(GroupDetails(groupId));
//     dispatch(LoadGroupEvents(groupId));
//     dispatch(LoadMembers(groupId));
//   }, [dispatch, groupId]);

//   if (!eventsState) return null;

//   const isOrganizer = user?.id == group?.organizerId;
//   let isMember;
//   if (group?.Members) {
//     const members = Object.values(group?.Members);

//     isMember =
//       members.filter((member) => {
//         return member.id == user.id;
//       }).length > 0;
//   }

//   const now = new Date();
//   const upcoming = [];
//   const past = [];

//   events?.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

//   events?.forEach((event) => {
//     new Date(event.startDate) < now ? past.push(event) : upcoming.push(event);
//   });

//   // useEffect(() => {
//   //   if (group?.Events) {
//   //     const now = new Date();
//   //     group.Events.forEach((event) => {
//   //       const startDate = new Date(event.startDate);
//   //       if (startDate >= now) {
//   //         setUpcoming((prev) => [...prev, event]);
//   //       } else {
//   //         setPast((prev) => [...prev, event]);
//   //       }
//   //     });
//   //   }
//   // }, [group?.Events]);

//   const groupPreviewImage = group?.GroupImages?.find(
//     (image) => image.preview == true
//   );

import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupDetails } from "../../../store/groups";
import GroupEvents from "../GroupEvents";
import "./GroupDetails.css";

const GroupDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.session.user);

  const groupDetails = useSelector((state) => state.groups.groupDetails);

  useEffect(() => {
    dispatch(fetchGroupDetails(id));
  }, [dispatch, id]);

  if (!groupDetails) {
    return <div>Loading TOP-SECRET Assets...</div>;
  }

  // const events = groupDetails.events || [];

  // const upcomingEvents = events.filter(
  //   (event) => new Date(event.startDate) > new Date()
  // );

  // const pastEvents = events.filter(
  //   (event) => new Date(event.startDate) <= new Date()
  // );

  // get image url
  let imageWithPreview = groupDetails.GroupImages.find(
    (image) => image.preview === true
  );

  // Check if the user is logged in and is not the group creator
  const showJoinButton =
    currentUser && groupDetails.Organizer.id !== currentUser.id;

  // Check if the user is the group creator
  const isGroupCreator =
    currentUser && groupDetails.Organizer.id === currentUser.id;

  // Handlers for the buttons
  const handleCreateEvent = () => {
    navigate("/create-event", {
      state: { groupId: id, groupName: groupDetails.name },
    });
  };

  const handleUpdateGroup = () => {}; //!insert logic here

  const handleDeleteGroup = () => {}; //!insert logic here

  return (
    <div className="faction-detail-page">
      <nav>
        <Link to="/groups">Factions</Link>
      </nav>
      <div>
        <img
          src={
            imageWithPreview !== undefined
              ? imageWithPreview.url
              : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
          }
          alt={groupDetails.name}
        />
        <div>
          <h1>{groupDetails.name}</h1>
          <p>
            {groupDetails.city}, {groupDetails.state}
          </p>
          <p>
            {groupDetails.numEvents} Campaigns ·{" "}
            {groupDetails.private ? "Private" : "Public"}
          </p>
          <p>
            Fearlessly led by {groupDetails.Organizer.firstName}{" "}
            {groupDetails.Organizer.lastName}
          </p>
          {showJoinButton && (
            <button
              onClick={() => alert("Feature coming soon")}
              className="join-faction-button"
            >
              Align with this Faction!
            </button>
          )}
          {isGroupCreator && (
            <div className="faction-management-buttons">
              <button
                onClick={handleCreateEvent}
                className="create-campaign-button"
              >
                Initialize Campaign
              </button>
              <button
                onClick={handleUpdateGroup}
                className="update-faction-button"
              >
                Update Faction
              </button>
              <button
                onClick={handleDeleteGroup}
                className="delete-faction-button"
              >
                Delete Faction
              </button>
            </div>
          )}
        </div>
        <div>
          <h1>Led By</h1>
          <p>
            {groupDetails.Organizer.firstName} {groupDetails.Organizer.lastName}
          </p>
          <h1>What we&apos;re about</h1>
          <p>{groupDetails.about}</p>
          <h1>Campaigns ({groupDetails.numEvents})</h1>
          {<GroupEvents />}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
