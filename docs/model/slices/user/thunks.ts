/* Instruments */
import { fetchUser } from "./request";
// import { selectUser } from "./selectors";
import { userSlice } from "./slice";
import type { User } from "./user";
import { ReduxThunkAction } from "@/model";
import { createAppAsyncThunk } from "../../async-thunk";

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchUserAsync = createAppAsyncThunk(
  "user/fetchUser",
  async () => {
    // The value we return becomes the `fulfilled` action payload
    return await fetchUser();
  },
);

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const fetchUserIfOddAsync =
  (user: User | null): ReduxThunkAction =>
  (dispatch, getState) => {
    // const currentValue = selectAuth(getState());
    dispatch(userSlice.actions.setUser(user));
  };
