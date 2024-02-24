import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "./storage";

/* Instruments */
import { userSlice } from "./slices";

export const reducer = combineReducers({
  user: userSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
};

export const persistedReducer = persistReducer(persistConfig, reducer);
