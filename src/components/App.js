import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'
import FetchHistory from "../containers/FetchHistory";
const App = ({initialValue:initialValue, onSubmit:onSubmit ,actionHandler:actionHandler}) => (
  <div>
    <AddTodo initialValue={initialValue} onSubmit={onSubmit} actionHandler={actionHandler}/>
    <VisibleTodoList />
    <Footer />
    <FetchHistory />
  </div>
)

export default App
