import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/authReducer";
import { janjiTemuReducer } from "./reducers/janjiTemuReducers";

const rootReducer = combineReducers({
  auth: authReducer,
  janjiTemu: janjiTemuReducer,
  // tambahkan reducer lain di sini jika ada
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
