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
    body: JSON.stringify({ credential, password }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(loginUser(data.user));
    dispatch(LoadUserGroups()); // Load user's groups
    dispatch(LoadUserEvents()); // Load user's events
    return response;
  } else {
    const error = await response.json();
    throw error;
  }
};

export const RestoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();

  if (data.user) {
    dispatch(loginUser(data.user));
    dispatch(LoadUserGroups()); // Load user's groups
    dispatch(LoadUserEvents()); // Load user's events
  }
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

// Selector to check if user's groups are already loaded
const selectUserGroupsLoaded = (state) => !!state.session.user?.Groups;

export const LoadUserGroups = () => async (dispatch, getState) => {
  // Check if user groups are already loaded
  if (selectUserGroupsLoaded(getState())) return;

  // If not loaded, fetch the data
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

// Selector to check if user's events are already loaded
const selectUserEventsLoaded = (state) => !!state.session.user?.Events;

export const LoadUserEvents = () => async (dispatch, getState) => {
  // Check if user events are already loaded
  if (selectUserEventsLoaded(getState())) return;
  console.log("Fetching user events...");

  // If not loaded, fetch the data
  const response = await csrfFetch(`/api/events/current`);
  if (response.ok) {
    const events = await response.json();
    console.log("Received events data:", events);
    dispatch(loadUserEvents(events));
    return events;
  } else {
    const error = await response.json();
    console.error("Error fetching events:", error);
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
      // Update the Groups field of the user object
      return {
        ...state,
        user: {
          ...state.user,
          Groups: action.groups.Groups,
        },
      };
    }
    case LOAD_USER_EVENTS: {
      // Directly map owned and attending events
      return {
        ...state,
        user: {
          ...state.user,
          Events: {
            ownedEvents: action.events.ownedEvents.reduce((acc, event) => {
              acc[event.id] = event;
              return acc;
            }, {}),
            attendingEvents: action.events.attendingEvents.reduce(
              (acc, event) => {
                acc[event.id] = event;
                return acc;
              },
              {}
            ),
          },
        },
      };
    }
    default:
      return state;
  }
};

export default sessionReducer;
