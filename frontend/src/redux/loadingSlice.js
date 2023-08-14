import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null
};

export const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        loadOn: (state) => {
            state.value = Date.now();
        },
        loadOff: (state) => {
            state.value = null;
        }
    }
});

export const { loadOn, loadOff } = loadingSlice.actions;

export default loadingSlice.reducer;