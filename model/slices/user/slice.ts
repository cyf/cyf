/* Core */
import { fetchUser } from "./api";
import { createAppSlice } from "@/model/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "@/model/store";
import type { User } from "@/entities/user";

/* Types */
export interface UserSliceState {
  value: User | null;
  status: "idle" | "loading" | "failed";
}

const initialState: UserSliceState = {
  value: null,
  status: "idle",
};

export const userSlice = createAppSlice({
  name: "user",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    logout: create.reducer((state) => {
      state.value = null;
    }),
    // Use the PayloadAction type to declare the contents of `action.payload`
    setUser: create.reducer((state, action: PayloadAction<User | null>) => {
      state.value = action.payload;
    }),
    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    setUserAsync: create.asyncThunk(
      async (_: void) => {
        // The value we return becomes the `fulfilled` action payload
        return await fetchUser();
      },
      {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "idle";
          state.value = action.payload;
        },
        rejected: (state) => {
          state.status = "failed";
        },
      },
    ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectUser: (user) => user.value,
    selectStatus: (user) => user.status,
  },
});

// Action creators are generated for each case reducer function.
export const { logout, setUser, setUserAsync } = userSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectUser, selectStatus } = userSlice.selectors;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const setUserIfOdd =
  (user: User | null): AppThunk =>
  (dispatch, getState) => {
    const currentValue = selectUser(getState());

    if (user !== null) {
      dispatch(setUser(user));
    }
  };
