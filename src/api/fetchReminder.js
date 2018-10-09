import axios from 'axios'
import { URLParamsError } from "../api/errors";
export const reminderUrl = 'https://jsonplaceholder.typicode.com/todos/1';
export const errorUrl = 'https://jsonplaceholder.typicode.com/todos/0';

export function fetchReminder(error){
    let url =mockUrl(error)
    return fetch(url)
    .then(res => {
        //this is the only way i can get fetch to return the error
        // at the moment
        // if(res.status === 404 && res.bodyUsed === false){
        //     throw new URLParamsError("invalid params", url);
        // }else{
            return res.json()
        // }
    })
    .then(json => {return json})
    .catch( e =>{
        throw new URLParamsError("invalid params \n using axios", url);

    })
}

export function axiosReminder(error){
    let url = mockUrl(error)
    return axios.get(url)
    .then( res =>{
        if(res.status === 404){
            throw new URLParamsError("invalid params \n using axios", url);
        }else{
            return res 
        }

    })
    .catch( e =>{
        throw new URLParamsError("invalid params \n using axios", url);

    })
}

function mockUrl(errorBool){
    let url;
    switch (errorBool) {
        case true:
            url = errorUrl
            break;
        default:
            url = reminderUrl
            break;
    }
    return url
}