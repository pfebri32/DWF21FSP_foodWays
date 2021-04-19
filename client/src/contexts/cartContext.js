import { createContext, useReducer } from 'react';

export const CartContext = createContext();

const initialState = {
  restaurantId: 0,
  restaurantName: '',
  totalPrice: 0,
  totalQuantity: 0,
  orders: [],
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'DELETE_CART':
      const filtered = state.orders.filter(
        (order) => order.id !== payload.order.id
      );
      return {
        ...state,
        totalPrice:
          state.totalPrice - payload.order.price * payload.order.quantity,
        totalQuantity: state.totalQuantity - payload.order.quantity,
        orders: filtered,
      };
    case 'UPDATE_CART':
      return {
        ...state,
        totalPrice: payload.totalPrice,
        totalQuantity: payload.totalQuantity,
        orders: payload.orders,
      };
    case 'RESET_CART':
      return {
        restaurantId: 0,
        restaurantName: '',
        totalPrice: 0,
        totalQuantity: 0,
        orders: [],
      };
    case 'ADD_CART':
      // For add order that change source of restaurant chain.
      if (state.restaurantId !== payload.restaurantId) {
        return {
          restaurantId: payload.restaurantId,
          restaurantName: payload.restaurantName,
          totalPrice: payload.menu.price,
          totalQuantity: 1,
          orders: [
            {
              ...payload.menu,
              quantity: 1,
            },
          ],
        };
      }
      // Add quantity order if order already in the cart.
      const existedOrder = state.orders.find(
        (menu) => menu.id === payload.menu.id
      );
      if (existedOrder) {
        const filtered = state.orders.filter(
          (menu) => menu.id !== payload.menu.id
        );
        return {
          ...state,
          totalPrice: state.totalPrice + existedOrder.price,
          totalQuantity: state.totalQuantity + 1,
          orders: [
            ...filtered,
            {
              ...existedOrder,
              quantity: existedOrder.quantity + 1,
            },
          ],
        };
      }
      // Add menu into cart normally.
      return {
        ...state,
        restaurantId: state.restaurantId,
        restaurantName: state.restaurantName,
        totalPrice: state.totalPrice + payload.menu.price,
        totalQuantity: state.totalQuantity + 1,
        orders: [
          ...state.orders,
          {
            ...payload.menu,
            quantity: 1,
          },
        ],
      };
    default:
      throw new Error();
  }
};

export const CartContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <CartContext.Provider value={[state, dispatch]}>
      {children}
    </CartContext.Provider>
  );
};
