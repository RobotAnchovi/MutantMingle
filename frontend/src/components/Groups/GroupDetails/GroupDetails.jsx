import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupDetails, thunkRemoveGroup } from "../../../store/groups";
import GroupEvents from "../GroupEvents";
import "./GroupDetails.css";

const GroupDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.session?.user);

  const groupDetails = useSelector((state) => state.groups?.groupDetails);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
  let imageWithPreview = groupDetails.GroupImages?.find(
    (image) => image.preview === true
  );

  // Check if the user is logged in and is not the group creator
  const showJoinButton =
    currentUser && groupDetails.Organizer?.id !== currentUser.id;

  // Check if the user is the group creator
  const isGroupCreator =
    currentUser && groupDetails.Organizer?.id === currentUser.id;

  // Handlers for the buttons
  const handleCreateEvent = () => {
    navigate("/create-event", {
      state: { groupId: id, groupName: groupDetails.name },
    });
  };

  const handleUpdateGroup = () => {
    navigate(`/edit-group`, {
      state: {
        groupId: id,
        userId: groupDetails.organizerId,
        groupName: groupDetails.name,
        groupCity: groupDetails.city,
        groupState: groupDetails.state,
        groupAbout: groupDetails.about,
        groupType: groupDetails.type,
        groupPrivate: groupDetails.private,
      },
    });
  };
  const handleDeleteGroup = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    const result = await dispatch(thunkRemoveGroup(groupDetails.id));
    if (result.message === "Successfully deleted") {
      navigate(`/groups`);
    } else {
      // Handle error
    }
  };

  return (
    <div>
      <nav>
        <Link to="/groups">Back to Factions</Link>
      </nav>
      <div className="faction-detail-page">
        <div className="faction-deets-upper">
          <div className="faction-image">
            <img
              src={
                imageWithPreview !== undefined
                  ? imageWithPreview.url
                  : "https://cdn.vectorstock.com/i/preview-1x/65/30/default-image-icon-missing-picture-page-vector-40546530.jpg"
              }
              alt={groupDetails.name}
            />
          </div>
          <div className="faction-deets-top">
            <h1>{groupDetails.name}</h1>
            <p>
              {groupDetails.city}, {groupDetails.state}
            </p>
            <p>
              {groupDetails.numEvents} Campaigns ·{" "}
              {groupDetails.private ? "Private" : "Public"}
            </p>
            <p>
              Fearlessly led by {groupDetails.Organizer?.firstName}{" "}
              {groupDetails.Organizer?.lastName}
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
                {showDeleteConfirmation && (
                  <div className="modal-backdrop">
                    <div className="confirmation-modal">
                      <p>Are you sure you want to delete this group?</p>
                      <button onClick={handleConfirmDelete} className="red">
                        Yes, delete this faction!
                      </button>
                      <button onClick={() => setShowDeleteConfirmation(false)}>
                        No, I&apos;ll stay strong.
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="faction-deets-lower">
            <h1>Fearlessly Led By</h1>
            <p>
              {groupDetails.Organizer?.firstName}{" "}
              {groupDetails.Organizer?.lastName}
            </p>
            <h1>What we&apos;re about</h1>
            <p>{groupDetails.about}</p>
            <h1 className="faction-events-section">
              Campaigns ({groupDetails.numEvents})
            </h1>
            <div className="faction-events">{<GroupEvents />}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
