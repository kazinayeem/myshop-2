import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;

// Fake login function
export const fakeLogin = (username, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate API delay
    if (username === "test" && password === "password") {
      dispatch(loginSuccess({ username: "test", name: "Test User" }));
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};
