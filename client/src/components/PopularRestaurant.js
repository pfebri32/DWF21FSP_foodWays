import { useContext, useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

// Configs.
import { API } from '../config/api';

// Contexts.
import { RestaurantContext } from '../contexts/restaurantContext';

// Components.
import BrandCard from './Card/BrandCard';

const PopularRestaurant = ({ style }) => {
  // States.
  const [partners, setPartners] = useState(null);
  const [loading, setLoading] = useState(true);

  // Queries.
  const getPopularPartners = async () => {
    try {
      const partners = await API.get('/partners/most?limit=4');
      let results = partners.data.data.users;
      const length = results.length;

      if (length < 4) {
        let ids = results.map(({ id }) => id);
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const body = JSON.stringify({
          ids,
        });
        const more = 4 - length;
        const additionals = await API.post(
          `/partners?limit=${more}`,
          body,
          config
        );
        results = results.concat(additionals.data.data.users);
      }

      setPartners(results);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPopularPartners();
  }, []);

  // Renders.
  const renderRestaurants = () => {
    return partners?.map(({ id, img, name }) => (
      <Col lg="3" key={id}>
        <BrandCard name={name} logo={img} to={`/shop/${id}`} />
      </Col>
    ));
  };
  return (
    <div style={style}>
      <Container>
        <div className="app__header">Popular Restaurant</div>
        {!loading && <Row style={{ marginTop: 30 }}>{renderRestaurants()}</Row>}
      </Container>
    </div>
  );
};

export default PopularRestaurant;
