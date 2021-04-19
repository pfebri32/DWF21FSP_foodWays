import { createContext, useReducer } from 'react';

export const UserContext = createContext();

// const initialState = {
//   isLogin: true,
//   user: {
//     email: 'default@example.com',
//     password: 'secret',
//     name: 'Mr Default',
//     gender: 'Male',
//     phone: '088812344321',
//     location: {
//       name: 'Jakarta',
//       coordinate: {
//         lat: -6.1537,
//         lng: 106.8176,
//       },
//     },
//     role: 'user',
//   },
// };

const initialState = {
  isLogin: false,
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: {
          ...state.user,
          name: payload.name,
          phone: payload.phone,
          img: payload.img,
        },
      };
    case 'AUTH_VALID':
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', payload.token);
      return {
        isLogin: true,
        user: payload.user,
        loading: false,
      };
    case 'AUTH_INVALID':
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        isLogin: false,
        user: null,
        loading: false,
      };
    default:
      throw new Error();
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};
