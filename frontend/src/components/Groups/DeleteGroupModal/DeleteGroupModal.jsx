import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { DeleteGroup } from "../../../store/groups";
import "./DeleteGroupModal.css";

const DeleteGroupModal = ({ group, onGroupDeleted }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(DeleteGroup(group));
    closeModal();
    onGroupDeleted();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="delete-group-modal">
      <h1>Confirm Delete</h1>
      <h4>
        Are you sure you want to remove this faction? Think of the children!
      </h4>
      <button id="group-delete-yes-btn" onClick={handleDelete}>
        Yes, I&apos;m ashamed (Delete Faction)
      </button>
      <button id="group-delete-no-btn" onClick={handleCancel}>
        No, I must fight on! (Keep Faction)
      </button>
    </div>
  );
};

export default DeleteGroupModal;
