import { seedDatabase } from './seed-db.js';
import { getCart, addToCart, removeFromCart, updateQuantity, getCartTotal, updateCartUI } from './cart.js';
import { loginWithGoogle, logoutUser, observeAuth } from './auth-service.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initial UI Setup
    updateCartUI();

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // --- GLOBAL AUTH LOGIC (Direct Delegation for maximum reliability) ---
    const authModal = document.getElementById('auth-modal') || (() => {
        // Inject if missing (for all pages)
        const modalHtml = `
            <div class="modal-overlay" id="auth-modal">
                <div class="modal-content auth-modal-content">
                    <button class="close-modal" id="close-auth-modal"><i class="ph-light ph-x"></i></button>
                    <div class="auth-modal-header">
                        <div class="logo" style="margin-bottom: 10px;">Sorielle</div>
                        <h2 id="auth-modal-title">Welcome Back</h2>
                        <p id="auth-modal-subtitle">Experience luxury, redefined.</p>
                    </div>
                    <div class="auth-methods">
                        <button class="btn btn-google" id="google-signin-btn">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/layout/google.svg" alt="Google">
                            Continue with Google
                        </button>
                        <div class="auth-divider"><span>or</span></div>
                        <div class="auth-form">
                            <div class="form-group"><label>Email Address</label><input type="email" placeholder="name@example.com" id="auth-email"></div>
                            <button class="btn btn-primary" style="width: 100%; margin-top: 10px;" id="email-signin-btn">Continue</button>
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        return document.getElementById('auth-modal');
    })();

    window.toggleAuthModal = (show = true) => {
        if (show) authModal.classList.add('active');
        else authModal.classList.remove('active');
    };

    document.addEventListener('click', (e) => {
        const target = e.target;
        // Trigger Modal
        if (target.id === 'login-btn' || target.id === 'signup-btn' || 
            target.id === 'header-login-btn' || target.id === 'header-signup-btn' ||
            target.closest('.auth-trigger')) {
            console.log("Auth trigger clicked");
            window.toggleAuthModal(true);
        }
        // Close Modal
        if (target.id === 'close-auth-modal' || target.closest('#close-auth-modal') || target === authModal) {
            window.toggleAuthModal(false);
        }
        // Google Sign In
        if (target.id === 'google-signin-btn' || target.closest('#google-signin-btn')) {
            loginWithGoogle().then(() => window.toggleAuthModal(false)).catch(console.error);
        }
        // Logout
        if (target.id === 'logout-btn' || target.closest('#logout-btn')) {
            e.preventDefault();
            logoutUser();
        }
    });
    // --- END GLOBAL AUTH LOGIC ---

    // Force visibility for elements above the fold if observer is slow
    setTimeout(() => {
        document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) el.classList.add('visible');
        });
    }, 500);

    // Carousel Logic
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (n) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => showSlide(currentSlide + 1);

    const startSlideShow = () => {
        slideInterval = setInterval(nextSlide, 5000);
    };

    const stopSlideShow = () => {
        clearInterval(slideInterval);
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopSlideShow();
            startSlideShow();
        });
    });

    if (slides.length > 0) {
        startSlideShow();
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.85)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDropdown = document.getElementById('mobile-dropdown');
    
    if (mobileMenuBtn && mobileDropdown) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileDropdown.style.display = mobileDropdown.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Shade Selection
    const shadeBtns = document.querySelectorAll('.shade-btn');
    shadeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            shadeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Collapsible Logic
    const collapsibleHeader = document.querySelector('.collapsible-header');
    const collapsibleContent = document.querySelector('.collapsible-content');
    
    if (collapsibleHeader && collapsibleContent) {
        // Start closed
        collapsibleContent.style.display = 'none';
        
        collapsibleHeader.addEventListener('click', () => {
            const isHidden = collapsibleContent.style.display === 'none';
            collapsibleContent.style.display = isHidden ? 'block' : 'none';
            collapsibleHeader.querySelector('i').classList.toggle('ph-caret-up');
            collapsibleHeader.querySelector('i').classList.toggle('ph-caret-down');
        });
    }

    // Cart Logic Implementation
    const cartDrawer = document.getElementById('cart-drawer');
    const openCartBtn = document.getElementById('open-cart');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalValue = document.getElementById('cart-total-value');
    const checkoutModal = document.getElementById('checkout-modal');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
    const closeCheckout = document.getElementById('close-checkout');
    const orderForm = document.getElementById('order-form');
    const successOverlay = document.getElementById('success-overlay');
    const addToCartBtn = document.querySelector('.cta-btn');

    const updateAuthUI = (user) => {
        const authContainer = document.getElementById('auth-container');
        if (!authContainer) return;
        
        if (user) {
            authContainer.innerHTML = `
                <div class="user-profile-nav">
                    <img src="${user.photoURL || 'https://via.placeholder.com/32'}" alt="${user.displayName}" class="user-avatar">
                    <span class="user-name">${(user.displayName || 'User').split(' ')[0]}</span>
                    <div class="auth-dropdown">
                        <a href="dashboard.html" class="dropdown-item"><i class="ph-bold ph-user-circle"></i> Profile</a>
                        <div style="height: 1px; background: rgba(0,0,0,0.05); margin: 4px 0;"></div>
                        <a href="#" class="dropdown-item" id="logout-btn"><i class="ph-bold ph-sign-out"></i> Logout</a>
                    </div>
                </div>
            `;
        } else {
            authContainer.innerHTML = `
                <button class="btn-text auth-trigger" id="header-login-btn">Login</button>
                <button class="btn btn-primary btn-sm auth-trigger" id="header-signup-btn">Sign Up</button>
            `;
        }
    };

    observeAuth(updateAuthUI);

    const renderCart = () => {
        const cart = getCart();
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div style="text-align:center; padding: 40px; opacity: 0.5;">Your cart is empty</div>';
            cartTotalValue.innerText = '₹0.00';
            return;
        }

        cart.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-img"><img src="${item.image}" alt="${item.name}"></div>
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">${item.price}</p>
                    <div class="cart-item-controls">
                        <button class="qty-btn minus" data-index="${index}">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn plus" data-index="${index}">+</button>
                        <button class="remove-item" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        cartTotalValue.innerText = `₹${getCartTotal().toFixed(2)}`;
        
        // Add event listeners to controls
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => {
                updateQuantity(parseInt(btn.dataset.index), 1);
                renderCart();
            });
        });

        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => {
                updateQuantity(parseInt(btn.dataset.index), -1);
                renderCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(parseInt(btn.dataset.index));
                renderCart();
            });
        });
    };

    // Open/Close Cart
    if (openCartBtn) {
        openCartBtn.addEventListener('click', () => {
            renderCart();
            cartDrawer.classList.add('active');
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartDrawer.classList.remove('active');
        });
    }

    // Quick Add to Cart (Home & Category Page)
    document.querySelectorAll('.add-to-cart-quick').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const card = btn.closest('.product-card-interactive');
            if (card) {
                const product = {
                    id: card.dataset.id,
                    name: card.dataset.name,
                    price: card.dataset.price,
                    image: card.dataset.image
                };
                addToCart(product);
                renderCart();
                cartDrawer.classList.add('active');
            }
        });
    });

    // Add to Cart from Product Page
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productName = document.querySelector('.product-title')?.innerText;
            const productPrice = document.querySelector('.price-tag')?.innerText;
            const productImage = document.getElementById('main-product-image')?.src;
            const activeShade = document.querySelector('.shade-btn.active')?.title;

            if (productName && productPrice) {
                addToCart({
                    id: productName.toLowerCase().replace(/\s+/g, '-'),
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    shade: activeShade
                });
                
                // Show drawer
                renderCart();
                cartDrawer.classList.add('active');
            }
        });
    }

    // Initial UI update
    updateCartUI();

    // From Cart to Checkout
    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length === 0) return;
            window.location.href = 'checkout.html';
        });
    }

    if (closeCheckout) {
        closeCheckout.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Order Form Submission
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = orderForm.querySelector('.submit-order-btn');
            submitBtn.disabled = true;
            submitBtn.innerText = 'Processing...';

            const customerName = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            
            const cart = getCart();
            const total = getCartTotal();

            const orderData = {
                customerName,
                phone,
                address,
                city,
                items: cart,
                totalAmount: total,
                status: 'pending'
            };

            try {
                // 1. Save to Database
                const { createOrder } = await import('./db-service.js');
                await createOrder(orderData);

                // 2. Show Success Animation
                checkoutModal.classList.remove('active');
                successOverlay.classList.add('active');

                // 3. Construct WhatsApp Message for all items
                let itemsList = cart.map(item => `- ${item.name} (${item.shade || 'No shade'}) x${item.quantity}: ${item.price}`).join('\n');
                const message = `*New Multi-Item Order Confirmed!* \n\n*Items:*\n${itemsList}\n\n*Total:* ₹${total.toFixed(2)}\n\n*Customer Details:*\n- Name: ${customerName}\n- Phone: ${phone}\n- Address: ${address}, ${city}`;
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/919423646946?text=${encodedMessage}`;

                // 4. Clear Cart
                const { clearCart } = await import('./cart.js');
                clearCart();

                // 5. Redirect after short delay
                setTimeout(() => {
                    window.location.href = whatsappUrl;
                }, 2500);

            } catch (error) {
                console.error("Order failed: ", error);
                alert("Something went wrong. Please try again.");
                submitBtn.disabled = false;
                submitBtn.innerText = 'Confirm Order via WhatsApp';
            }
        });
    }
});
