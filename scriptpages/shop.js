// Initialize Lucide icons
lucide.createIcons();

// Product data
const products = [
    {
        id: 1,
        name: "Sofy anti bacteria sanitary pads (xl) 48 pads",
        price: 320, // Price in rupees
        description: "Chemical-free, eco-friendly sanitary pads for sensitive skin",
        image: "https://rukminim2.flixcart.com/image/850/1000/xif0q/sanitary-pad-pantyliner/b/i/q/secure-cottony-regular-230-mm-18-regular-1-sanitary-pad-stayfree-original-imagw3sjbgvndau9.jpeg?q=20&crop=false  ",
        category: "Menstrual Care"
    },
    {
        id: 2,
        name: "GynoCup 10ml Ayurvedic Cramp Relief Roll-On for Period & Body Pain - Quick Relief ...Liquid",
        price: 179, // Price in rupees
        description: "Essential supplements for managing PCOS symptoms",
        image: "https://m.media-amazon.com/images/I/71S7eD-H0JL.jpg  ",
        category: "Wellness"
    },
    {
        id: 3,
        name: "Dr Trust Usa Orthopaedic Electric Heat Belt For Menstrual Cramps, Body & Knee Shoulder",
        price: 849, // Price in rupees
        description: "Soothing herbal tea blend for menstrual comfort",
        image: "https://m.media-amazon.com/images/I/81P56OASgcL.jpg ",
        category: "Wellness"
    },
    {
        id: 4,
        name: "Eco Femme Vibrant Organic Full Cycle Kit",
        price: 1799, // Price in rupees
        description: "Eco Friendly Cycle Kit",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvAdcoCDrqhprdcKbsGrNPqzIb2noBBMOosw&s",
        category: "Personal Care"
    },
    {
        id: 5,
        name: "The Chill Kit | Period Comfort Kit | Menstrual Care for Women | Menstrual Pain Relief",
        price: 879, // Price in rupees
        description: "Comfortable, absorbent period underwear made from sustainable bamboo",
        image: "https://periodbuddy.care/cdn/shop/files/ChillKit.jpg?v=1702649794&width=416",
        category: "Clothing"
    },
    {
        id: 6,
        name: "Himalaya V- Gel",
        price: 120, // Price in rupees
        description: "Hormone-balancing feminine hygiene gel",
        image: "https://himalayawellness.in/cdn/shop/products/v-gel.jpg?v=1622097551",
        category: "Skincare"
    },
    {
        id: 7,
        name: "Whisper choice ultra sanitary pads (xl) 6 pads With Wings ",
        price: 440, // Price in rupees
        description: "Chemical-free, eco-friendly sanitary pads for sensitive skin",
        image: "https://m.media-amazon.com/images/I/71r-i1EtMtL.jpg",
        category: "Menstrual Care"
    },
    {
        id: 8,
        name: "Bella Tampo Mini Easy Twist 16'S",
        price: 149 , // Price in rupees
        description: "100% organic cotton tampons without harmful chemicals",
        image: "https://m.media-amazon.com/images/I/71vsEgu5qPL.jpg",
        category: "Menstrual Care"
    },
    {
        id: 9,
        name: "Steadfast Nutrition Steadlytes Instant Electrolytes & Vitamins By nutrabay.com",
        price: 199, // Price in rupees
        description: "Herbal tea blend to support hormonal balance",
        image: "https://cdn2.nutrabay.com/uploads/product/featured_image/product-4078-featured_image-Steadfast_Nutrition_Steadlytes_Instant_Electrolytes__Vitamins.jpg",
        category: "Wellness"
    },
    {
        id: 10,
        name: "Rash-Free and 100% Biodegradable Sanitary Pads (9 pads)",
        price: 249, // Price in rupees
        description: "Eco Friendly Pads",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtyZ4Dqi4WuLwRxnMTcsWyOEkrSoNRthRiyQ&s",
        category: "Personal Care"
    },
    {
        id: 11,
        name: "VWash Plus Expert Intimate Hygiene Liquid Wash (100ml)",
        price: 199, // Price in rupees
        description: "Targeted treatment for intimate hygiene",
        image: "https://m.media-amazon.com/images/I/5188cGUuY8L.jpg",
        category: "Skincare"
    },
    {
        id: 13,
        name: "Mankind Intiwash New Feminine Hygiene Wash 100 ml",
        price: 167, // Price in rupees
        description: "Targeted treatment for intimate hygiene",
        image: "https://www.netmeds.com/images/product-v1/600x600/825582/intiwash_new_liquid_wash_100ml_64062_0_2.jpg",
        category: "Skincare"
    },
    {
        id: 12,
        name: "Pee Safe Aloe Vera Panty Liners (50 Liners) Panty Liner",
        price: 199, // Price in rupees
        description: "High-waisted leggings with tummy control",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVuYx3iNoT6PGWZcwGBi7OfeKl3KKw6f0lxw&s",
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
    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <div class="product-price">₹${product.price}</div>
                    <button class="add-to-cart" onclick="addToCart('${product.id}')">
                        <span>Add</span>
                        <i data-lucide="shopping-cart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Make sure to initialize Lucide icons after adding products
function initializeProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
    lucide.createIcons();
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

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const productCategory = card.querySelector('.product-category').textContent.toLowerCase();
            const productDescription = card.querySelector('.product-description')?.textContent.toLowerCase() || '';
            
            if (productName.includes(searchTerm) || 
                productCategory.includes(searchTerm) || 
                productDescription.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Search only when clicking the search button
    searchButton.addEventListener('click', performSearch);

    // Also allow search when pressing Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    lucide.createIcons(); // Initialize Lucide icons
});