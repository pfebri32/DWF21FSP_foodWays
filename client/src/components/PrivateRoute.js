import { useContext } from 'react';
import { Redirect, Route } from 'react-router';

// Contexts.
import { UserContext } from '../contexts/userContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [state] = useContext(UserContext);
  const { isLogin } = state;
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
