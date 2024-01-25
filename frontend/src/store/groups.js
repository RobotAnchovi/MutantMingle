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
export const LoadGroups = () => async (dispatch, getState) => {
  // Access the current state
  const currentState = getState();

  // Check if the groups data is already loaded
  const groupsAlreadyLoaded =
    currentState.groups && Object.keys(currentState.groups).length > 0;

  if (groupsAlreadyLoaded) {
    // If groups data is already in the state, skip fetching and return the existing data
    return currentState.groups;
  }

  // If groups data is not in the state, proceed with the fetch call
  const response = await csrfFetch("/api/groups");

  if (response.ok) {
    const groups = await response.json();
    dispatch(loadGroups(groups));
    return groups;
  } else {
    // Handle error case
    const error = await response.json();
    return error;
  }
};

export const GroupDetails = (groupId) => async (dispatch, getState) => {
  // Access the current state
  const currentState = getState();

  // Check if the specific group's details are already loaded
  const groupAlreadyLoaded =
    currentState.groups[groupId] && currentState.groups[groupId].details;

  if (groupAlreadyLoaded) {
    // If group details are already in the state for this group, skip fetching and return the existing data
    return currentState.groups[groupId].details;
  }

  // If group details are not in the state for this group, proceed with the fetch call
  const response = await csrfFetch(`/api/groups/${groupId}`);

  if (response.ok) {
    const group = await response.json();
    dispatch(loadGroupDetails(group));
    return group;
  } else {
    // Handle error case
    const error = await response.json();
    return error;
  }
};

export const LoadGroupEvents = (groupId) => async (dispatch, getState) => {
  // Access the current state
  const currentState = getState();

  // Check if the specific group's events are already loaded
  const eventsAlreadyLoaded =
    currentState.groups[groupId] &&
    currentState.groups[groupId].Events &&
    currentState.groups[groupId].Events.length > 0;

  if (eventsAlreadyLoaded) {
    // If events data is already in the state for this group, skip fetching and return the existing data
    return currentState.groups[groupId].Events;
  }

  // If events data is not in the state for this group, proceed with the fetch call
  const response = await csrfFetch(`/api/groups/${groupId}/events`);

  if (response.ok) {
    const events = await response.json();
    console.log("Fetched Events: ", events);
    dispatch(loadGroupEvents(groupId, events));
    return events;
  } else {
    // Handle error case
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
    const newGroup = await response.json();
    dispatch(createGroup(newGroup));
    return newGroup;
  } else {
    // Handling server-side validation errors or other errors
    const error = await response.json();
    if (error && error.errors) {
      // Assuming the server sends back an object with a key `errors` containing the validation messages
      throw new Error(error.errors.join(", "));
    }
    return Promise.reject(error);
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
    const updatedGroup = await response.json();
    dispatch(addImage(groupId, updatedGroup)); // Assuming updatedGroup contains the updated group data including new images
    return updatedGroup;
  } else {
    // Handling server-side validation errors or other errors
    const error = await response.json();
    if (error && error.errors) {
      // If the server sends back an object with a key `errors` containing validation messages
      throw new Error(error.errors.join(", "));
    }
    return Promise.reject(error);
  }
};

export const EditGroup = (groupId, groupData) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(groupData),
  });

  if (response.ok) {
    const updatedGroup = await response.json();
    dispatch(editGroup(groupId, updatedGroup)); // Update the group data in the Redux store
    return updatedGroup;
  } else {
    // Handling server-side validation errors or other errors
    const error = await response.json();
    if (error && error.errors) {
      // If the server sends back an object with a key `errors` containing validation messages
      throw new Error(error.errors.join(", "));
    }
    return Promise.reject(error);
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

    // Check if group.events is defined and is an array before iterating
    if (Array.isArray(group.events)) {
      group.events.forEach((event) => {
        dispatch(deleteAssociatedEvents(event.id));
      });
    }

    dispatch(deleteGroup(group.id));
    return message;
  } else {
    const error = await response.json();
    return error;
  }
};

export const LoadMembers = (groupId) => async (dispatch, getState) => {
  // Access the current state
  const currentState = getState();

  // Check if the members for the specified group are already loaded
  const membersAlreadyLoaded = currentState.groups[groupId]?.members;

  if (membersAlreadyLoaded) {
    // If members data is already in the state, skip fetching and return the existing data
    return membersAlreadyLoaded;
  }

  // If members data is not in the state, proceed with the fetch call
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
    case LOAD_GROUPS:
      return action.groups.Groups.reduce(
        (acc, group) => ({ ...acc, [group.id]: group }),
        { ...state }
      );

    case LOAD_GROUP_DETAILS:
    case CREATE_GROUP:
    case EDIT_GROUP:
      return {
        ...state,
        [action.group.id]: action.group,
      };

    case LOAD_GROUP_EVENTS:
      if (state[action.groupId]) {
        return {
          ...state,
          [action.groupId]: {
            ...state[action.groupId],
            Events: action.events.Events,
          },
        };
      }
      console.error(`Group with id ${action.groupId} not found.`);
      return state;

    case ADD_IMAGE: {
      const groupImages = state[action.groupId]?.GroupImages || [];
      return {
        ...state,
        [action.groupId]: {
          ...state[action.groupId],
          GroupImages: [...groupImages, action.image],
        },
      };
    }

    case DELETE_GROUP: {
      const newState = { ...state };
      delete newState[action.groupId];
      return newState;
    }
    default:
      return state;
  }
};

export default groupReducer;
