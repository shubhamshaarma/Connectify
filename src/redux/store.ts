import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modalReducer";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./authReducer";

const store = configureStore({
    reducer: {
        modalReducer,
        authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
