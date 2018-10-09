import { addTodo } from '../../actions'
import {fetchReminder} from '../../api/fetchReminder'
export const reminderUrl = 'https://jsonplaceholder.typicode.com/todos/1';

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