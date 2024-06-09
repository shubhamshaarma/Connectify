import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface IAuthReducer {
    auth: boolean;
    email: string;
    name: string;
    profile: string;
}

const initialState: IAuthReducer = {
    auth: false,
    email: "",
    profile: "",
    name: "",
};

const authReducer = createSlice({
    name: "authReducer",
    initialState,
    reducers: {
        fetchAuth: (_, action: PayloadAction<IAuthReducer>) => {
            return action.payload;
        },
    },
});

export const { fetchAuth } = authReducer.actions;
export const userAuth = (state: RootState) => state.authReducer;

export default authReducer.reducer;
