import { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router';

// Contexts.
import { CartContext } from '../contexts/cartContext';

// Components.
import ProductCard from '../components/Card/ProductCard';

// Configs.
import { API } from '../config/api';

const Menu = () => {
  // Contexts.
  // eslint-disable-next-line
  const [state, dispatch] = useContext(CartContext);

  // Vars and States.
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  // Queries.
  const [loading, setLoading] = useState(true);
  const getProducts = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      const { data } = res.data;
      setRestaurant({
        name: data.user.name,
        menus: data.products,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Renders.
  const renderMenus = () =>
    restaurant?.menus.map((menu) => (
      <Col lg="3" key={menu.id} style={{ marginBottom: 30 }}>
        <ProductCard
          data={menu}
          type="order"
          img={
            menu.img
              ? menu.img
              : 'https://www.starbucks.co.id/media/chocolate-croissant-reserve_tcm33-66591_w1024_n.jpg'
          }
          onOrder={handleOrder}
        />
      </Col>
    ));

  // Handlers.
  const handleOrder = (menu) => {
    console.log('shop', restaurant);
    dispatch({
      type: 'ADD_CART',
      payload: {
        restaurantId: id,
        restaurantName: restaurant.name,
        menu,
      },
    });
  };
  return (
    <>
      <Container style={{ marginTop: 60, marginBottom: 60 }}>
        {!loading ? (
          restaurant ? (
            <>
              <div className="app__header">{`Menu on ${restaurant?.name}.`}</div>
              <Row style={{ marginTop: 30 }}>{renderMenus()}</Row>
            </>
          ) : (
            <div className="app__header">The shop doesn't exist.</div>
          )
        ) : (
          <div className="app__header">Loading...</div>
        )}
      </Container>
    </>
  );
};

export default Menu;
