import { fetchReminder, watchAddTodo, getReminder, reminderUrl } from "./addTodoSaga";
import { addTodo, ADD_TODO } from "../../actions";
import { expectSaga, testSaga } from "redux-saga-test-plan";
import * as matchers from 'redux-saga-test-plan/matchers';
import { put } from "redux-saga/effects";
import {todos} from "../../reducers/todos";
const todoTextvalue = "test todo value"
const todo = {
    id:0, 
    text:todoTextvalue,
    type:ADD_TODO 
}
const reminder = {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
}
const reminderTodo = {
    type:ADD_TODO ,
    id:1, 
    text:"delectus aut autem"
}
describe('watch todo saga', () => {
    it('follows the right order', () => {
        testSaga(watchAddTodo, addTodo(todoTextvalue))
        .next()
        .take(ADD_TODO)
        .next(todo)
        .call(getReminder, todo)
        
    });
});
describe('getReminderSaga', () => {
    it('follows the right order', () => {
        testSaga(getReminder, todo)
        .next()
        .call(fetchReminder)
        .next(reminder)
        .put(reminderTodo)
    });
});
//still can't figure out integration test
describe('watch add todo and reminder integration', () => {
    it('make sure reminderTodo is passed', () => {
        reminderTodo.id = 2;
        return expectSaga(getReminder, todo)
        .provide([
            [matchers.call.fn(fetchReminder), reminder]
        ])
        .put(reminderTodo)
        .run()
        
    });
});
describe('watch add todo and reminder integration', () => {
    it('make sure reminderTodo is passed', () => {
        reminderTodo.id = 2;
        return expectSaga(watchAddTodo, addTodo(todoTextvalue))
        .take(ADD_TODO)
        .run()
        
    });
});