import { csrfFetch } from "./csrf";
import { deleteAssociatedEvents } from "./events";

//*====> Action Type Constants <====
export const LOAD_GROUPS = "groups/LOAD_GROUPS";
export const LOAD_GROUP_DETAILS = "groups/LOAD_GROUP_DETAILS";
export const LOAD_GROUP_EVENTS = "groups/LOAD_GROUP_EVENTS";
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

export const loadGroupDetails = (group) => ({
  type: LOAD_GROUP_DETAILS,
  group,
});

export const loadGroupEvents = (groupId, events) => ({
  type: LOAD_GROUP_EVENTS,
  groupId,
  events,
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

///*====> Thunks <====
export const LoadGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");
  const groups = await response.json();
  dispatch(loadGroups(groups));
};

export const GroupDetails = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`);
  const group = await response.json();
  dispatch(loadGroupDetails(group));
  return group;
};

export const LoadGroupEvents = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`);

  if (response.ok) {
    const events = await response.json();
    dispatch(loadGroupEvents(groupId, events));
    return events;
  } else {
    const error = await response.json();
    return error;
  }
};

export const CreateGroup = (group) => async (dispatch) => {
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

export const AddImage = (groupId, image) => async (dispatch) => {
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

export const EditGroup = (groupId, group) => async (dispatch) => {
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

export const DeleteGroup = (group) => async (dispatch) => {
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

export const LoadMembers = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/members`);

  if (response.ok) {
    const members = await response.json();
    dispatch(loadMembers(groupId, members));
    return members;
  } else {
    const error = await response.json();
    return error;
  }
};

//*====> Group Reducer <====
const groupReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_GROUPS: {
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
    case LOAD_GROUP_EVENTS: {
      const groupsState = { ...state };
      groupsState[action.groupId].Events = action.events.Events;
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
