import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  info: null,  // Store account details here
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccountInfo: (state, action) => {
      state.info = action.payload;
    },
    clearAccountInfo: (state) => {
      state.info = null;
    },
  },
});

export const { setAccountInfo, clearAccountInfo } = accountSlice.actions;
export default accountSlice.reducer;
