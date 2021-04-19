import NumberFormat from 'react-number-format';

// Styles.
import '../../styles/Card/ProductCard.css';

const ProductCard = ({ img, data, type, ...rest }) => {
  const renderType = () => {
    switch (type) {
      case 'order':
        return (
          <>
            <div className="pc__name">{data.name}</div>
            {/* <div className='pc__price'>{ `Rp ${data.price}` }</div> */}
            <div className="pc__price">
              <NumberFormat
                value={data.price}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                displayType="text"
              />
            </div>
            <div className="pc__order" onClick={() => rest.onOrder(data)}>
              Order
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="pc__name">{data.name}</div>
            <div className="pc__distance">{`${data.distance} KM`}</div>
          </>
        );
    }
  };
  return (
    <div className="pc__card" {...rest}>
      <div className="pc__image">
        <img src={img} alt={img} />
      </div>
      <div className="pc__content">{renderType()}</div>
    </div>
  );
};

export default ProductCard;
