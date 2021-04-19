import { useContext } from "react";
import { Redirect } from "react-router";

import { UserContext } from "../contexts/userContext";
import { CartContext } from "../contexts/cartContext";
import { HistoryContext } from "../contexts/historyContext";

const Logout = () => {
    // eslint-disable-next-line
    const [userState, userDispatch] = useContext(UserContext);
    const [cartState, cartDispatch] = useContext(CartContext);
    const [historyState, historyDispatch] = useContext(HistoryContext);
    cartDispatch({
        type: 'RESET_CART',
    });
    userDispatch({
        type: 'LOGOUT',
    });
    return (
        <Redirect to='/'/>
    );
}

export default Logout
