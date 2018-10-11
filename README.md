#Middleware and Network Request evaluations

##Introduction
Working on redux applications, often there is a discussion on how to handle side effects. This repo is intended at trying to determine if Redux-saga, or Thunk is most suitable for production enterprise applications. These two softwares will be implemented and considered based on their ability to scale, and their ease to test and debug. 

##Proof of concept
Beause both of these applications are meant to be used with redux. I built a POC to compare the implementation and testability of each middleware. the base project is a todo app that was forked from the redux documentation to speed up development time, and the todo app is built off of create react app that was later ejected to allow for a more custom configuration. 


as a user adds a Todo to their todo list, middleware will be responsible for fetching an old todo item, which is described as a reminder item, and add it to the list below the todo that was just added.  

another comparison that i was able to make was the decision of whether to use axios vs fetch, and how it affects error handling. this is a section that will be described further in a later section.

###Redux-Thunk
* instalation
* debugging
* usage
* result

####Instalation
```unix
$ npm install redux-thunk
$ yarn add redux-thunk
```

####Usage
using ES6, import into the main entry file
```javascript
//in the index.js file...

//react imports
import React from 'react'
import { render } from 'react-dom'
import { createStore , applyMiddleware} from 'redux'
import App from './components/App'
//redux imports
import { Provider } from 'react-redux'
import { addTodo } from "./actions/index";
import rootReducer from './reducers'
//thunk imports
import thunk from 'redux-thunk'
import addTodoWithReminder from "./containers/middleware/addTodoThunk";

// create store by applying thunk middleware to it
const thunkStore = createStore(
  rootReducer,
  applyMiddleware(thunk)
  );
  render(
  <div>
    <h2>Thunk example</h2>
    <Provider store={thunkStore}>
    ... 
    </Provider>  
  </div>,
  document.getElementById('root')
```

We include our thunk middleware that we installed via ```npm``` or ```yarn``` and import ```applyMiddleware``` to connect thunk to redux. now instead of dispatching pure actions, we can instead dispatch thunks...lets see an example of what a thunk syntax looks like. 

```javascript
function thunkFunction(param){
  return (dispatch) => {
    return asyncFn(param).then(
    res => dispatch(doSomethingElse(payload)),
    error => dispatch(handleErrorWithGrace(payload))  
  );
}
```
Thunk is specifically usefull when you need to try some sort of asynchronous function, for example a network request, and then process that data in the background. Thunks essentially return the dispatch rather than a pure action. when the dispatch is returned we can chose to then dispatch some other action creator or even another thunk, which allows developers to chain long middleware processes that run in the background. 

with that knowelege, here is the thunk that I wrote

```javascript
import { addTodo } from '../../actions'
import {fetchReminder} from '../../api/fetchReminder'
export const reminderUrl = 'https://jsonplaceholder.typicode.com/todos/1';
 
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


//included in my actions file
export const addTodo = text => ({
  type: ADD_TODO,
  id: nextTodoId++,
  text
})

```
The url is actually a Json service that mocks common objects as place holders. the fetching of data is actually handled in another file... i will get into that later. 

The important part of this is that I thunk enabled me to fetch data from an API, and process that response by adding an additional _reminder to the todo list._ it even assisted me in handling an error. 

####Testing
Beause we are using Jest and enzyme to test our react and redux applications, we will also do the same for Thunk-redux. The dificulty with testing thunk is due to the fact that the testing environment that jest/enzyme provides is isolated, and many recources that you would normally include are not available. For example, in order to test functions that involve network requests, we will need to use a dev-dependency called ```fetch-mock```. fectch mock's usage is this:

```javascript

import fetchMock from "fetch-mock";

export const mockStore = configureMockStore([thunk]);


describe('thunk to test', async () => {
    it('something we would like to test that fetches data', async () => {
        //setup
        const mockedRespone={
            "userId": 1,
            "id": 1,
            "title": "delectus aut autem",
            "completed": false
        };        

        fetchMock.get(reminderUrl, {res: mockedRespone});
        await functionWithNetworkRequest(someParam)
        //assertions would go here
        ...
    });
});
```

if you intend to use redux you will also need to configure a mock store, because jest and enzyme do not allow a normal store that you would typically use at runtime in a test environment. for this we use ```redux-mock-store```

```javascript

import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

//setup  mockstore to configure it to accept thunk MW and store in variable
export const mockStore = configureMockStore([thunk]);


describe('thunk to test', async () => {
    it('something we would like to test that fetches data', async () => {
        //invoke configureMockStore with thunk added in
        const store = mockStore();
        //test an action by dispatching from the mock redux store
        await store.dispatch(actionThatIWantToDispatch);
        //assertions below
        ...
    });
});
```

This will allow us to manage the redux state that we need to test our application, without using the real redux store (that would require more configuration and shims probably. this works right out of the box. ).

###Problems with Thunk Testing
At least for the moment there is no clear way of writing thunk middleware or their tests so that we can consistently test and maintain buisness logic as a source of truth. every time that a thunk is changed, the test may also need to be changed to reflect the test changes. these tests over time will mutate the original intention.

####Other considerations with Thunk-redux
thunk changes the way redux works, by aggressively changing the actions that are created and dispatched to the reducers. there is an issue with serparation of concerns that would force the developer to be locked in to using the tool as long as they use redux.

##Saga
* instalation
* packages and dependencies
* debugging
* usage
* result

####Instalation
this is how you connect redux with saga-redux
```
npm install --save redux-saga

yarn add redux-saga
```
####Usage

```javascript
import { createStore , applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleWare from 'redux-saga'
import { watchAddTodo } from "./containers/middleware/addTodoSaga";

const sagaMiddleware = createSagaMiddleWare();

const sagaStore = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
  );

//invoke this command to allow saga to run in the background
//watches and executes middleware after actions are dispatched
sagaMiddleware.run(watchAddTodo)

render(
  <div>
  <h2>Saga Example</h2>
  <Provider store={sagaStore}>
    <App initialValue="" actionHandler={actionHandler}/>
  </Provider>
  </div>,
  document.getElementById('root')
)

function actionHandler(action){
  this.dispatch(action);
}

```

redux-saga is included the same way that thunk is to the redux store, however you need to additionally run the root saga in order to start the flow of the saga in the background of your application. saga is separated from redux, so when actions are dispatched, pure actions are created. Saga then listens via ```watcher sagas``` to the stream of actions occuring and then calls other ```worker sagas``` in order to execute background or indirect subtransactions that need to happen in the buisness flow of your application. this is especially useful when an app requires complex middleware that has tiered logic and a series of subtransactions that may or may not occur. 


#####Watcher and worker sagas
Watcher and worker sagas are born from the saga pattern in distributed systems. In order to create an overal transaction, a number of subtransactions will need to be completed. in order to watch and make sure that these transactions all work in the right order and do not fail, a Saga Execution Coordinator **(SEC)** needs to be involved. this idea informed redux-saga but our specific use case has different demands. In Redux-saga SEC's take on the form of ```watcher Sagas``` and our subtransactions are ```worker sagas```. the pattern looks like this:

```javascript
//watcher saga or SEC
export function* rootSaga(){
    while(true){
        const action = yield take('*')
        if(action.type === DO_SOMETHING){
            yield call(workerSaga, arguments);
        }
        ...

    }
}

//worker saga
export function* workerSaga(arguments){
    let data;
    try {
        data = yield call(fetchSomeData, false);   
        yield put(processSomeData(data)); 
    } catch (error) {
        yield put(fetchFailed(arguments));
    }
}

```

what we are looking at is a clever use of ES6's generator functions. let me preface this that if we wanted to use Saga, we would have to use Es6 or typescript. Generators are functions that create iterables that will run in an asyncronous setting. they are iterable, which allows the developer to identify the order of how certain aspects of this asynchronous code should behave. Some of the greatness of saga is that they wrap alot of generator functionality into their source code, and provide us with easier ways to acess this functionality with less boilerplate code.

The ```take``` in the watcher saga is looking out for all actions that are being dispatched. from there it makes a copy of the action that is being dispatched and we can do what ever we want with it. functions like ```take``` ```put``` ```call``` and ```fork``` are functions provided by saga that help to make middleware more testable. when testing, saga will create an object rather than executing the function, and it will use this object to test for line to line equivalency. this is what makes saga so easy to test. 


```javascript

//you can take only specific actions 
yield takeEvery("FETCH_DATA",processdata)
// or you can take the last action in a
//  series for a specific type
yield takeLatest("FETCH_DATA",processdata)

//or you can include logic to inspect the action and do something based on that. 
take('*')
if(action.type === DO_THIS){
  yield call(doThat, withargs)
}

```

####Testing sagas

There are several way to test sagas. one method is testing the order of your functions is not changing. for example if a saga is making sure that login and logout will not change implementation, you may want to write a test to lock in how these transactions happen relative to each other. here is an older test I wrote along with this demo that does just that. 

```javascript
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
```

This test is ensuring that a todo event is caught when dispatched, and then fetches a reminder, and adds both to the todo list. redux-saga also comes with utilities like ```cloneable generator``` which allows us to follow all paths of multiple logic trees, instead of having to write a setup and test spec for each one. the cloneable generator needs to be itterated in the test, where you can then grab an object that redux-saga mocks to test the state. this is where you can include your assertions for each test. as you reach a point where logic could change the behavior of your saga, you can clone your generator with ```generator.clone``` and then supply separate tests different conditions to handle all situations in one test suite. this is very useful for error handling. 

while this test is useful, it make not be helpful in the long run if the implementation of our saga changes. maybe for example, we are not concerned with the exact order that things are executed, this test would need to be updated every time that we update or change our implementation. ```saga-test-plan```

provides a way to write integration tests in a much more terse way

```javascript
import {watchAddTodo, getReminder, reminderUrl } from "./addTodoSaga";
import { addTodo, ADD_TODO } from "../../actions";
import { expectSaga, testSaga } from "redux-saga-test-plan";
import * as matchers from 'redux-saga-test-plan/matchers';
import { fetchReminder } from "../../api/fetchReminder";

...

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
```

these are some typical integration tests that are possible with the external dependency ```saga-test-plan```. unfortunately in this case, because we are not using saga test plan, we have to mock our network requests, but this is also included with the matchers utility included in saga-test-plan. it will mock the object returned from saga when you invoke one of their ```effects``` utilities.
