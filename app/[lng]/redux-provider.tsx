"use client";
import React, { useEffect, useRef } from "react";

/* Core */
import Cookies from "js-cookie";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query";

/* Instruments */
import eventBus from "@/lib/event-bus";
import { makeStore } from "@/model/store";
import { cacheIdKey, cacheTokenKey } from "@/constants";

import type { AppStore, Persistor } from "@/model/store";

export default function ReduxProvider({ children }: React.PropsWithChildren) {
  const storeRef = useRef<AppStore | null>(null);
  const persistStoreRef = useRef<Persistor | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    if (!persistStoreRef.current) {
      persistStoreRef.current = persistStore(storeRef.current);
    }
  } else {
    if (!persistStoreRef.current) {
      persistStoreRef.current = persistStore(storeRef.current);
    }
  }

  useEffect(() => {
    if (storeRef.current != null) {
      // configure listeners using the provided defaults
      // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
      const unsubscribe = setupListeners(storeRef.current.dispatch);
      return unsubscribe;
    }
  }, []);

  useEffect(() => {
    // 订阅事件
    const logout = (target: any) => {
      console.log("target", target);
      if (persistStoreRef.current) {
        persistStoreRef.current.pause();
        persistStoreRef.current
          .flush()
          .then(() => {
            return persistStoreRef.current?.purge();
          })
          .then(() => {
            Cookies.remove(cacheTokenKey);
            Cookies.remove(cacheIdKey);
            target && window.location.replace(target);
          });
      }
    };

    eventBus.on("logout", logout);
    // 组件卸载时移除事件监听
    return () => {
      eventBus.off("logout", logout);
    };
  }, []);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistStoreRef.current}>
        {children}
      </PersistGate>
    </Provider>
  );
}
