import { csrfFetch } from "./csrf";

// actions
const SET_GROUPS = "groups/setGroups";
const SET_GROUP_DETAILS = "groups/setGroupDetails";
const SET_GROUP_EVENTS = "groups/setGroupEvents";
const CREATE_GROUP = "groups/CREATE_GROUP";
const ADD_IMAGE = "groups/ADD_IMAGE";
const REMOVE_GROUP = "groups/REMOVE_GROUP";
const UPDATE_GROUP = "groups/UPDATE_GROUP";

// action creators
const setGroups = (groups) => ({
  type: SET_GROUPS,
  payload: groups,
});

const setGroupDetails = (groupDetails) => ({
  type: SET_GROUP_DETAILS,
  payload: groupDetails,
});

const setGroupEvents = (events) => ({
  type: SET_GROUP_EVENTS,
  payload: events,
});

const createGroup = (group) => ({
  type: CREATE_GROUP,
  group,
});

const addImage = (groupId, image) => ({
  type: ADD_IMAGE,
  groupId,
  image,
});

const removeGroup = (groupId) => ({
  type: REMOVE_GROUP,
  groupId,
});

const updateGroup = (group) => ({
  type: UPDATE_GROUP,
  group,
});

// thunk to fetch all groups
export const fetchGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");
  const data = await response.json();
  dispatch(setGroups(data.Groups));
};

// Thunk Action to fetch a single group's details
export const fetchGroupDetails = (groupId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}`);
    if (response.ok) {
      const groupDetails = await response.json();
      // console.log("🚀 ~ fetchGroupDetails ~ groupDetails:", groupDetails);
      dispatch(setGroupDetails(groupDetails));
    } else {
      throw new Error("Group details fetch failed");
    }
  } catch (error) {
    console.error("Error fetching group details:", error);
  }
};

// Thunk Action to fetch a group's events
export const fetchGroupEvents = (groupId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}/events`);
    if (response.ok) {
      const { Events } = await response.json();
      dispatch(setGroupEvents(Events));
    } else {
      throw new Error("Group events fetch failed");
    }
  } catch (error) {
    console.error("Error fetching group events:", error);
  }
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

export const thunkRemoveGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(removeGroup(groupId));
    return response.json();
  } else {
    const error = await response.json();
    return error;
  }
};

export const thunkUpdateGroup = (groupId, groupData) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupData),
  });

  if (response.ok) {
    const updatedGroup = await response.json();
    dispatch(updateGroup(updatedGroup));
    return updatedGroup;
  } else {
    const error = await response.json();
    return error;
  }
};

const initialState = {
  list: [],
  groupDetails: null,
  groupEvents: [],
};

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GROUPS:
      return { ...state, list: action.payload };
    case SET_GROUP_DETAILS:
      return { ...state, groupDetails: action.payload };
    case SET_GROUP_EVENTS:
      return { ...state, groupEvents: action.payload };
    case CREATE_GROUP: {
      const groupsState = { ...state };
      groupsState[action.group.id] = action.group;
      return groupsState;
    }
    case REMOVE_GROUP: {
      const updatedGroups = state.list.filter(
        (group) => group.id !== action.groupId
      );
      return { ...state, list: updatedGroups, groupDetails: null };
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
    case UPDATE_GROUP: {
      const updatedGroups = state.list.map((group) =>
        group.id === action.group.id ? action.group : group
      );
      return {
        ...state,
        list: updatedGroups,
        groupDetails: action.group,
      };
    }
    default:
      return state;
  }
};

export default groupsReducer;
