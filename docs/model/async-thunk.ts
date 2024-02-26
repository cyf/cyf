import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, AppState } from "@/model/store";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppState;
  dispatch: AppDispatch;
  rejectValue: string;
}>();
