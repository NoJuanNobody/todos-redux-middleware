import {watchAddTodo, getReminder, reminderUrl } from "./addTodoSaga";
import { addTodo, ADD_TODO } from "../../actions/index";
import { call, put, take} from "redux-saga/effects";
import { fetchReminder } from "../../api/fetchReminder";

import { cloneableGenerator } from "redux-saga/utils";


const todoTextvalue = "test todo value"
const generator = cloneableGenerator(watchAddTodo)(addTodo(todoTextvalue))
const todo = {
    id:0, 
    text:todoTextvalue,
    type:ADD_TODO 
}

it('catches todoEvent', () => {
    const result = generator.next().value;
    expect(result).toEqual(take(ADD_TODO));
});
describe('get reminder saga', () => {
    let clone;
    beforeAll(() => {
        clone = generator.clone();
    })
    
    it('calls getreminder function', () => {
        const result = clone.next(todo).value;
        
        expect(result).toEqual(call(getReminder, todo));
    });
});

describe('get Reminder saga', () => {
    it('reaches out to fetch the reminder', () => {
    });
});
const remGen = cloneableGenerator(getReminder)(todo)
const reminder = {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
}
const reminderTodo = {
    id:1, 
    text:reminder.title,
    type:ADD_TODO 
}
describe('reminder saga', () => {
    it('it fetches the reminder', () => {
        const result = remGen.next().value;
        expect(result).toEqual(call(fetchReminder))
    });
    it('adds reminder to todoList', () => {
        const result = remGen.next(reminder).value;
        expect(result).toEqual(put(reminderTodo));
    });
    it('preforms no more work', () => {
        const result = remGen.next().done;
        expect(result).toBe(true);
    });
});