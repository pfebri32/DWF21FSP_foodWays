import { Container } from 'react-bootstrap';

// Styles.
import '../styles/Hero.css';

const Hero = () => {
    return (
        <div className='Hero'>
            <Container>
                <div className='hero__row'>
                    <div className='hero__content'>
                        <div className='hero__header-group'>
                            <div className='hero__header'>Are You Hungry ?</div>
                            <div className='hero__header'>Express Home Delivery</div>
                        </div>
                        <div className='hero__subcontent'>
                            <div className='hero__underline'/>
                            <div className='hero__description'>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                            </div>
                        </div>
                    </div>
                    <div className='hero__background'>
                        <img src='/assets/pizza.png' alt='Foodways Background Pizza'/>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Hero;
