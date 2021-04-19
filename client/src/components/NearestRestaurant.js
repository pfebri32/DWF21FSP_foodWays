import { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Contexts.
import { RestaurantContext } from '../contexts/restaurantContext';

// Components.
import ProductCard from './Card/ProductCard';

const NearestRestaurant = ({ style }) => {
  const [state] = useContext(RestaurantContext);
  const renderRestaurants = () => {
    const sortedRestaurantsByDistanceAsc = state.restaurants.sort(
      (a, b) => a.distance - b.distance
    );
    const result = sortedRestaurantsByDistanceAsc.slice(0, 4);
    return result.map((restaurant) => (
      <Col lg="3" key={restaurant.id}>
        <Link className="normalize" to={`/shop/${restaurant.id}`}>
          <ProductCard data={restaurant} img={restaurant.img} />
        </Link>
      </Col>
    ));
  };
  return (
    <div style={style}>
      <Container>
        <div className="app__header">Restaurant Near You</div>
        <Row style={{ marginTop: 30 }}>{renderRestaurants()}</Row>
      </Container>
    </div>
  );
};

export default NearestRestaurant;
