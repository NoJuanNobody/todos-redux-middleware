import React from 'react'
import PropTypes from 'prop-types'

const Todo = ({ onClick, completed, text, color }) => (
  <li
    onClick={onClick}
    style={{
      textDecoration: completed ? 'line-through' : 'none',
      listStyle:'none',
      color:color ? color : '#222'
    }}
  >
    {text}
  </li>
)

Todo.propTypes = {
  onClick: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  color:PropTypes.string
}

export default Todo
