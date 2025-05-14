import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
// import logger from "redux-logger";
import authReducer from "./redux/reducers/authReducer";
import janjiTemuReducer from "./redux/reducers/janjiTemuReducers";
import notificationReducer from "./redux/reducers/notificationReducer";
import authAdminReducer from "./redux-admin/reducer/authAdminReducers";

const rootReducer = combineReducers({
  auth: authReducer,
  janjiTemu: janjiTemuReducer,
  notification: notificationReducer,
  authAdmin: authAdminReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
