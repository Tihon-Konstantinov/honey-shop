// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand();

// Получаем элементы DOM
const productsContainer = document.getElementById('products');
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotalAmount = document.getElementById('cart-total-amount');
const continueShopping = document.getElementById('continue-shopping');
const checkout = document.getElementById('checkout');
const checkoutForm = document.getElementById('checkout-form');
const orderForm = document.getElementById('order-form');
const categoriesPage = document.getElementById('categories-page');
const sortPage = document.getElementById('sort-page');
const catalogPage = document.getElementById('catalog-page');
const deliveryAddress = document.getElementById('delivery-address');
const subtotalSpan = document.getElementById('subtotal');
const deliveryCostSpan = document.getElementById('delivery-cost');
const totalCostSpan = document.getElementById('total-cost');

// Состояние приложения
let cart = [];
let currentCategory = 'all';
let currentSort = 'default';
let products = [
    {
        id: 1,
        name: 'Набор "Вкусные моменты"',
        description: 'Весенний набор с мёдом и сладостями',
        price: 1200,
        image: 'images/products/honey_set1.jpg',
        category: 'all'
    },
    {
        id: 2,
        name: 'Набор "Сладкое желание"',
        description: 'Подарочный набор с мёдом и чаем',
        price: 1890,
        image: 'images/products/honey_set2.jpg',
        category: 'women'
    },
    {
        id: 3,
        name: 'Набор "Большой сюрприз"',
        description: 'Премиум набор с мёдом и деликатесами',
        price: 3670,
        image: 'images/products/honey_set3.jpg',
        category: 'all'
    },
    {
        id: 4,
        name: 'Набор "Карусель-1" с фруктами',
        description: 'Подарочный набор с мёдом и сухофруктами',
        price: 2540,
        image: 'images/products/honey_set4.jpg',
        category: 'all'
    }
];

// Функции сортировки
const sortFunctions = {
    'default': (a, b) => a.id - b.id,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'recommended': (a, b) => b.id - a.id,
    'new': (a, b) => b.id - a.id
};

// Отображение продуктов
function renderProducts() {
    productsContainer.innerHTML = '';
    let filteredProducts = products;
    
    // Фильтрация по категории
    if (currentCategory !== 'all') {
        filteredProducts = products.filter(product => product.category === currentCategory);
    }
    
    // Сортировка
    filteredProducts.sort(sortFunctions[currentSort]);

    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price} ₽</p>
                <button class="button primary" onclick="addToCart(${product.id})">
                    Добавить в корзину
                </button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Обработка категорий
categoriesPage.addEventListener('click', (e) => {
    const categoryItem = e.target.closest('.category-item');
    if (categoryItem) {
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('active');
        });
        categoryItem.classList.add('active');
        currentCategory = categoryItem.dataset.category;
        renderProducts();
    }
});

// Обработка сортировки
sortPage.addEventListener('click', (e) => {
    const sortItem = e.target.closest('.sort-item');
    if (sortItem) {
        document.querySelectorAll('.sort-item').forEach(item => {
            item.classList.remove('active');
        });
        sortItem.classList.add('active');
        currentSort = sortItem.dataset.sort;
        renderProducts();
    }
});

// Добавление товара в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartUI();
}

// Обновление UI корзины
function updateCartUI() {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryCost = document.querySelector('input[name="delivery"]:checked').value === 'delivery' ? 900 : 0;
    const total = subtotal + deliveryCost;

    document.querySelector('.cart-count').textContent = totalQuantity;
    document.querySelector('.cart-total').textContent = `${subtotal} ₽`;
    
    if (subtotalSpan) {
        subtotalSpan.textContent = `${subtotal} ₽`;
        deliveryCostSpan.textContent = `${deliveryCost} ₽`;
        totalCostSpan.textContent = `${total} ₽`;
    }

    renderCartItems();
}

// Отображение товаров в корзине
function renderCartItems() {
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${item.price} ₽</div>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });
}

// Обновление количества товара
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
        }
    }
    updateCartUI();
}

// Обработчики событий
cartButton.addEventListener('click', () => {
    cartModal.classList.add('active');
});

continueShopping.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

checkout.addEventListener('click', () => {
    cartModal.classList.remove('active');
    checkoutForm.classList.add('active');
    updateCartUI();
});

// Обработка способа доставки
document.querySelectorAll('input[name="delivery"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'delivery') {
            deliveryAddress.style.display = 'block';
        } else {
            deliveryAddress.style.display = 'none';
        }
        updateCartUI();
    });
});

orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(orderForm);
    const orderData = {
        items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
        })),
        user_data: {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            middlename: formData.get('middlename'),
            phone: formData.get('phone'),
            email: formData.get('email')
        },
        delivery: {
            type: formData.get('delivery'),
            city: formData.get('city'),
            address: formData.get('address')
        },
        payment: formData.get('payment'),
        total_amount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    };

    if (formData.get('delivery') === 'delivery') {
        orderData.total_amount += 900;
    }

    // Отправляем данные в Telegram WebApp
    tg.sendData(JSON.stringify(orderData));
    tg.close();
});

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    
    // Активируем первые элементы категорий и сортировки
    document.querySelector('.category-item').classList.add('active');
    document.querySelector('.sort-item').classList.add('active');
    
    // Инициализируем отображение формы адреса
    const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
    deliveryAddress.style.display = deliveryType === 'delivery' ? 'block' : 'none';
}); 