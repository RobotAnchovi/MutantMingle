import { csrfFetch } from "./csrf";

export const LOGIN_USER = "session/LOGIN_USER";
export const REMOVE_USER = "session/REMOVE_USER";
export const LOAD_USER_GROUPS = "session/LOAD_USER_GROUPS";
export const LOAD_USER_EVENTS = "session/LOAD_USER_EVENTS";
export const LOAD_USER_GROUP_EVENTS = "session/LOAD_USER_GROUP_EVENTS";

export const loginUser = (user) => ({
  type: LOGIN_USER,
  user,
});

export const removeUser = () => ({
  type: REMOVE_USER,
});

export const loadUserGroups = (groups) => ({
  type: LOAD_USER_GROUPS,
  groups,
});

export const loadUserEvents = (events) => ({
  type: LOAD_USER_EVENTS,
  events,
});

export const loadUserGroupEvents = (groupId, events) => ({
  type: LOAD_USER_GROUP_EVENTS,
  groupId,
  events,
});

// Session Thunks
export const thunkLoginUser = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(loginUser(data.user));
  return response;
};

export const thunkRestoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(loginUser(data.user));
  return data;
};

export const thunkSignup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(loginUser(data.user));
  return response;
};

export const thunkLogout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  dispatch(removeUser());
  return response;
};

export const thunkLoadUserGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups/current");

  if (response.ok) {
    const groups = await response.json();
    dispatch(loadUserGroups(groups));
    return groups;
  } else {
    const error = await response.json();
    return error;
  }
};

export const thunkLoadUserEvents = () => async (dispatch) => {
  const response = await csrfFetch(`/api/events/current`);

  if (response.ok) {
    const events = await response.json();
    dispatch(loadUserEvents(events));
    return events;
  } else {
    const error = await response.json();
    return error;
  }
};

export const thunkLoadUserGroupEvents = (groupId) => async (dispatch) => {
  const response = await fetch(`/api/groups/${groupId}/events`);

  if (response.ok) {
    const events = await response.json();
    dispatch(loadUserGroupEvents(groupId, events));
    return events;
  } else {
    const error = await response.json();
    return error;
  }
};

const initialState = { user: null };
const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER: {
      return { ...state, user: action.user };
    }
    case REMOVE_USER: {
      return { ...state, user: null };
    }
    case LOAD_USER_GROUPS: {
      const Groups = {};
      action.groups.Groups.forEach((group) => {
        Groups[group.id] = group;
      });

      return {
        ...state,
        user: {
          ...state.user,
          Groups,
        },
      };
    }
    case LOAD_USER_EVENTS: {
      const ownedEvents = {};
      const attendingEvents = {};
      action.events.ownedEvents.forEach((event) => {
        ownedEvents[event.id] = event;
      });
      action.events.attendingEvents.forEach((event) => {
        attendingEvents[event.id] = event;
      });

      return {
        ...state,
        user: {
          ...state.user,
          Events: {
            ownedEvents,
            attendingEvents,
          },
        },
      };
    }
    case LOAD_USER_GROUP_EVENTS: {
      const userState = {
        ...state,
        user: {
          ...state.user,
          Groups: {
            ...state.user.Groups,
            [action.groupId]: {
              ...state.user.Groups[action.groupId],
              ...action.events,
            },
          },
        },
      };
      return userState;
    }
    default:
      return state;
  }
};

export default sessionReducer;
