"use client";
import React from "react";

/* Core */
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

/* Instruments */
import { store, persistStore } from "@/model";

export default function ReduxProvider({ children }: React.PropsWithChildren) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore}>
        {children}
      </PersistGate>
    </Provider>
  );
}
