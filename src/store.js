import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
// import logger from "redux-logger";
import authReducer from "./redux/reducers/authReducer";
import janjiTemuReducer from "./redux/reducers/janjiTemuReducers";
import notificationReducer from "./redux/reducers/notificationReducer";
import authAdminReducer from "./redux-admin/reducer/authAdminReducers";
import userAdminReducer from "./redux-admin/reducer/userAdminSlice";
import appointmentReducer from "./redux-admin/reducer/appointmentReducer";
import jenisTindakanReducer from "./redux-admin/reducer/jenisTindakanReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  janjiTemu: janjiTemuReducer,
  notification: notificationReducer,
  authAdmin: authAdminReducer,
  userAdmin: userAdminReducer,
  appointment: appointmentReducer,
  jenisTindakan: jenisTindakanReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
