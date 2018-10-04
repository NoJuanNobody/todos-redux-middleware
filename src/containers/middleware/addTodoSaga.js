import { take, call,put} from "redux-saga/effects";
import { addTodo, ADD_TODO } from "../../actions/index";


export const reminderUrl = 'https://jsonplaceholder.typicode.com/todos/1';
export function fetchReminder(){
    return fetch(reminderUrl)
    .then(response => response.json())
    .then(json => {return json})
  }
//watcher saga SEC
export function* watchAddTodo(){
    while(true){
        const action = yield take(ADD_TODO)
        yield call(getReminder, action);
    }
}

//worker saga
export function* getReminder(todo){
    const oldTodo = yield call(fetchReminder);    
    yield put(addTodo(oldTodo.title));
}