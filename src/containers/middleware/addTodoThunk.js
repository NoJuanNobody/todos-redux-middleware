import { addTodo } from '../../actions'

export const reminderUrl = 'https://jsonplaceholder.typicode.com/todos/1';

function fetchReminder(){
  return fetch(reminderUrl)
  .then(response => response.json())
  .then(json => {return json})
}
//thunk
function addTodoWithReminder(todoValue){
  return (dispatch) => {
    return fetchReminder().then(
      reminder =>{
        let todoAndReminder = [todoValue, reminder.title]
        return todoAndReminder.map( (todo) =>{
          dispatch(addTodo(todo))
        })
      },
      error => console.log(error)
    )
  }
}

export default addTodoWithReminder