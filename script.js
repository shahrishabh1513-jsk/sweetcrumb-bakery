(function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    function switchSection(sectionId) {
        sections.forEach(s => s.classList.remove('active-section'));
        const activeSection = document.getElementById(sectionId);
        if (activeSection) activeSection.classList.add('active-section');
        navLinks.forEach(link => {
            const linkSec = link.getAttribute('data-section');
            if (linkSec === sectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            if (sectionId) switchSection(sectionId);
        });
    });

    let cart = [];
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    const openBtn = document.getElementById('openCartBtn');
    const closeCart = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalSpan = document.getElementById('cartTotal');
    const cartCountSpan = document.getElementById('cartCount');

    openBtn.addEventListener('click', ()=> {
        cartSidebar.classList.add('open');
        overlay.classList.add('show');
    });

    function closeCartFunc() {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('show');
    }

    closeCart.addEventListener('click', closeCartFunc);
    overlay.addEventListener('click', closeCartFunc);

    function attachAddToCart() {
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.removeEventListener('click', addToCartHandler);
            btn.addEventListener('click', addToCartHandler);
        });
    }

    function addToCartHandler(e) {
        const card = e.currentTarget.closest('.product-card');
        if (!card) return;
        const name = card.dataset.name || 'item';
        const price = parseFloat(card.dataset.price || '0');
        const img = card.dataset.img || card.querySelector('.product-img')?.src || '';
        const existing = cart.find(item => item.name === name);
        if(existing) existing.quantity++;
        else cart.push({ name, price, img, quantity: 1 });
        updateCartDisplay();
        cartSidebar.classList.add('open');
        overlay.classList.add('show');
    }

    window.removeFromCart = function(index) {
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            updateCartDisplay();
        }
    };

    function updateCartDisplay() {
        if (!cartItemsContainer) return;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="padding: 1rem; text-align: center; background: #f9e4d6; border-radius: 30px;">your basket feels light 🥖</p>';
        } else {
            let html = '';
            cart.forEach((item, idx) => {
                html += `
                    <div class="cart-item">
                        <img src="${item.img}" class="cart-item-img" alt="${item.name}">
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)} x${item.quantity}</div>
                        </div>
                        <i class="fas fa-trash" style="color:#a5552c; cursor:pointer;" onclick="removeFromCart(${idx})"></i>
                    </div>
                `;
            });
            cartItemsContainer.innerHTML = html;
        }
        const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartTotalSpan.innerText = `total: $${total.toFixed(2)}`;
        cartCountSpan.innerText = itemCount;
        window.cart = cart;
    }

    document.querySelectorAll('.product-card').forEach(card => {
        if (!card.dataset.name) {
            const title = card.querySelector('.product-title')?.innerText || 'product';
            card.dataset.name = title;
        }
        if (!card.dataset.price) {
            const priceText = card.querySelector('.price')?.innerText.replace('$','') || '0';
            card.dataset.price = parseFloat(priceText);
        }
        if (!card.dataset.img) {
            const img = card.querySelector('.product-img')?.src || '';
            card.dataset.img = img;
        }
    });

    attachAddToCart();
    updateCartDisplay();
})();