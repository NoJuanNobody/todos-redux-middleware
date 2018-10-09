import { take, call,put, fork} from "redux-saga/effects";
import { addTodo, ADD_TODO, GET_REMINDER, fetchSuccess, fetchFailed} from "../../actions/index";
import { fetchReminder, axiosReminder } from "../../api/fetchReminder";
import { delay } from "redux-saga";
export const reminderUrl = 'https://jsonplaceholder.typicode.com/todos/1';

//watcher saga SEC
export function* watchAddTodo(){
    while(true){
        const action = yield take('*')
        if(action.type === ADD_TODO){
            yield call(getReminderAndAddTodo, action.payload);
        }
        if(action.type === GET_REMINDER){
            // try {
                yield fork(retryReminder, action.payload);
            // } catch (error) {
                // yield fork(getReminder, action.payload);
            // }

        }

    }
}
//worker
//should cycle and try to fetch
export function* retryReminder(reminderConfig){
    let i = 5;
    let res;
    while(i && !res){
        res = yield call(getReminder, reminderConfig);
        yield console.log(res)
        yield call(delay, 1000)
        yield i--;
    }
}
export function* getReminder(reminderConfig){
    let reminder;
    
    try {
        if(reminderConfig.networkRequest === 'axios'){
            reminder = yield call(axiosReminder, reminderConfig.fail);
        } else{
            reminder = yield call(fetchReminder, reminderConfig.fail);
        }
        
         yield put(fetchSuccess(reminderConfig));
        
    } catch (error) {
        yield put(fetchFailed(reminderConfig));
    }
    return yield reminder
}
//worker saga
export function* getReminderAndAddTodo(todo){
    let oldTodo;
    try {
        oldTodo = yield call(fetchReminder, false);   
        yield put(addTodo(oldTodo.title)); 
    } catch (error) {
        yield console.log(error);
    }
    
}