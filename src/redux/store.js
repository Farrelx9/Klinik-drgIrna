import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./reducers/authReducer";
import janjiTemuReducer from "./reducers/janjiTemuReducers";

const rootReducer = combineReducers({
  auth: authReducer,
  janjiTemu: janjiTemuReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
