/**
 * Cart Management Service
 * Production-level state management using LocalStorage
 */

export const getCart = () => {
    const cart = localStorage.getItem('sorielle_cart');
    return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
    localStorage.setItem('sorielle_cart', JSON.stringify(cart));
    updateCartUI();
};

export const addToCart = (product) => {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id && item.shade === product.shade);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    return cart;
};

export const removeFromCart = (index) => {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    return cart;
};

export const updateQuantity = (index, delta) => {
    const cart = getCart();
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart(cart);
    return cart;
};

export const clearCart = () => {
    localStorage.removeItem('sorielle_cart');
    updateCartUI();
};

export const getCartTotal = () => {
    const cart = getCart();
    return cart.reduce((total, item) => total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity), 0);
};

export const updateCartUI = () => {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart badges in all pages
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.innerText = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    });

    // Trigger cart drawer refresh if it exists
    const event = new CustomEvent('cartUpdated', { detail: cart });
    window.dispatchEvent(event);
};
