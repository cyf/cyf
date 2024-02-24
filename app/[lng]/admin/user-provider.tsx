"use client";
import React, { useRef } from "react";
import {
  fetchUserAsync,
  selectUser,
  useAppDispatch,
  useAppSelector,
} from "@/model";

export default function UserProvider({ children }: React.PropsWithChildren) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const initialized = useRef(false);
  if (!user && !initialized.current) {
    initialized.current = true;
    dispatch(fetchUserAsync());
  }

  return children;
}
