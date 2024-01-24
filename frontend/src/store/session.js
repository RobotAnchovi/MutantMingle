import { csrfFetch } from "./csrf";

export const LOGIN_USER = "session/LOGIN_USER";
export const REMOVE_USER = "session/REMOVE_USER";
export const LOAD_USER_GROUPS = "session/LOAD_USER_GROUPS";
export const LOAD_USER_EVENTS = "session/LOAD_USER_EVENTS";

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

//*====> Session Thunks <====
export const LoginUser = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(loginUser(data.user));
    return response;
  } else {
    const error = await response.json();
    throw error; // Throws an error to be caught in the .catch block where the thunk is dispatched
  }
};

export const RestoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(loginUser(data.user));
  return data;
};

export const Signup = (user) => async (dispatch) => {
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
  if (response.ok) {
    const data = await response.json();
    dispatch(loginUser(data.user));
    return response;
  } else {
    const error = await response.json();
    throw error; // Throws an error to be caught in the .catch block where the thunk is dispatched
  }
};

export const Logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  dispatch(removeUser());
  return response;
};

export const LoadUserGroups = () => async (dispatch) => {
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

export const LoadUserEvents = () => async (dispatch) => {
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

//*====> Session Reducer <====
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
      return {
        ...state,
        user: {
          ...state.user,
          ...action.groups,
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
    default:
      return state;
  }
};

export default sessionReducer;
