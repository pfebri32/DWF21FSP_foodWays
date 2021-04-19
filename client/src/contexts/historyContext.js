import { createContext, useReducer } from "react";

export const HistoryContext = createContext();

const initialState = {
    carts: [],
};

const reducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'RESET_ORDER':
            return {
                carts: [],
            };
        case 'ADD_ORDER':
            return {
                ...state,
                carts: [
                    ...state.carts,
                    payload,
                ],
            };
        default:
            throw new Error();
    }
};

export const HistoryContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <HistoryContext.Provider value={[state, dispatch]}>
            { children }
        </HistoryContext.Provider>
    );
};