// import { csrfFetch } from "./csrf";

// //*====> Action Type Constants <====
// export const LOAD_EVENTS = "events/LOAD_EVENTS";
// export const LOAD_EVENT_DETAILS = "events/LOAD_EVENT_DETAILS";
// export const CREATE_EVENT = "events/CREATE_EVENT";
// export const UPDATE_EVENT = "events/UPDATE_EVENT";
// export const ADD_EVENT_IMAGE = "events/ADD_EVENT_IMAGE";
// export const DELETE_EVENT = "events/DELETE_EVENT";
// export const DELETE_ASSOCIATED_EVENTS = "events/DELETE_ASSOCIATED_EVENTS";

// //*====> Action Creators <====
// export const loadEvents = (events) => ({
//   type: LOAD_EVENTS,
//   events,
// });

// export const loadEventDetails = (event) => ({
//   type: LOAD_EVENT_DETAILS,
//   event,
// });

// export const createEvent = (event) => ({
//   type: CREATE_EVENT,
//   event,
// });

// export const updateEvent = (eventId, event) => ({
//   type: UPDATE_EVENT,
//   eventId,
//   event,
// });

// export const addEventImage = (eventId, image) => ({
//   type: ADD_EVENT_IMAGE,
//   eventId,
//   image,
// });

// export const deleteEvent = (eventId) => ({
//   type: DELETE_EVENT,
//   eventId,
// });

// export const deleteAssociatedEvents = (eventId) => ({
//   type: DELETE_ASSOCIATED_EVENTS,
//   eventId,
// });

// //*====> Thunks <====

// //~ Date Formatter

// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1; // getMonth() returns 0-11
//   const day = date.getDate();
//   //~ Time
//   const hours = date.getHours();
//   const minutes = date.getMinutes();
//   // const seconds = date.getSeconds();

//   const formattedDate = `${month.toString().padStart(2, "0")}-${day
//     .toString()
//     .padStart(2, "0")}-${year}`;
//   const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
//     .toString()
//     .padStart(2, "0")}`;

//   return `${formattedDate} ${formattedTime}`;
// };

// export const LoadEvents = () => async (dispatch, getState) => {
//   // Get the current state of events
//   const currentEvents = getState().events;

//   // Check if events are already loaded
//   if (Object.keys(currentEvents).length > 0) {
//     console.log("Events already loaded, skipping fetch");
//     return;
//   }

//   const response = await csrfFetch("/api/events");
//   const { Events } = await response.json();
//   const formattedEvents = Events.map((event) => ({
//     ...event,
//     startDate: formatDate(event.startDate),
//     endDate: formatDate(event.endDate),
//   }));

//   dispatch(loadEvents(formattedEvents));
// };

// export const EventDetails = (eventId) => async (dispatch, getState) => {
//   // Check if the event details are already loaded
//   const currentEvent = getState().events[eventId];
//   if (currentEvent && currentEvent.detailsLoaded) {
//     console.log(`Details for event ${eventId} are already loaded.`);
//     return;
//   }

//   const response = await csrfFetch(`/api/events/${eventId}`);
//   if (response.ok) {
//     const event = await response.json();
//     // Apply the formatting to the event dates
//     const formattedEvent = {
//       ...event,
//       startDate: formatDate(event.startDate),
//       endDate: formatDate(event.endDate),
//       detailsLoaded: true, // Mark the event as loaded
//     };

//     dispatch(loadEventDetails(formattedEvent));
//   } else {
//     // Handle error response
//     const error = await response.json();
//     console.error(`Error fetching event details: ${error.message}`);
//   }
// };

// export const CreateEvent = (groupId, event) => async (dispatch) => {
//   const response = await csrfFetch(`/api/groups/${groupId}/events`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(event),
//   });

//   if (response.ok) {
//     const event = await response.json();
//     dispatch(createEvent(event));
//     return event;
//   } else {
//     const error = await response.json();
//     return error;
//   }
// };

// export const UpdateEvent = (eventId, event) => async (dispatch) => {
//   const response = await csrfFetch(`/api/events/${eventId}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(event),
//   });

//   if (response.ok) {
//     const event = await response.json();
//     dispatch(updateEvent(eventId, event));
//     return event;
//   } else {
//     const error = await response.json();
//     return error;
//   }
// };

// export const AddEventImage = (eventId, image) => async (dispatch) => {
//   const response = await csrfFetch(`/api/events/${eventId}/images`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(image),
//   });

//   if (response.ok) {
//     const group = await response.json();
//     await dispatch(addEventImage(eventId, image));
//     return group;
//   } else {
//     const error = await response.json();
//     return error;
//   }
// };

// export const DeleteEvent = (eventId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/events/${eventId}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (response.ok) {
//     const message = await response.json();
//     dispatch(deleteEvent(eventId));
//     return message;
//   } else {
//     const error = await response.json();
//     return error;
//   }
// };

// //*====> Reducer <====
// const eventReducer = (state = {}, action) => {
//   switch (action.type) {
//     case LOAD_EVENTS: {
//       const eventsState = { ...state };
//       action.events.forEach((event) => {
//         if (!eventsState[event.id]) {
//           eventsState[event.id] = event;
//         }
//       });
//       return eventsState;
//     }
//     case LOAD_EVENT_DETAILS: {
//       const eventsState = { ...state };
//       eventsState[action.event.id] = action.event;
//       return eventsState;
//     }
//     case CREATE_EVENT: {
//       const eventsState = { ...state };
//       eventsState[action.event.id] = action.event;
//       return eventsState;
//     }
//     case UPDATE_EVENT: {
//       const eventsState = { ...state };
//       eventsState[action.eventId] = {
//         ...eventsState[action.eventId],
//         ...action.event,
//       };
//       return eventsState;
//     }
//     case ADD_EVENT_IMAGE: {
//       const eventsState = { ...state };
//       const newArr = [action.image];
//       eventsState[action.eventId].EventImages = newArr;
//       return eventsState;
//     }
//     case DELETE_EVENT: {
//       const eventsState = { ...state };
//       delete eventsState[action.eventId];
//       return eventsState;
//     }
//     case DELETE_ASSOCIATED_EVENTS: {
//       const eventsState = { ...state };
//       delete eventsState[action.eventId];
//       return eventsState;
//     }
//     default:
//       return state;
//   }
// };

// export default eventReducer;

import { csrfFetch } from "./csrf";

// Action types
const SET_EVENTS = "events/setEvents";
const SET_EVENT_DETAILS = "events/setEventDetails";
const CREATE_EVENT = "events/CREATE_EVENT";
const ADD_EVENT_IMAGE = "events/ADD_EVENT_IMAGE";
const REMOVE_EVENT = "events/REMOVE_EVENT";

// Action creator for setting events
const setEvents = (events) => ({
  type: SET_EVENTS,
  payload: events,
});

const setEventDetails = (eventDetails) => ({
  type: SET_EVENT_DETAILS,
  payload: eventDetails,
});

const createEvent = (event) => ({
  type: CREATE_EVENT,
  event,
});

const addEventImage = (eventId, image) => ({
  type: ADD_EVENT_IMAGE,
  eventId,
  image,
});

const removeEvent = (eventId) => ({
  type: REMOVE_EVENT,
  eventId,
});

// Thunk action for fetching events
export const fetchEvents = () => async (dispatch) => {
  const response = await csrfFetch("/api/events");
  const data = await response.json();
  dispatch(setEvents(data.Events));
};

export const fetchEventDetails = (eventId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/events/${eventId}`);
    if (response.ok) {
      const eventDetails = await response.json();
      dispatch(setEventDetails(eventDetails));
    } else {
      throw new Error("Event details fetch failed");
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
    // Optionally, you can dispatch an error action here if you have error handling in your state
  }
};

export const thunkCreateEvent = (groupId, event) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (response.ok) {
    const event = await response.json();
    dispatch(createEvent(event));
    return event;
  } else {
    const error = await response.json();
    return error;
  }
};

export const thunkAddEventImage = (eventId, image) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(image),
  });

  if (response.ok) {
    const imageData = await response.json();
    dispatch(addEventImage(eventId, imageData));
    return imageData;
  } else {
    const error = await response.json();
    return error;
  }
};

export const thunkRemoveEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(removeEvent(eventId));
    return response.json(); // You can also handle success message here
  } else {
    const error = await response.json();
    return error;
  }
};

// Initial state
const initialState = {
  list: [],
  eventDetails: {},
};

// Reducer
const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EVENTS:
      return { ...state, list: action.payload };
    case SET_EVENT_DETAILS:
      return { ...state, eventDetails: action.payload };
    case CREATE_EVENT: {
      const eventsState = { ...state };
      eventsState.list.push(action.event);
      return eventsState;
    }
    case REMOVE_EVENT: {
      const updatedEvents = state.list.filter(
        (event) => event.id !== action.eventId
      );
      return { ...state, list: updatedEvents, eventDetails: {} };
    }
    case ADD_EVENT_IMAGE: {
      const eventsState = { ...state };
      const event = eventsState.list.find((e) => e.id === action.eventId);
      if (event) {
        if ("EventImages" in event) {
          event.EventImages.push(action.image);
        } else {
          event.EventImages = [action.image];
        }
      }
      return eventsState;
    }
    default:
      return state;
  }
};

export default eventsReducer;
