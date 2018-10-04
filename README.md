
In the Redux ecosystem, middleware is software that runs after an action has been dispatched, and before any subscribed reducers receive the action. Middleware execute in the order which they were registered with the store, and SHOULD NOT MODIFY THE ACTION. Their purpose is generally to perform side effects.

Thunk and Saga are two alternative middleware options available to help structure the orchestration of a Redux application. They each have pros and cons which should be evaluated so the team can make the best possible decision.

AC

A decision on which middleware to use has been reached (commented on ticket)
Artifacts to justify decision attached/linked to the ticket
potentially: pro/con list, poc apps, article citations


#PE-3104 saga vs thunk
this is where i will do my analysis of saga vs thunk.

##instalation

both thunk and saga are added via the `applyMiddleware` redux function with each package included. you can only install one with the way redux creates a store. 

also with saga, you will need to run the saga middleware additionaly. 

##Thoughts on using Thunk

Thunk is pretty usefull especially if you want to update another part of the state that the initial action does not directly have access too. This POC does not go into that but i can see out in writing this poc that this could be useful. for example updating the state of another component and triggering a change in another view in an asynchronous manner. 

In this POC I intended to test Thunks usability and the ease to test. 
I built the example react app the redux provides and modified that code to include thunk. now when ever a user triggers the ADD_TODO action, I added an additional thunk to fetch a json reminder from *a previous fake todo list that did not get done* and then both of those items are then added to the list component below it. 
###testing
The importance of this middleware was how i was able to test it. although i had to learn multiple software packages including jest and enzyme to get this going, i can appreciate at least on an elementary level that this middleware function is pretty simple to test. also the ability to chain the methods is pretty useful. it is possible that there are more esoteric situations that may require more complex testing. 


# the need for sagas
The saga pattern is specifically useful when a project has the need for a longer series of functions need to happen after triggering an initial function. working with distributed systems or even segmented states and reducers could facilitate the need for sequential transaction trees. while thunk can handle this, the question is how can we reliably confirm that these transactions can occur consistently and correctly, and how can they be tested. 


This is why the Saga pattern is usefull. In theory a saga is a system of sub transactions denoted as t and a compensating request C which could undo that action. an overall request could be re-expressed as t1, t2, t3 or t1,t2,c1,c2 and so on. 
in order to coordinate the work of these subrequests we need a saga execution coordinator, and a saga log to track the order of events which occur. the SEC will then log the events and make sure that if there are any errors, that any state that has changed will be able to be rolled back by compensating requests

## saga and generator functions and saga-redux
the use of generator functions and the correlation to SEC's is pretty clear especially considering the ability to pass in params when the returned object is iterated over. I believe that is the most powerful aspect of saga-redux, and i think that is interesting considering that this feature is baked into ES6, not the saga-redux package. 

## implementation of saga-redux into our app
in terms of the different parts of the saga pattern, there is no difference between sub transactions and Saga Execution Generators, there is no difference, ta saga can be comprised of more sagas. the closest thing RS has to a SEC is a wathcer, and the subtransaction is a worker and that is only a naming convention. 

one of the biggest differneces between thunk and saga is that dispatch is more hidden from the developer. importing a general **action** function that passes the action creator through dispatch is enough. 

Saga is running in the backgroun and is generally watching the stream of actions, and reacts based on certain events, almost like firehose in AWS. 
the benefit of this separation is that we are always dispatching pure actions. the middlware can dipatch additional actions but redux is primarily untouched by the middleware. there is a separation of concerns that is attractive. 


##concerns with saga-redux

I am worried that saga-redux is not a true implementation of the saga pattern that was [originally written in 1987]
(http://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf)
this is not something i had enought time to research

the saga pattern was originally written because engineers working on distributed systems were primarily concerned with Atomicity, Consistency, Isolation and Durability (**ACID**). 

For our specific use case the need to make sure data scynced between components is much easier, we can update variables and call functions easily. however the ability to recognize that certain functions need to happen in a certain order, and have the ability to compensate those events incase of failure is a valuable trait of this pattern and is useful for client side middleware. this aspect is already provided by generator functions already baked in ES6. 

our specific use case for the saga pattern does not involve distruted database systems or millions of rows of data, but treating our state as carfully separated entities is smart. we can avoid changing things that are not meant to be, but it is on us as the developers to add **convention** when using saga-redux so that we can differentiate between workers and watchers or SEC's and subtasks. 
overall i thing saga is better because thunk can be written in saga, but saga cannot be written in thunk. 