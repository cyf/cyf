/* Core */
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
// import { persistStore as persistAppStore, persistReducer } from "redux-persist";

import type { Action, ThunkAction } from "@reduxjs/toolkit";
// import type { Persistor } from "redux-persist";
export type { Persistor } from "redux-persist";

/* Instruments */
import { middlewares } from "./middlewares";
import { userSlice } from "./slices/user/slice";
import storage from "./storage";

const reducer = combineReducers({
  user: userSlice.reducer,
});

export const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof persistedReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    // @ts-ignore
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware({ serializableCheck: false }).concat(
        middlewares,
      );
    },
  });
};

// export const store: AppStore = makeStore();
// export const persistStore: Persistor = persistAppStore(store);

/* Types */
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
