// store/slices/workerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
 
interface Worker {
  id: number;
  name: string;
  gender: string;
  age: number;
  phone: string;
  city: string;
  status: string;
}
interface WorkerState {
  workers: Worker[];
  selectedWorker: Worker | null;
  activeTab: string;
}

const initialState: WorkerState = {
  workers: [
    {
      id: 0,
      name: "Search Worker",
      gender: "Male",
      age: 35,
      phone: "055-123-4567",
      city: "Riyadh",
      status: "Active",
    },
    {
      id: 1,
      name: "Ahmed Khan",
      gender: "Male",
      age: 35,
      phone: "055-123-4567",
      city: "Riyadh",
      status: "Active",
    },
    {
      id: 2,
      name: "Fatima Ali",
      gender: "Female",
      age: 29,
      phone: "056-234-5678",
      city: "Jeddah",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Omar Hassan",
      gender: "Male",
      age: 42,
      phone: "057-345-6789",
      city: "Dammam",
      status: "Active",
    },
    {
      id: 4,
      name: "Sara Ahmed",
      gender: "Female",
      age: 31,
      phone: "058-456-7890",
      city: "Makkah",
      status: "Active",
    },
  ],
  selectedWorker: null,
  activeTab: "Demographic",
};

const workerSlice = createSlice({
  name: "workers",
  initialState,
  reducers: {
    setWorkers: (state, action: PayloadAction<Worker[]>) => {
      state.workers = action.payload;
    },
    addWorker: (state, action: PayloadAction<Worker>) => {
      state.workers.push(action.payload);
    },
    selectWorker: (state, action: PayloadAction<number>) => {
      state.selectedWorker =
        state.workers.find((p) => p.id === action.payload) || null;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setWorkers, addWorker, selectWorker, setActiveTab } =
  workerSlice.actions;
export default workerSlice.reducer;
