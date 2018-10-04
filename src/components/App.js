import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = ({initialValue:initialValue, onSubmit:onSubmit}) => (
  <div>
    <AddTodo initialValue={initialValue} onSubmit={onSubmit} />
    <VisibleTodoList />
    <Footer />
  </div>
)

export default App
