import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";
import { sortAscFuture, sortDescPast } from "../converters/dateOrganizer";

//*====> Action Type Constants <====
export const LOAD_GROUPS = "groups/LOAD_GROUPS";
export const LOAD_GROUP_DETAILS = "groups/LOAD_GROUP_DETAILS";
// export const LOAD_GROUP_EVENTS = "groups/LOAD_GROUP_EVENTS"; //~ Refactoring, may not need this
export const CREATE_GROUP = "groups/CREATE_GROUP";
// export const ADD_IMAGE = "groups/ADD_IMAGE"; //! I don't think this is needed
// export const EDIT_GROUP = "groups/EDIT_GROUP"; //!Will tackle once everything else works
export const DELETE_GROUP = "groups/DELETE_GROUP";
// export const LOAD_MEMBERS = "groups/LOAD_MEMBERS"; //!Will tackle once everything else works

//*====> Action Creators <====
export const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

export const loadGroupDetails = (group) => ({
  type: LOAD_GROUP_DETAILS,
  group,
});

// export const loadGroupEvents = (groupId, events) => ({ //~Relocating
//   type: LOAD_GROUP_EVENTS,
//   groupId,
//   events,
// });

export const createGroup = (group) => ({
  type: CREATE_GROUP,
  group,
});

// export const addImage = (groupId, image) => ({ //? Not sure what I'm doing with this yet
//   type: ADD_IMAGE,
//   groupId,
//   image,
// });

// export const editGroup = (groupId, group) => ({ //! Tackling this later
//   type: EDIT_GROUP,
//   groupId,
//   group,
// });

export const deleteGroup = (groupId) => ({
  type: DELETE_GROUP,
  groupId,
});

// export const loadMembers = (groupId, members) => ({ //! Tackling this later
//   type: LOAD_MEMBERS,
//   groupId,
//   members,
// });

///*====> Thunks <====
export const thunkLoadGroups = () => async (dispatch) => {
  //~ Refactored to include number of events
  const response = await csrfFetch("/api/groups");
  if (response.ok) {
    const groups = await response.json();

    for (let i = 0; i < groups.Groups.length; i++) {
      const group = groups.Groups[i];

      const response = await csrfFetch(`/api/groups/${group.id}/events`);
      if (response.ok) {
        const events = await response.json();
        group.numberEvents = events.Events.length;
      }
    }

    dispatch(loadGroups(groups.Groups));
  }
};

//~ Refactored
export const thunkGroupDetails = (groupId) => async (dispatch) => {
  const responseInit = await csrfFetch(`/api/groups/${groupId}`);

  if (responseInit.ok) {
    const group = await responseInit.json();
    const image = group.GroupImages.find((image) => image.preview);
    if (image) {
      group.previewImage = image.url;
      group.previewImageId = image.id;
    } else {
      group.previewImage = "TopSecret: No Image Found";
    }
    const responseSec = await csrfFetch(`/api/groups/${groupId}/events`);
    if (responseSec.ok) {
      const events = await responseSec.json();

      const eventDetails = [];
      for (let i = 0; i < events.Events.length; i++) {
        const event = events.Events[i];
        const responseThd = await csrfFetch(`/api/events/${event.id}`);

        if (responseThd.ok) {
          const eventDetail = await responseThd.json();
          eventDetail.previewImage = event.previewImage;
          eventDetails.push(eventDetail);
        }
      }
      group.numberEvents = eventDetails.length;
      group.futureEvents = sortAscFuture(eventDetails);
      group.pastEvents = sortDescPast(eventDetails);
    }

    dispatch(loadGroupDetails(group));
  }
};

// export const thunkLoadGroupEvents = (groupId) => async (dispatch) => { //!This may not be necessary
//   const response = await fetch(`/api/groups/${groupId}/events`);

//   if (response.ok) {
//     const events = await response.json();
//     dispatch(loadGroupEvents(groupId, events));
//     return events;
//   } else {
//     const error = await response.json();
//     return error;
//   }
// };

//~ Refactored
export const thunkCreateGroup = (payload) => async (dispatch) => {
  const responseInit = await csrfFetch("/api/groups", {
    method: "POST",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    body: JSON.stringify({ ...payload }),
  });

  const grpData = await responseInit.json();
  if (!responseInit.ok)
    return grpData.Data.errors ? grpData : { errors: grpData };

  const responseSec = await csrfFetch(`/api/groups/${grpData.id}/events`);
  if (!responseSec.ok) {
    const events = await responseSec.json();
    grpData.numberEvents = events.Events.length;
  }
  if (payload.image) {
    const responseThd = await csrfFetch(`/api/groups/${grpData.id}/images`, {
      method: "POST",
      body: JSON.stringify({
        url: payload.image,
        preview: true,
      }),
    });
    if (!responseThd.ok) {
      const image = await responseThd.json();
      grpData.previewImage = image.url;
      grpData.previewImageId = image.id;
    }
  }
  dispatch(createGroup(grpData));
  return grpData;
};

// export const thunkAddImage = (groupId, image) => async (dispatch) => { //!Not sure what I'm doing with this yet
//   const response = await csrfFetch(`/api/groups/${groupId}/images`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(image),
//   });

//   if (response.ok) {
//     const group = await response.json();
//     await dispatch(addImage(groupId, image));
//     return group;
//   } else {
//     const error = await response.json();
//     return error;
//   }
// };

//~ Refactored
export const thunkEditGroup = (payload, groupId) => async (dispatch) => {
  const response1st = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    body: JSON.stringify({
      ...payload,
    }),
  });
  const grpData = await response1st.json();
  if (response1st.ok)
    return grpData.Data.errors ? grpData : { errors: grpData };

  const response2nd = await csrfFetch(`/api/groups/${groupId}/events`);
  if (!response2nd.ok) {
    const events = await response2nd.json();
    grpData.numberEvents = events.Events.length;
  }
  if (payload.image) {
    let response3rd, url, method;
    if (payload.imageId) {
      url = `/api/group-images/${payload.imageId}`;
      method = "PUT";
    } else {
      url = `/api/groups/${groupId}/images`;
      method = "POST";
    }
    response3rd = await csrfFetch(url, {
      method,
      body: JSON.stringify({
        url: payload.image,
        preview: true,
      }),
    });
    if (response3rd.ok) {
      const image = await response3rd.json();
      grpData.previewImage = image.url;
      grpData.previewImageId = image.id;
    }
  }
  dispatch(createGroup(grpData));
  return grpData;
};

//~ Refactored
export const thunkDeleteGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(deleteGroup(groupId));
    return data;
  }
};

export const thunkLoadUserGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups/current");

  if (response.ok) {
    const groups = await response.json();

    for (let i = 0; i < groups.Groups.length; i++) {
      const group = groups.Groups[i];

      const response = await csrfFetch(`/api/groups/${group.id}/events`);
      if (response.ok) {
        const events = await response.json();
        group.numberEvents = events.Events.length;
      }
    }
    dispatch(loadGroups(groups.Groups));
  }
};

// export const thunkLoadMembers = (groupId) => async (dispatch) => { //! Tackling this later...maybe.
//   const response = await fetch(`/api/groups/${groupId}/members`);

//   if (response.ok) {
//     const members = await response.json();
//     dispatch(loadMembers(groupId, members));
//     return members;
//   } else {
//     const error = await response.json();
//     return error;
//   }
// };

//~ Experimental Custom Selectors
export const getGroups = createSelector(
  (state) => state.group.groups,
  (groups) => Object.values(groups)
);

export const getGroupById = (groupId) =>
  createSelector(
    (state) => state.group.groupDetails,
    (groups) => (groups ? groups[groupId] : {})
  );

//~ Refactored
//*====> Group Reducer <====
const initialState = { groups: {}, groupDetails: {} };

function groupReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_GROUPS:
      return {
        groups: {
          ...action.groups.reduce(
            (state, group) => (state[group.id] = group) && state,
            {}
          ),
        },
      };
    case LOAD_GROUP_DETAILS:
      return {
        ...state,
        groupDetails: {
          ...state.groupDetails,
          [action.group.id]: action.group,
        },
      };
    case CREATE_GROUP:
      return {
        ...state,
        groups: { ...state.groups, [action.group.id]: action.group },
      };
    case DELETE_GROUP: {
      const newState = { ...state };
      delete newState.groups[action.groupId];
      return newState;
    }
    default:
      return state;
  }
}

// const groupReducer = (state = {}, action) => { //! This was causing issues for me
//   switch (action.type) {
//     case LOAD_GROUPS: {
//       const groupsState = { ...state };
//       action.groups.Groups.forEach((group) => {
//         groupsState[group.id] = group;
//       });
//       return groupsState;
//     }
//     case LOAD_GROUP_DETAILS: {
//       const groupsState = { ...state };
//       groupsState[action.group.id] = action.group;
//       return groupsState;
//     }
//     case LOAD_GROUP_EVENTS: {
//       const groupsState = { ...state };
//       groupsState[action.groupId].Events = action.events.Events;
//       return groupsState;
//     }
//     case CREATE_GROUP: {
//       const groupsState = { ...state };
//       groupsState[action.group.id] = action.group;
//       return groupsState;
//     }
//     case ADD_IMAGE: {
//       const groupsState = { ...state };
//       if ("GroupImages" in groupsState[action.groupId]) {
//         groupsState[action.groupId].GroupImages.push(action.image);
//       } else {
//         groupsState[action.groupId].GroupImages = [action.image];
//       }
//       return groupsState;
//     }
//     case EDIT_GROUP: {
//       const groupsState = { ...state };
//       groupsState[action.groupId] = {
//         ...groupsState[action.groupId],
//         ...action.group,
//       };
//       return groupsState;
//     }
//     case DELETE_GROUP: {
//       const groupsState = { ...state };
//       delete groupsState[action.groupId];
//       return groupsState;
//     }
//     default:
//       return state;
//   }
// };

export default groupReducer;
