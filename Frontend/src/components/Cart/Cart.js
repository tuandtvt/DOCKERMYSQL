import React, { useEffect, useState } from 'react';
import CartItem from './CartItem';
import cartService from '../../services/cartService';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    cartService.getCart()
      .then(response => {
        console.log('>>> check response.data', response.data.products)
        setCartItems(response.data.products);
      })
      .catch(error => {
        console.error('Failed to fetch cart items', error);
      });
  }, []);

  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemove = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        cartItems.map(item => (
          <CartItem
            key={item.id}
            item={item}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
          />
        ))
      )}
    </div>
  );
};

export default Cart;
