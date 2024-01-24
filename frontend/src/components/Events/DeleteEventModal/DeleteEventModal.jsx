import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { DeleteEvent } from "../../../store/events";
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
    dispatch(DeleteEvent(event.id));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="delete-campaign-modal">
      <h1>Abort Campaign</h1>
      <h4>Sure you want to abort campaign? Think of the children!</h4>
      <button id="campaign-delete-yes-btn" onClick={handleDelete}>
        Abort (Delete campaign)
      </button>
      <button id="campaign-delete-no-btn" onClick={handleCancel}>
        Keep Pushing! (Keep campaign)
      </button>
    </div>
  );
};

export default DeleteEventModal;
