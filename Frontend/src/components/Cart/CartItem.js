import React from 'react';
import './CartItem.scss';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (e) => {
    onUpdateQuantity(item.id, parseInt(e.target.value));
  };

  return (
    <div className="cart-item">
      <img src={item.imageUrl} alt={item.name} />
      <div className="item-details">
        <h4>{item.name}</h4>
        <p>Price: ${item.price}</p>
        <input
          type="number"
          value={item.quantity}
          min="1"
          onChange={handleQuantityChange}
        />
        <button onClick={() => onRemove(item.id)}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
