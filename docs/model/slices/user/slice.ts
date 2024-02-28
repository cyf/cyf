/* Core */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
/* Instruments */
import { fetchUserAsync } from "./thunks";
import type { User } from "./user";

const initialState: UserSliceState = {
  value: null,
  status: "idle",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    logout: (state) => {
      state.value = null;
    },
    // increment: (state) => {
    //     // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //     // doesn't actually mutate the state because it uses the Immer library,
    //     // which detects changes to a "draft state" and produces a brand new
    //     // immutable state based off those changes
    //     state.value += 1;
    // },
    // decrement: (state) => {
    //     state.value -= 1;
    // },
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUser: (state, action: PayloadAction<User | null>) => {
      state.value = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.value = action.payload;
      });
  },
});

/* Types */
export interface UserSliceState {
  value: User | null;
  status: "idle" | "loading" | "failed";
}