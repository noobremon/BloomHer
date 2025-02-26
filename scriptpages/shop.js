// Initialize Lucide icons
lucide.createIcons();

// Product data
const products = [
    {
        id: 1,
        name: "sofy anti bacteria sanitary pads (xl) 48 pads",
        price: 320, // Price in rupees
        description: "Chemical-free, eco-friendly sanitary pads for sensitive skin",
        image: "https://images.app.goo.gl/bCvTy4oKz1k7ke3TA",
        category: "Menstrual Care"
    },
    {
        id: 2,
        name: "PCOS Supplement Bundle",
        price: 4999, // Price in rupees
        description: "Essential supplements for managing PCOS symptoms",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=500",
        category: "Wellness"
    },
    {
        id: 3,
        name: "Organic Period Tea",
        price: 1599, // Price in rupees
        description: "Soothing herbal tea blend for menstrual comfort",
        image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=500",
        category: "Wellness"
    },
    {
        id: 4,
        name: "Heat Therapy Pad",
        price: 2999, // Price in rupees
        description: "Electric heating pad for cramp relief",
        image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=500",
        category: "Personal Care"
    },
    {
        id: 5,
        name: "Bamboo Period Underwear",
        price: 2499, // Price in rupees
        description: "Comfortable, absorbent period underwear made from sustainable bamboo",
        image: "https://images.unsplash.com/photo-1566207474742-de921626ad0c?auto=format&fit=crop&q=80&w=500",
        category: "Clothing"
    },
    {
        id: 6,
        name: "Natural Face Serum",
        price: 3499, // Price in rupees
        description: "Hormone-balancing face serum for acne-prone skin",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=500",
        category: "Skincare"
    },
    {
        id: 7,
        name: "Menstrual Cup",
        price: 2999, // Price in rupees
        description: "Medical-grade silicone menstrual cup for eco-friendly period care",
        image: "https://images.unsplash.com/photo-1631549913936-500fabf10c06?auto=format&fit=crop&q=80&w=500",
        category: "Menstrual Care"
    },
    {
        id: 8,
        name: "Organic Cotton Tampons",
        price: 899, // Price in rupees
        description: "100% organic cotton tampons without harmful chemicals",
        image: "https://images.unsplash.com/photo-1631549913912-1c13a6c56c9c?auto=format&fit=crop&q=80&w=500",
        category: "Menstrual Care"
    },
    {
        id: 9,
        name: "Hormone Balance Tea",
        price: 1999, // Price in rupees
        description: "Herbal tea blend to support hormonal balance",
        image: "https://images.unsplash.com/photo-1597481499711-b7e10b9f3f10?auto=format&fit=crop&q=80&w=500",
        category: "Wellness"
    },
    {
        id: 10,
        name: "Eco-friendly Razor",
        price: 2599, // Price in rupees
        description: "Sustainable metal razor with replaceable blades",
        image: "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&q=80&w=500",
        category: "Personal Care"
    },
    {
        id: 11,
        name: "Acne Treatment Serum",
        price: 3999, // Price in rupees
        description: "Targeted treatment for hormonal acne",
        image: "https://images.unsplash.com/photo-1620916565839-1f7809db7c3e?auto=format&fit=crop&q=80&w=500",
        category: "Skincare"
    },
    {
        id: 12,
        name: "Yoga Leggings",
        price: 4599, // Price in rupees
        description: "High-waisted leggings with tummy control",
        image: "https://images.unsplash.com/photo-1548663512-4a5a34291cf6?auto=format&fit=crop&q=80&w=500",
        category: "Clothing"
    }
];

// Cart state
let cart = [];

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const menuButton = document.getElementById('menuButton');
const mobileMenu = document.getElementById('mobileMenu');
const cartCount = document.getElementById('cartCount');
const mobileCartCount = document.getElementById('mobileCartCount');
const categoryButtons = document.querySelectorAll('.category-button');

// Toggle mobile menu
menuButton.addEventListener('click', () => {
    const menuIcon = menuButton.querySelector('i');
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        menuIcon.setAttribute('data-lucide', 'menu');
    } else {
        mobileMenu.classList.add('active');
        menuIcon.setAttribute('data-lucide', 'x');
    }
    lucide.createIcons();
});

// Update cart count
function updateCartCount() {
    const count = cart.length;
    cartCount.textContent = count;
    mobileCartCount.textContent = count;
}

// Add to cart
function addToCart(product) {
    cart.push(product);
    updateCartCount();
}

// Format price
function formatPrice(price) {
    return `₹${price.toLocaleString('en-IN')}`; // Convert to Indian format with ₹ symbol
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <button class="wishlist-button">
                <i data-lucide="heart"></i>
            </button>
        </div>
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-footer">
                <span class="product-price">${formatPrice(product.price)}</span>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `;

    // Add to cart functionality
    const addToCartButton = card.querySelector('.add-to-cart');
    addToCartButton.addEventListener('click', () => addToCart(product));

    return card;
}

// Filter products by category
function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    productsGrid.innerHTML = '';
    filteredProducts.forEach(product => {
        productsGrid.appendChild(createProductCard(product));
    });
    lucide.createIcons();
}

// Category filter buttons
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterProducts(button.dataset.category);
    });
});

// Initial render
filterProducts('all');