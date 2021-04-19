import { useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

// Components.
import LoginForm from './Form/LoginForm';
import RegisterForm from './Form/RegisterForm';

// Contexts.
import { UserContext } from '../contexts/userContext';
import { CartContext } from '../contexts/cartContext';

// Configs.
import { setAuthToken } from '../config/api';

// Styles.
import styles from '../styles/NavbarV2.module.css';
import modalStyles from '../styles/Modal/AuthModal.module.css';

const NavbarV2 = () => {
  const [state, dispatch] = useContext(UserContext);
  const [cartState, cartDispatch] = useContext(CartContext);
  const { isLogin, user } = state;
  const isPartner = user?.role === 'partner';

  const history = useHistory();
  const [modalShow, setModalShow] = useState(false);
  const [dropdownShow, setDropdownShow] = useState(false);
  const [hasAccount, setHasAccount] = useState(true);

  const handleModal = (target) => setModalShow(target);
  const handleLogout = () => {
    cartDispatch({
      type: 'RESET_CART',
    });
    dispatch({
      type: 'LOGOUT',
    });
    setDropdownShow(false);
    setAuthToken();
    history.push('/');
  };
  return (
    <>
      <div className={styles.gap} />
      <div className={styles.navbar}>
        <Container className={styles.container}>
          <div className={styles.row}>
            <Link
              className={styles.logo}
              to="/"
              onClick={() => setDropdownShow(false)}
            >
              <img src="/assets/logo.svg" alt="logo" />
            </Link>
            <div className={styles.navlist}>
              {isLogin ? (
                <>
                  <Link
                    className={styles.cart}
                    to="/cart"
                    onClick={() => setDropdownShow(false)}
                  >
                    <img src="/assets/basket.svg" alt="cart" />
                    {cartState.totalQuantity > 0 && (
                      <div className={styles.counter}>
                        {cartState.totalQuantity}
                      </div>
                    )}
                  </Link>
                  <div
                    className={styles.profile}
                    onClick={() => setDropdownShow((prev) => !prev)}
                  >
                    <img
                      src={
                        state?.user?.img
                          ? state.user.img
                          : '/assets/profile.jpg'
                      }
                      alt="profile"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={styles.button}
                    to="/"
                    onClick={() => {
                      setHasAccount(false);
                      setModalShow(true);
                    }}
                  >
                    Register
                  </div>
                  <div
                    className={styles.button}
                    to="/"
                    onClick={() => {
                      setHasAccount(true);
                      setModalShow(true);
                    }}
                  >
                    Login
                  </div>
                </>
              )}

              {/* DROPDOWN */}
              {isLogin && (
                <div
                  className={`${styles.dropdown} ${
                    dropdownShow ? styles.show : styles.hide
                  }`}
                >
                  <div className={styles.triangle}>
                    <img src="/assets/triangle.svg" alt="triangle" />
                  </div>
                  <div className={styles.dropdown__group}>
                    <Link
                      className={styles.dropdown__menu}
                      to="/profile"
                      onClick={() => setDropdownShow((prev) => !prev)}
                    >
                      <div className={styles.dropdown__icon}>
                        <img src="/assets/user.svg" alt="user" />
                      </div>
                      <div className={styles.dropdown__title}>
                        {isPartner ? 'Profile Partner' : 'Profile'}
                      </div>
                    </Link>
                    {isPartner && (
                      <>
                        <Link
                          className={styles.dropdown__menu}
                          to="/product/add"
                          onClick={() => setDropdownShow(false)}
                        >
                          <div className={styles.dropdown__icon}>
                            <img src="/assets/product.svg" alt="product" />
                          </div>
                          <div className={styles.dropdown__title}>
                            Add Product
                          </div>
                        </Link>
                        <Link
                          className={styles.dropdown__menu}
                          to="/transaction"
                          onClick={() => setDropdownShow(false)}
                        >
                          <div className={styles.dropdown__icon}>
                            <img src="/assets/product.svg" alt="product" />
                          </div>
                          <div className={styles.dropdown__title}>
                            Transaction
                          </div>
                        </Link>
                      </>
                    )}
                  </div>
                  <div className={styles.dropdown__group}>
                    <div
                      className={styles.dropdown__menu}
                      onClick={() => handleLogout()}
                    >
                      <div className={styles.dropdown__icon}>
                        <img src="/assets/logout.svg" alt="user" />
                      </div>
                      <div className={styles.dropdown__title}>Logout</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* MODAL */}
      {!isLogin && (
        <>
          <div
            className={`${modalStyles.shadow} ${
              modalShow ? modalStyles.show : modalStyles.hide
            }`}
            onClick={() => handleModal(false)}
          />
          <div
            className={`${modalStyles.modal} ${
              modalShow ? modalStyles.show : modalStyles.hide
            }`}
          >
            {hasAccount ? (
              <>
                <div style={{ marginTop: 30 }} />
                <LoginForm
                  style={{ margin: '30px 0' }}
                  onClose={() => setModalShow(false)}
                  onSwitch={() => setHasAccount(false)}
                />
                <div style={{ marginTop: 30 }} />
              </>
            ) : (
              <>
                <div style={{ marginTop: 30 }} />
                <RegisterForm
                  style={{ margin: '30px 0' }}
                  onClose={() => setModalShow(false)}
                  onSwitch={() => setHasAccount(true)}
                />
                <div style={{ marginTop: 30 }} />
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default NavbarV2;
