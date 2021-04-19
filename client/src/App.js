import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Contexts.
import { RestaurantContextProvider } from './contexts/restaurantContext';
import { CartContextProvider } from './contexts/cartContext';
import { HistoryContextProvider } from './contexts/historyContext';
import { UserContext } from './contexts/userContext';

// Pages.
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProfileEdit from './pages/Profile/Edit';
import HistoryCart from './pages/History/Cart';
import ProductAdd from './pages/Product/Add';
import Logout from './pages/Logout';
import Cart from './pages/Cart';

// Components.
import Navbar from './components/NavbarV2';
import PrivateRoute from './components/PrivateRoute';

// Config.
import { API, setAuthToken } from './config/api';
import Transaction from './pages/Transaction';
import { QueryClient, QueryClientProvider } from 'react-query';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const [state, dispatch] = useContext(UserContext);
  const client = new QueryClient();

  const [loading, setLoading] = useState(true);

  const validate = async () => {
    try {
      const res = await API.get('validate');

      if (res.status === 401) {
        dispatch({
          type: 'AUTH_INVALID',
        });
      }

      const { data } = res.data;
      const { user } = data;

      dispatch({
        type: 'AUTH_VALID',
        payload: {
          token: localStorage.token,
          user: {
            name: user.name,
            email: user.email,
            img: user.img,
            role: user.role,
            phone: user.phone,
            id: user.id,
          },
        },
      });
      setLoading(false);
    } catch (error) {
      dispatch({
        type: 'AUTH_ERROR',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    validate();
  }, []);
  return (
    <QueryClientProvider client={client}>
      <HistoryContextProvider>
        <RestaurantContextProvider>
          <CartContextProvider>
            <div className="App">
              {!loading && (
                <BrowserRouter>
                  <Navbar />
                  <main>
                    <Switch>
                      <Route path="/" component={Home} exact />
                      <Route path="/login" component={Login} exact />
                      <Route path="/register" component={Register} exact />
                      <PrivateRoute path="/shop/:id" component={Shop} exact />
                      <PrivateRoute path="/cart" component={Cart} exact />
                      <PrivateRoute path="/profile" component={Profile} exact />
                      <PrivateRoute
                        path="/transaction"
                        component={Transaction}
                        exact
                      />
                      <PrivateRoute
                        path="/profile/edit"
                        component={ProfileEdit}
                        exact
                      />
                      <PrivateRoute
                        path="/product/add"
                        component={ProductAdd}
                        exact
                      />
                      <PrivateRoute
                        path="/order/:id"
                        component={HistoryCart}
                        exact
                      />
                      <PrivateRoute path="/logout" component={Logout} exact />
                    </Switch>
                  </main>
                </BrowserRouter>
              )}
            </div>
          </CartContextProvider>
        </RestaurantContextProvider>
      </HistoryContextProvider>
    </QueryClientProvider>
  );
};

export default App;
