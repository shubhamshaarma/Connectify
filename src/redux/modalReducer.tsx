import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface IModalReducer {
    editFeed?: boolean;
}

const initialState: IModalReducer = {
    editFeed: false,
};

type ModalPayload = "editFeed";

const modalReducer = createSlice({
    name: "modalReducer",
    initialState,
    reducers: {
        toggleModal: (state, action: PayloadAction<[ModalPayload, true | false]>) => {
            return {
                ...state,
                [action.payload[0]]: action.payload[1],
            };
        },
    },
});

export const { toggleModal } = modalReducer.actions;
export const modalState = (state: RootState) => state.modalReducer;

export default modalReducer.reducer;
