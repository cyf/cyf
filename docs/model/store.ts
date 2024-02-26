/* Core */
import {
  Action,
  configureStore,
  createAsyncThunk,
  ThunkAction,
} from "@reduxjs/toolkit";
import {
  useSelector,
  useDispatch,
  useStore,
  type TypedUseSelectorHook,
} from "react-redux";
import { persistStore as persistAppStore, type Persistor } from "redux-persist";

/* Instruments */
import { persistedReducer } from "./reducers";
import { middlewares } from "./middlewares";

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

export const store: AppStore = makeStore();
export const persistStore: Persistor = persistAppStore(store);

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppStore: () => AppStore = useStore;

/* Types */
export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;
