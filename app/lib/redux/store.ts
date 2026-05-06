// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/slices";
import userInfo from "./slices/userSlice";
import workerReducer from "./slices/workerSlice";




export const store = configureStore({
  reducer: {
    loginInfo: counterSlice,
    workerScreens:userInfo,
    workers: workerReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
