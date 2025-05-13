import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
// import logger from "redux-logger";
import authReducer from "./reducers/authReducer";
import janjiTemuReducer from "./reducers/janjiTemuReducers";
import notificationReducer from "./reducers/notificationReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  janjiTemu: janjiTemuReducer,
  notification: notificationReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
