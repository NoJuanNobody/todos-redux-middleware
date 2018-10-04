

import configureMockStore from "redux-mock-store";
import addTodoWithReminder, {reminderUrl} from "./addTodoThunk";
import thunk from "redux-thunk";
import { ADD_TODO } from "../../actions/index";
import fetchMock from "fetch-mock";

export const mockStore = configureMockStore([thunk]);


describe('todothunk', async () => {
    it('adds a reminder action to the store along with the original todo', async () => {
        //setup
        let testTodo = "test todo value";    
        const reminder ={
            "userId": 1,
            "id": 1,
            "title": "delectus aut autem",
            "completed": false
        };        
        const store = mockStore();
        fetchMock.get(reminderUrl, {reminder: reminder});
        //test
        await store.dispatch(addTodoWithReminder(testTodo));
        //assertions
        const actions = store.getActions();
        expect(actions[0].type).toEqual(ADD_TODO);
        expect(actions[0].text).toEqual(testTodo);
        expect(actions[1].type).toEqual(ADD_TODO);
        expect(actions[1].text === actions[0].text).toBeFalsy();        
    });
});