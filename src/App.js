import React, { useState, useEffect } from 'react';
import { commerce } from './library/commerce';
import { Products, Navbar, Cart, Checkout } from './components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});


    const fetchProducts = async () => {
      const { data } = await commerce.products.list();

      setProducts(data);
    }

    const fetchCart = async () => {
      const cart = await commerce.cart.retrieve();

      setCart(cart);
    }

    const handleAddToCart = async (productId, quantity) => {
      const { cart } = await commerce.cart.add(productId, quantity);

      setCart(cart);
    }

    const handleUpdateCartQty = async (productId, quantity) => {
      const { cart } = await commerce.cart.update(productId, { quantity });

      setCart(cart)
    }

    const handleRemoveFromCart = async (productId) => {
      const { cart } = await commerce.cart.remove(productId);

      setCart(cart);
    }

    const handleEmptyCart = async () => {
      const { cart } = await commerce.cart.empty();

      setCart(cart);
    }

    const handleCheckout = async (checkoutTokenId, newOrder) => {
      try {
        const completeOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

        setOrder(completeOrder);
        resetCart();
      } catch (error) {
        console.log(error);
      }
    }

    const resetCart = async () => {
      const newCart = await commerce.cart.refresh();
      
      setCart(newCart);
    }

    useEffect(() => {
      fetchProducts();
      fetchCart();
    },[]);

    console.log(cart);

    return (
      <Router>
        <div>
          <Navbar totalItems={cart.total_items} />
          <Routes>
            <Route exact path="/" element={<Products products={products} onAddToCart={handleAddToCart} />} />
            <Route 
              exact path="/cart" 
              element={
                <Cart 
                  cart={cart} 
                  handleUpdateCartQty={handleUpdateCartQty} 
                  handleEmptyCart={handleEmptyCart} 
                  handleRemoveFromCart={handleRemoveFromCart}
                  />}
            />
            <Route exact path="/checkout" element={<Checkout cart={cart} order={order} handleCheckout={handleCheckout}/>} />
          </Routes>
        </div>
      </Router>
    )
}

export default App
