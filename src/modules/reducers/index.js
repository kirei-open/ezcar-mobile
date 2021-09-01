import { combineReducers } from "redux";
import auth from './auth';
import app from './app';
import chat from './chat';
import company from './company';
import division from './division';
import fleet from './fleet';
import fleetReport from "./fleetReport";
import miniList from "./miniList";
import notification from "./notification";
import order from "./order";
import pool from "./pool";
import search from "./search";
import testing from "./testing";
import user from "./user";

const rehydrated = (state = false, action) => {
    switch (action.type) {
        case 'persist/REHYDRATE': 
            return true;
        default: 
            return state;
    }
};

export default combineReducers({
    rehydrated,
    app,
    auth,
    order,
    user,
    company,
    division,
    pool,
    fleet,
    fleetReport,
    miniList,
    notification,
    search,
    chat,
    testing
})