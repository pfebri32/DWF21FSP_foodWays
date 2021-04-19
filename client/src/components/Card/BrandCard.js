// Styles.
import { Link } from 'react-router-dom';
import '../../styles/Card/BrandCard.css';

const BrandCard = ({ logo, name, to }) => {
    return (
        <Link className='bc__card' to={to}>
            <div className='bc__row'>
                <div className='bc__logo'><img src={logo} alt={name}/></div>
                <div className='bc__name'>{ name }</div>
            </div>
        </Link>
    )
}

export default BrandCard;
