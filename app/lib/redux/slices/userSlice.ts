// store/slices/index.ts
import { createSlice } from "@reduxjs/toolkit";

interface WorkerState {
  user: any;
}

 const initialState: WorkerState = {
    user:[]
}
const userInfo = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state,action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user=[];
    },
  },
});

export const { setUser, clearUser } = userInfo.actions;
export default userInfo.reducer;
