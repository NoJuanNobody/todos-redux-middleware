import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import networkRequests from "./fetchrequest";
export default combineReducers({
  todos,
  networkRequests,
  visibilityFilter
})
