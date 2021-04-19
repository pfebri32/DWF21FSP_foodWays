import { useContext, useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Components.
import HistoryCard from '../../components/Card/HistoryCard';

// Configs.
import { API } from '../../config/api';
import { UserContext } from '../../contexts/userContext';

// Styles.
import '../../styles/Profile.css';

const Index = () => {
  // Vars and States.
  const [state, dispatch] = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const isPartner = state.user.role === 'partner';

  // Queries.
  const getMyOrders = async () => {
    try {
      const res = await API.get('/my-orders');
      setOrders(res.data.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyOrders();
  }, []);

  // Renders.
  const renderHistories = () =>
    orders?.map(({ id, status, partner, products, createdAt }) => {
      const totalCost = products.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
      const date = new Date(createdAt);
      return (
        <HistoryCard
          key={id}
          name={partner.name}
          date={date.toLocaleDateString()}
          cost={totalCost}
          to={`/order/${id}`}
          status={status}
        />
      );
    });
  return (
    <>
      <Container style={{ marginTop: 60, marginBottom: 60 }}>
        <Row>
          <div className="profile__info">
            <div className="app__header">
              {isPartner ? 'Profile Partner' : 'My Profile'}
            </div>
            <div className="profile__content">
              <div className="profile__left">
                <div className="profile__image">
                  <img
                    src={
                      state.user.img ? state.user.img : '/assets/profile.jpg'
                    }
                    alt="Profile"
                  />
                </div>
                <Link className="profile__button normalize" to="/profile/edit">
                  Edit Profile
                </Link>
              </div>
              <div className="profile__right">
                <div className="profile__info-group">
                  <div className="profile__info-label">
                    Name{isPartner && ' Partner'}
                  </div>
                  <div className="profile__info-value">{state.user.name}</div>
                </div>
                <div className="profile__info-group">
                  <div className="profile__info-label">Email</div>
                  <div className="profile__info-value">{state.user.email}</div>
                </div>
                <div className="profile__info-group">
                  <div className="profile__info-label">Phone</div>
                  <div className="profile__info-value">{state.user.phone}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="profile__history">
            <div className="app__header">
              {isPartner ? 'History Order' : 'History Transaction'}
            </div>
            <div className="profile__history-list">{renderHistories()}</div>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Index;
