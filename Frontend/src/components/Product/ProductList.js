import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import './ProductList.scss';
import cartService from '../../services/cartService';
import { requestPermission, receiveMessage } from '../../notifications';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/products')
            .then(response => {
                console.log('Products fetched:', response.data);
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });

        requestPermission();

        receiveMessage();

    }, []);

    const handleAddToCart = (product) => {
        cartService.addToCart(product.id, 1)
            .then(() => {
                console.log('Đã thêm sản phẩm vào giỏ hàng:', product);
            })
            .catch(error => {
                console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
            });
    };

    const goToCart = () => {
        history.push('/cart');
    };

    return (
        <div className="product-list-container">
            <h2>Danh sách sản phẩm</h2>
            <div className="cart-icon" onClick={goToCart}>
                🛒
            </div>
            <div className="products">
                {products.map(product => (
                    <div key={product.id} className="product-item" onClick={() => handleAddToCart(product)}>
                        <h3>{product.name}</h3>
                        <p>Giá: ${product.price}</p>
                        <p>{product.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
