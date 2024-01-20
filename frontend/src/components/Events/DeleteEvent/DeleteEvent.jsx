import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { thunkDeleteEvent } from "../../../store/events";
import "./DeleteEvent.css";

const DeleteEvent = ({ event }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const group = useSelector((state) => state.groups[event.groupId]);

  const handleDelete = async (e) => {
    e.preventDefault();
    closeModal();
    navigate(`/groups/${group.id}`);
    dispatch(thunkDeleteEvent(event.id));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="delete-campaign-modal">
      <h1>Abort Campaign</h1>
      <h4>
        With great power, comes great responsibility. Are you sure you want to
        abort?
      </h4>
      <button id="campaign-delete-yea-btn" onClick={handleDelete}>
        Yes (I have failed)
      </button>
      <button id="campaign-delete-nay-btn" onClick={handleCancel}>
        No (I must continue)
      </button>
    </div>
  );
};

export default DeleteEvent;
