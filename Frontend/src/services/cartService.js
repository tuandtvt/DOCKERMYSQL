import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const getCart = () => {
    return axios.get(`${API_URL}/cart`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};

const addToCart = (product_id, quantity) => {
    return axios.post(`${API_URL}/cart/add`, { product_id, quantity }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};

const updateCartItemQuantity = (cartItem_id, quantity) => {
    return axios.put(`${API_URL}/cart/update/${cartItem_id}`, { quantity }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};

const removeFromCart = (cartItem_id) => {
    return axios.delete(`${API_URL}/cart/remove/${cartItem_id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
};

export default {
    getCart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart
};
