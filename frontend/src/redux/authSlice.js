import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: JSON.parse(localStorage.getItem("auth"))
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        signin: (state, action) => {
            state.value = action.payload;
        },
        signout: (state) => {
            state.value = null;
        }
    }
});

export const { signin, signout } = authSlice.actions;

export default authSlice.reducer;