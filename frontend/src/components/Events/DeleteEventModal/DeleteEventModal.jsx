import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { DeleteEvent } from "../../../store/events";
import "./DeleteEventModal.css";

const DeleteEventModal = ({ event, onEventDeleted }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(DeleteEvent(event.id));
    closeModal();
    // navigate(`/groups/${group.id}`);
    onEventDeleted();
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
        Abort Campaign (Delete campaign)
      </button>
      <button id="campaign-delete-no-btn" onClick={handleCancel}>
        Keep Pushing! (Keep campaign)
      </button>
    </div>
  );
};

export default DeleteEventModal;
