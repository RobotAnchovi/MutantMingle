import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { thunkDeleteEvent } from "../../../store/events";
import "./DeleteEventModal.css";

const DeleteEventModal = ({ event }) => {
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
    <div className="delete-event-modal">
      <h1>Confirm Delete</h1>
      <h4>Are you sure you want to remove this event?</h4>
      <button id="event-delete-yes-btn" onClick={handleDelete}>
        Yes (Delete Event)
      </button>
      <button id="event-delete-no-btn" onClick={handleCancel}>
        No (Keep Event)
      </button>
    </div>
  );
};

export default DeleteEventModal;
