import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { thunkDeleteGroup } from "../../../store/groups";
import "./DeleteGroupModal.css";

const DeleteGroupModal = ({ group }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(thunkDeleteGroup(group));
    closeModal();
    navigate("/groups");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="delete-group-modal">
      <h1>Confirm Delete</h1>
      <h4>Are you sure you want to remove this group?</h4>
      <button id="group-delete-yes-btn" onClick={handleDelete}>
        Yes (Delete Group)
      </button>
      <button id="group-delete-no-btn" onClick={handleCancel}>
        No (Keep Group)
      </button>
    </div>
  );
};

export default DeleteGroupModal;
