import NumberFormat from 'react-number-format';
import { useContext, useState, useEffect } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

// Contexts.
import { CartContext } from '../contexts/cartContext';
import { RestaurantContext } from '../contexts/restaurantContext';
import { UserContext } from '../contexts/userContext';

// Components.
import DeliveryLocationForm from '../components/Form/DeliveryLocationForm';
import CartOrderCard from '../components/Card/CartOrderCard';

// Styles.
import '../styles/Cart.css';
import { API } from '../config/api';

const Cart = () => {
  // Contexts.
  const [userState] = useContext(UserContext);
  const [cartState, cartDispatch] = useContext(CartContext);

  // Vars and States.
  const history = useHistory();
  const deliveryCost = 10000;
  const { user } = userState;
  const {
    restaurantId,
    restaurantName,
    orders,
    totalPrice,
    totalQuantity,
  } = cartState;

  // Form State.
  const [location, setLocation] = useState(user?.location?.name);
  const [coordinate, setCoordinate] = useState(user?.location?.coordinate);

  // Hooks.
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position.coords);
      setCoordinate({
        lng: position.coords.longitude,
        lat: position.coords.latitude,
      });
    });
  }, []);

  // Handlers.
  const handleQuantityChange = (e) => {
    const index = cartState.orders.findIndex(
      (order) => order.id === parseInt(e.target.dataset.orderid)
    );
    const order = cartState.orders[index];
    const prevQuantity = order.quantity;
    order.quantity = parseInt(e.target.value);
    if (order.quantity < 1 || Number.isNaN(order.quantity)) {
      order.quantity = 1;
    }
    const rangeQuantity = order.quantity - prevQuantity;
    const newTotalPrice = cartState.totalPrice + order.price * rangeQuantity;
    const newTotalQuantity = cartState.totalQuantity + rangeQuantity;
    cartDispatch({
      type: 'UPDATE_CART',
      payload: {
        totalPrice: newTotalPrice,
        totalQuantity: newTotalQuantity,
        orders: [
          ...cartState.orders.slice(0, index),
          order,
          ...cartState.orders.slice(index + 1),
        ],
      },
    });
  };

  const handleIncrease = (id, increase) => {
    const index = cartState.orders.findIndex((order) => order.id === id);
    const order = cartState.orders[index];
    let price = order.price;
    order.quantity = order.quantity + increase;
    price *= increase;
    if (order.quantity < 1) {
      price = 0;
      increase = 0;
      order.quantity = 1;
    }
    const newTotalPrice = cartState.totalPrice + price;
    const newTotalQuantity = cartState.totalQuantity + increase;
    cartDispatch({
      type: 'UPDATE_CART',
      payload: {
        totalPrice: newTotalPrice,
        totalQuantity: newTotalQuantity,
        orders: [
          ...cartState.orders.slice(0, index),
          order,
          ...cartState.orders.slice(index + 1),
        ],
      },
    });
  };

  const handleDelete = (id) => {
    const order = orders.find((order) => order.id === id);
    cartDispatch({
      type: 'DELETE_CART',
      payload: {
        order: order,
      },
    });
  };

  const handleOrder = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const orders = cartState.orders.map(({ id, quantity }) => ({
        id,
        quantity,
      }));

      const body = JSON.stringify({
        products: orders,
        loc_address: location,
        loc_lng: coordinate.lng,
        loc_lat: coordinate.lat,
      });
      await API.post('/order', body, config);

      cartDispatch({
        type: 'RESET_CART',
      });

      history.push('/profile');
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddress = (address, lng, lat) => {
    setLocation(address);
    setCoordinate({
      lng,
      lat,
    });
  };

  // Renders.
  const renderOrders = () =>
    orders.map(({ name, quantity, id, price, img }) => (
      <CartOrderCard
        key={id}
        id={id}
        img={
          img
            ? img
            : 'https://www.starbucks.co.id/media/chocolate-croissant-reserve_tcm33-66591_w1024_n.jpg'
        }
        name={name}
        price={price}
        quantity={quantity}
        onChange={handleQuantityChange}
        onIncrease={() => handleIncrease(id, 1)}
        onDecrease={() => handleIncrease(id, -1)}
        onDelete={() => handleDelete(id)}
      />
    ));
  return (
    <>
      <Container style={{ marginTop: 60, marginBottom: 60 }}>
        <div className="app__header">
          {restaurantName
            ? restaurantName
            : 'You can put a food you want order first.'}
        </div>
        <div style={{ marginTop: 30 }}>
          <DeliveryLocationForm
            placeholder="Pick Your Location"
            value={location}
            coordinate={coordinate}
            onSubmit={handleAddress}
          />
        </div>
        {orders.length !== 0 ? (
          <>
            <div style={{ marginTop: 30 }}>
              <div className="cart__title">Review Your Order</div>
              <Row style={{ marginTop: 15 }}>
                <div className="cart__orders">{renderOrders()}</div>
                <div className="cart__info">
                  <div className="cart__detail-group">
                    <div className="cart__info-group">
                      <div className="cart__info-label">Subtotal</div>
                      <div className="cart__info-value app__text-red">
                        <NumberFormat
                          value={totalPrice}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="Rp "
                          displayType="text"
                        />
                      </div>
                    </div>
                    <div className="cart__info-group">
                      <div className="cart__info-label">Qty</div>
                      <div className="cart__info-value">{totalQuantity}</div>
                    </div>
                    <div className="cart__info-group">
                      <div className="cart__info-label">Ongkir</div>
                      <div className="cart__info-value app__text-red">
                        <NumberFormat
                          value={deliveryCost}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="Rp "
                          displayType="text"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="cart__total-group">
                    <div className="cart__info-group app__text-red app__text-bold">
                      <div className="cart__info-label">Total</div>
                      <div className="cart__info-value">
                        <NumberFormat
                          value={deliveryCost + totalPrice}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="Rp "
                          displayType="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
            </div>
            <div className="cart__button" onClick={handleOrder}>
              Order
            </div>
          </>
        ) : (
          restaurantId !== 0 && (
            <>
              <div className="cart__empty">
                Your cart is empty. You can order a food that you love
                from&nbsp;
                <Link to={`/shop/${restaurantId}`}>here.</Link>
              </div>
            </>
          )
        )}
      </Container>
    </>
  );
};

export default Cart;
