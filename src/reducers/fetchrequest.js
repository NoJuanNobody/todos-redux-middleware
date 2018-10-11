import { FETCH_FAILED, FETCH_SUCCESS, TRIGGER_OFFLINE_MODE } from "../actions/index";

const msg = {
    success: "successfully fetched with ",
    fail: "unable to fetch with ",
    end:" at "
}
function leadingZero(num){
    return num < 10 ? '0' + num : num;
}
function timestamp(){
    let date = new Date();
    let ms = leadingZero(date.getMilliseconds());
    let ss = leadingZero(date.getSeconds());
    let min = leadingZero(date.getMinutes());
    let h = leadingZero(date.getHours());
    let dd = leadingZero(date.getDate());
    let mm = leadingZero(date.getMonth()+1);
    let yyyy = date.getFullYear();
    return mm+'/'+dd+'/'+yyyy+" "+h+':'+min+':'+ss+':'+ms
}

const networkRequests = (state = [], action) => {
    let stamp = timestamp()
    switch(action.type){
        case FETCH_SUCCESS:
            return [...state,
                {
                    id:stamp+'-'+action.payload.networkRequest,
                    text:'✓'+action.payload.networkRequest+msg.end+stamp,
                    color:'green'
                }
            ]
        case FETCH_FAILED:
            return [...state,
                {
                    id:stamp+'-'+action.payload.networkRequest,
                    text:'✕'+action.payload.networkRequest+msg.end+stamp,
                    color:'red'
                }
            ]
        case TRIGGER_OFFLINE_MODE:
            return [...state,
                {
                    id:stamp+'-'+action.payload.networkRequest,
                    text:'we were unable to fetch with '+action.payload.networkRequest+' triggering offline mode',
                    color:'orange'
                }
            ]
        default:
            return state
    }
}




export default networkRequests