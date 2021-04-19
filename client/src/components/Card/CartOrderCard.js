import NumberFormat from 'react-number-format';

// Styles.
import '../../styles/Card/CartOrderCard.css';

const CartOrderCard = ({ id, name, price, img, quantity, onIncrease, onDecrease, onChange, onDelete }) => {
    return (
        <div className='coc__card'>
            <div className='coc__image'><img src={img} alt='Cart Order'/></div>
            <div className='coc__content'>
                <div className='coc__top'>
                    <div className='coc__name'>{ name }</div>
                    {/* <div className='coc__price'>{ `Rp ${price}` }</div> */}
                    <div className='coc__price'>
                        <NumberFormat 
                            value={price} 
                            thousandSeparator='.' 
                            decimalSeparator=','
                            prefix='Rp '
                            displayType='text'
                        />    
                    </div>
                </div>
                <div className='coc__bottom'>
                    <div className='coc__quantity-controller'>
                        <div className='coc__decrease' onClick={onDecrease}>-</div>
                        <input 
                            className='coc__quantity' 
                            data-orderid={id}
                            type='number' 
                            min='1'
                            value={quantity}
                            onChange={onChange}
                        />
                        <div className='coc__increase' onClick={onIncrease}>+</div>
                    </div>
                    <div className='coc__delete' onClick={onDelete}><img src='/assets/trash.svg' alt='Delete Icon'/></div>
                </div>
            </div>
        </div>
    )
}

export default CartOrderCard;
