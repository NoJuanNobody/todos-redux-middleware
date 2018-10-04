import React from 'react'
import { render } from 'react-dom'
import { createStore , applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import rootReducer from './reducers'
import thunk from 'redux-thunk'
import createSagaMiddleWare from 'redux-saga'
import addTodoWithReminder from "./containers/middleware/addTodoThunk";
import { addTodo } from "./actions/index";
import { watchAddTodo } from "./containers/middleware/addTodoSaga";
const sagaMiddleware = createSagaMiddleWare();
const thunkStore = createStore(
  rootReducer,
  applyMiddleware(thunk)
  );
const sagaStore = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
  );

  //run your middleware here
sagaMiddleware.run(watchAddTodo)
render(
  <div>
    <h2>Thunk example</h2>
    <Provider store={thunkStore}>
    <App initialValue="" onSubmit={thunkSubmit}/>
  </Provider>
  <h2>Saga Example</h2>
  <Provider store={sagaStore}>
    <App initialValue="" onSubmit={sagaSubmit} />
  </Provider>
  </div>,
  document.getElementById('root')
)

// these are the functions that would normally get called
// with thunk you pass in the thunk, but with saga
// you pass in the pure action which saga is listening for
function sagaSubmit(input) {
  this.dispatch(addTodo(input))
}
function thunkSubmit(inputvalue){
  return this.dispatch(addTodoWithReminder(inputvalue));
}