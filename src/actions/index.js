let nextTodoId = 0
export const ADD_TODO = "ADD_TODO";
export const SET_VISIBILITY_FILTER = "SET_VISIBILITY_FILTER";
export const TOGGLE_TODO = "TOGGLE_TODO";
export const GET_REMINDER = "GET_REMINDER";
export const FETCH_SUCCESS = "FETCH_SUCCESS";
export const FETCH_FAILED = "FETCH_FAILED";
export const TRIGGER_OFFLINE_MODE = "TRIGGER_OFFLINE_MODE";

export function triggerOfflineMode(payload){
  return {
    type:TRIGGER_OFFLINE_MODE,
    payload
  }
}


export function getReminder(payload){
  return {
    type: GET_REMINDER,
    payload
  }
}

export function fetchSuccess(payload){
  return {
    type:FETCH_SUCCESS,
    payload
  }
}

export function fetchFailed(payload){
  return {
    type:FETCH_FAILED,
    payload
  }
}


export const addTodo = text => ({
  type: ADD_TODO,
  id: nextTodoId++,
  text
})

export const setVisibilityFilter = filter => ({
  type: SET_VISIBILITY_FILTER,
  filter
})

export const toggleTodo = id => ({
  type: TOGGLE_TODO,
  id
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}
