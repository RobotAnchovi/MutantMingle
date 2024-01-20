import { Link, useNavigate } from "react-router-dom";
import OpenModalButton from "../../OpenModalButton";
import DeleteGroup from "../DeleteGroup";
import "./GroupList.css";

const ListGroupItem = ({ group, isOwner, isMember }) => {
  const navigate = useNavigate();

  return (
    <li>
      <Link to={`/groups/${group.id}`}>
        <div className="faction-list-item">
          <div className="faction-list-image-div">
            <img
              className="faction-list-image"
              src={group.previewImage || group.GroupImages[0].url}
              alt=""
            />
          </div>
          <div className="faction-list-info">
            <h2>{group.name}</h2>
            <h4>
              {group.city}, {group.state}
            </h4>
            <p>{group.about}</p>
            <div className="faction-list-item-lowest-container">
              <div className="faction-campaigns-type-container">
                <span>{group.events?.length} Campaigns</span>
                <span> · </span>
                <span>{group.private ? "Private" : "Public"}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="faction-management-btn-container">
        {isOwner && (
          <button onClick={() => navigate(`/groups/${group.id}/edit`)}>
            Update
          </button>
        )}
        {isOwner && (
          <OpenModalButton
            buttonText="Delete"
            modalComponent={<DeleteGroup group={group} />}
          />
        )}
        {isMember && (
          <button
            id="leave-faction-btn"
            onClick={() => alert("There is no escaping this faction yet...")}
          >
            Leave this Faction
          </button>
        )}
      </div>
    </li>
  );
};

export default ListGroupItem;
