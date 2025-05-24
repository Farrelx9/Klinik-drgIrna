import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
// import logger from "redux-logger";
import authReducer from "./redux/reducers/authReducer";
import janjiTemuReducer from "./redux/reducers/janjiTemuReducers";
import notificationReducer from "./redux/reducers/notificationReducer";
import authAdminReducer from "./redux-admin/reducer/authAdminReducers";
import userAdminReducer from "./redux-admin/reducer/userAdminReducer";
import appointmentReducer from "./redux-admin/reducer/appointmentReducer";
import jenisTindakanReducer from "./redux-admin/reducer/jenisTindakanReducer";
import rekamMedisReducer from "./redux-admin/reducer/rekamMedisReducer";
import pasienReducer from "./redux-admin/reducer/pasienReducer";
import konsultasiSlice from "./redux/reducers/konsultasiSlice";
import pembayaranSlice from "./redux/reducers/pembayaranSlice";
import chatSlice from "./redux/reducers/chatSlice";
import chatAdminSlice from "./redux-admin/reducer/adminChatSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  janjiTemu: janjiTemuReducer,
  notification: notificationReducer,
  authAdmin: authAdminReducer,
  userAdmin: userAdminReducer,
  appointment: appointmentReducer,
  jenisTindakan: jenisTindakanReducer,
  rekamMedis: rekamMedisReducer,
  pasien: pasienReducer,
  konsultasi: konsultasiSlice,
  pembayaran: pembayaranSlice,
  chat: chatSlice,
  chatAdmin: chatAdminSlice,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
