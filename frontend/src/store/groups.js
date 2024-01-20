import { csrfFetch } from "./csrf";
import { deleteAssociatedEvents } from "./events";

//*====> Action Type Constants <====
export const LOAD_GROUPS = "groups/LOAD_GROUPS";
export const LOAD_USER_GROUPS = "groups/LOAD_USER_GROUPS";
export const LOAD_GROUP_DETAILS = "groups/LOAD_GROUP_DETAILS";
export const CREATE_GROUP = "groups/CREATE_GROUP";
export const ADD_IMAGE = "groups/ADD_IMAGE";
export const EDIT_GROUP = "groups/EDIT_GROUP";
export const DELETE_GROUP = "groups/DELETE_GROUP";
export const LOAD_MEMBERS = "groups/LOAD_MEMBERS";

//*====> Action Creators <====
export const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

export const loadUserGroups = (groups) => ({
  type: LOAD_USER_GROUPS,
  groups,
});

export const loadGroupDetails = (group) => ({
  type: LOAD_GROUP_DETAILS,
  group,
});

export const createGroup = (group) => ({
  type: CREATE_GROUP,
  group,
});

export const addImage = (groupId, image) => ({
  type: ADD_IMAGE,
  groupId,
  image,
});

export const editGroup = (groupId, group) => ({
  type: EDIT_GROUP,
  groupId,
  group,
});

export const deleteGroup = (groupId) => ({
  type: DELETE_GROUP,
  groupId,
});

export const loadMembers = (groupId, members) => ({
  type: LOAD_MEMBERS,
  groupId,
  members,
});

//*====> Thunk Action Creators <====
export const thunkLoadGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups");
  const groups = await response.json();
  dispatch(loadGroups(groups));
};

export const thunkLoadUserGroups = () => async (dispatch) => {
  const response = await fetch("/api/groups/current");
  const groups = await response.json();
  dispatch(loadUserGroups(groups));
};

export const thunkGroupDetails = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}`);
  const group = await response.json();
  dispatch(loadGroupDetails(group));
  return group;
};

export const thunkCreateGroup = (group) => async (dispatch) => {
  const response = await csrfFetch("/api/groups", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(group),
  });

  if (response.ok) {
    const group = await response.json();
    dispatch(createGroup(group));
    return group;
  } else {
    const error = await response.json();
    return error;
  }
};

export const thunkAddImage = (groupId, image) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(image),
  });

  if (response.ok) {
    const group = await response.json();
    await dispatch(addImage(groupId, image));
    return group;
  } else {
    const error = await response.json();
    return error;
  }
};

export const thunkEditGroup = (groupId, group) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(group),
  });

  if (response.ok) {
    const group = await response.json();
    dispatch(editGroup(groupId, group));
    return group;
  } else {
    const error = await response.json();
    return error;
  }
};

export const thunkDeleteGroup = (group) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${group.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const message = await response.json();
    group.events.forEach((event) => {
      dispatch(deleteAssociatedEvents(event.id));
    });
    dispatch(deleteGroup(group.id));
    return message;
  } else {
    const error = await response.json();
    return error;
  }
};

export const thunkLoadMembers = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}/members`);

  if (response.ok) {
    const members = await response.json();
    dispatch(loadMembers(groupId, members));
    return members;
  } else {
    const error = await response.json();
    return error;
  }
};

//*====> Reducers <====

const groupReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_GROUPS: {
      const groupsState = { ...state };
      action.groups.Groups.forEach((group) => {
        groupsState[group.id] = group;
      });
      return groupsState;
    }
    case LOAD_USER_GROUPS: {
      const groupsState = { ...state };
      action.groups.Groups.forEach((group) => {
        groupsState[group.id] = group;
      });
      return groupsState;
    }
    case LOAD_GROUP_DETAILS: {
      const groupsState = { ...state };
      groupsState[action.group.id] = action.group;
      return groupsState;
    }
    case CREATE_GROUP: {
      const groupsState = { ...state };
      groupsState[action.group.id] = action.group;
      return groupsState;
    }
    case ADD_IMAGE: {
      const groupsState = { ...state };
      if ("GroupImages" in groupsState[action.groupId]) {
        groupsState[action.groupId].GroupImages.push(action.image);
      } else {
        groupsState[action.groupId].GroupImages = [action.image];
      }
      return groupsState;
    }
    case EDIT_GROUP: {
      const groupsState = { ...state };
      groupsState[action.groupId] = {
        ...groupsState[action.groupId],
        ...action.group,
      };
      return groupsState;
    }
    case DELETE_GROUP: {
      const groupsState = { ...state };
      delete groupsState[action.groupId];
      return groupsState;
    }
    default:
      return state;
  }
};

export default groupReducer;
