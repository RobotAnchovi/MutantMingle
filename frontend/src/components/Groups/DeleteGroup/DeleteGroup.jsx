import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../context/Modal";
import { thunkDeleteGroup } from "../../../store/groups";
import "./DeleteGroup.css";

const DeleteGroup = ({ group }) => {
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
      <h1>Confirm Disband</h1>
      <h4>Are you sure you want to disband? Think of the children!</h4>
      <button id="faction-delete-yea-btn" onClick={handleDelete}>
        Yea (Disband Faction)
      </button>
      <button id="faction-delete-nay-btn" onClick={handleCancel}>
        Nay (Maintain Faction for the children)
      </button>
    </div>
  );
};

export default DeleteGroup;
