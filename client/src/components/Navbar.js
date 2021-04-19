import { useContext, useState } from 'react';
import { Container, Modal } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

// Contexts.
import { UserContext } from '../contexts/userContext';
import { CartContext } from '../contexts/cartContext';

// Components.
import LoginForm from './Form/LoginForm';
import RegisterForm from './Form/RegisterForm';

// Styles.
import '../styles/Navbar.css';
import '../styles/Modal.css';

const Navbar = () => {

    // Contexts.
    const [userState] = useContext(UserContext);
    const [cartState] = useContext(CartContext);

    // States and variables.
    const query = new URLSearchParams(useLocation().search);
    const { isLogin } = userState;
    const { orders } = cartState;
    const [show, setShow] = useState(query.get('modal') && isLogin);
    const [isDropdown, setIsDropdown] = useState(false);
    const [hasAccount, setHasAccount] = useState(true);

    // Handlers.
    const handleClose = () => setShow(false);
    const handleOpenLogin = () => {
        setHasAccount(true);
        setShow(true);
    };
    const handleOpenRegister = () => {
        setHasAccount(false);
        setShow(true);
    };
    return (
        <>
            <div className='Navbar'>
                <Container>
                    <div className='navbar__navs'>
                        <div className='navbar__logo'>
                            <Link to='/'>
                                <img src='/assets/logo.svg' alt='Foodways Logo'/>
                            </Link>
                        </div>
                        <div className='navbar__menus'>
                            {
                                isLogin ? (
                                    <>
                                        <Link  className='navbar__icon-link navbar__cart-basket' to='/cart'>
                                            <img src='/assets/basket.svg' alt='Cart Icon'/>
                                            {
                                                orders.length > 0 && (
                                                    <div className='navbar__cart-counter'>
                                                        { cartState.totalQuantity < 100 ? cartState.totalQuantity : '99+'}
                                                    </div>
                                                )
                                            }
                                        </Link>
                                        <div className='navbar__user-profile' onClick={() => setIsDropdown(prev => !prev)}>
                                            <img src='/assets/profile.jpg' alt='User Profile'/>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className='navbar__link' onClick={handleOpenRegister}>Register</div>
                                        <div className='navbar__link' onClick={handleOpenLogin}>Login</div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </Container>
            </div>

            <div className='navbar__fixed-filler'/>

            {
                isLogin && (
                    <div className={ `navbar__dropdown ${isDropdown && 'show'}` }>
                        <div className='navbar__dropdown-group'>
                            <Link className='normalize' to='/profile' onClick={() => setIsDropdown(false)}>
                                <div className='navbar__dropdown-icon'><img src='/assets/user.svg' alt='User Icon'/></div>
                                <div className='navbar__dropdown-title'>Profile</div>
                            </Link>
                            {
                                userState.user.role === 'partner' && (
                                    <Link className='normalize' to='/product/add' onClick={() => setIsDropdown(false)}>
                                        <div className='navbar__dropdown-icon'><img src='/assets/product.svg' alt='Product Icon'/></div>
                                        <div className='navbar__dropdown-title'>Add Product</div>
                                    </Link>
                                )
                            }
                        </div>
                        <div className='navbar__dropdown-group'>
                            <Link className='normalize' to='/logout' onClick={() => setIsDropdown(false)}>
                                <div className='navbar__dropdown-icon'><img src='/assets/logout.svg' alt='Logout Icon'/></div>
                                <div className='navbar__dropdown-title'>Logout</div>
                            </Link>
                        </div>
                    </div>
                )
            }

            <Modal 
                centered
                show={show}
                contentClassName='modal__content'
                dialogClassName='modal__dialog'
                onHide={handleClose}
            >
                { 
                    hasAccount ? 
                        <LoginForm onSwitch={handleOpenRegister} onModalClose={handleClose}/> 
                    : 
                        <RegisterForm onSwitch={handleOpenLogin} onModalClose={handleClose}/> 
                }
            </Modal>
        </>
    )
}

export default Navbar;
