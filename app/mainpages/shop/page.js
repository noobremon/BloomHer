'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const products = [
  {
    id: 1,
    name: 'Sofy anti bacteria sanitary pads (xl) 48 pads',
    price: 320,
    description: 'Chemical-free, eco-friendly sanitary pads for sensitive skin',
    image: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/sanitary-pad-pantyliner/b/i/q/secure-cottony-regular-230-mm-18-regular-1-sanitary-pad-stayfree-original-imagw3sjbgvndau9.jpeg?q=20&crop=false  ',
    category: 'Menstrual Care',
  },
  {
    id: 2,
    name: 'GynoCup 10ml Ayurvedic Cramp Relief Roll-On for Period & Body Pain - Quick Relief ...Liquid',
    price: 179,
    description: 'Essential supplements for managing PCOS symptoms',
    image: 'https://m.media-amazon.com/images/I/71S7eD-H0JL.jpg  ',
    category: 'Wellness',
  },
  {
    id: 3,
    name: 'Dr Trust Usa Orthopaedic Electric Heat Belt For Menstrual Cramps, Body & Knee Shoulder',
    price: 849,
    description: 'Soothing herbal tea blend for menstrual comfort',
    image: 'https://m.media-amazon.com/images/I/81P56OASgcL.jpg ',
    category: 'Wellness',
  },
  {
    id: 4,
    name: 'Eco Femme Vibrant Organic Full Cycle Kit',
    price: 1799,
    description: 'Eco Friendly Cycle Kit',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvAdcoCDrqhprdcKbsGrNPqzIb2noBBMOosw&s',
    category: 'Personal Care',
  },
  {
    id: 5,
    name: 'The Chill Kit | Period Comfort Kit | Menstrual Care for Women | Menstrual Pain Relief',
    price: 879,
    description: 'Comfortable, absorbent period underwear made from sustainable bamboo',
    image: 'https://periodbuddy.care/cdn/shop/files/ChillKit.jpg?v=1702649794&width=416',
    category: 'Clothing',
  },
  {
    id: 6,
    name: 'Himalaya V- Gel',
    price: 120,
    description: 'Hormone-balancing feminine hygiene gel',
    image: 'https://himalayawellness.in/cdn/shop/products/v-gel.jpg?v=1622097551',
    category: 'Skincare',
  },
  {
    id: 7,
    name: 'Whisper choice ultra sanitary pads (xl) 6 pads With Wings ',
    price: 440,
    description: 'Chemical-free, eco-friendly sanitary pads for sensitive skin',
    image: 'https://m.media-amazon.com/images/I/71r-i1EtMtL.jpg',
    category: 'Menstrual Care',
  },
  {
    id: 8,
    name: "Bella Tampo Mini Easy Twist 16'S",
    price: 149,
    description: '100% organic cotton tampons without harmful chemicals',
    image: 'https://m.media-amazon.com/images/I/71vsEgu5qPL.jpg',
    category: 'Menstrual Care',
  },
  {
    id: 9,
    name: 'Steadfast Nutrition Steadlytes Instant Electrolytes & Vitamins By nutrabay.com',
    price: 199,
    description: 'Herbal tea blend to support hormonal balance',
    image: 'https://cdn2.nutrabay.com/uploads/product/featured_image/product-4078-featured_image-Steadfast_Nutrition_Steadlytes_Instant_Electrolytes__Vitamins.jpg',
    category: 'Wellness',
  },
  {
    id: 10,
    name: 'Rash-Free and 100% Biodegradable Sanitary Pads (9 pads)',
    price: 249,
    description: 'Eco Friendly Pads',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtyZ4Dqi4WuLwRxnMTcsWyOEkrSoNRthRiyQ&s',
    category: 'Personal Care',
  },
  {
    id: 11,
    name: 'VWash Plus Expert Intimate Hygiene Liquid Wash (100ml)',
    price: 199,
    description: 'Targeted treatment for intimate hygiene',
    image: 'https://m.media-amazon.com/images/I/5188cGUuY8L.jpg',
    category: 'Skincare',
  },
  {
    id: 13,
    name: 'Mankind Intiwash New Feminine Hygiene Wash 100 ml',
    price: 167,
    description: 'Targeted treatment for intimate hygiene',
    image: 'https://www.netmeds.com/images/product-v1/600x600/825582/intiwash_new_liquid_wash_100ml_64062_0_2.jpg',
    category: 'Skincare',
  },
  {
    id: 14,
    name: 'Sirona Reusable Menstrual Cup - (Medium)',
    price: 285,
    description: 'Targeted treatment for intimate hygiene',
    image: 'https://m.media-amazon.com/images/I/71KWZwaDQvL.jpg',
    category: 'Menstrual Care',
  },
  {
    id: 15,
    name: 'Plush Panty Liners',
    price: 88,
    description: 'Targeted treatment for intimate hygiene',
    image: 'https://m.media-amazon.com/images/I/51FAVrPxP0L.jpg',
    category: 'Clothing',
  },
  {
    id: 16,
    name: 'Rebelle Reusable Cloth Panty Liners Pack of 4 (Mini) | Safest Panty Liners',
    price: 397,
    description: 'Eco-Friendly Panties for intimate hygiene',
    image: 'https://m.media-amazon.com/images/I/81oxgIxm7US.jpg',
    category: 'Personal Care',
  },
  {
    id: 12,
    name: 'Pee Safe Aloe Vera Panty Liners (50 Liners) Panty Liner',
    price: 199,
    description: 'High-waisted leggings with tummy control',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVuYx3iNoT6PGWZcwGBi7OfeKl3KKw6f0lxw&s',
    category: 'Clothing',
  },
];

export default function ShopPage() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    let cart = [];

    const productsGrid = document.getElementById('productsGrid');
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const cartCount = document.getElementById('cartCount');
    const mobileCartCount = document.getElementById('mobileCartCount');
    const categoryButtons = document.querySelectorAll('.category-button');

    function handleMenuButtonClick() {
      const menuIcon = menuButton.querySelector('i');
      if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        menuIcon.setAttribute('data-lucide', 'menu');
      } else {
        mobileMenu.classList.add('active');
        menuIcon.setAttribute('data-lucide', 'x');
      }
      if (window.lucide) window.lucide.createIcons();
    }
    if (menuButton) {
      menuButton.addEventListener('click', handleMenuButtonClick);
    }

    function updateCartCount() {
      const count = cart.length;
      cartCount.textContent = count;
      mobileCartCount.textContent = count;
    }

    function addToCart(product) {
      cart.push(product);
      updateCartCount();
    }

    function formatPrice(price) {
      return `\u20b9${price.toLocaleString('en-IN')}`;
    }

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

      const addToCartButton = card.querySelector('.add-to-cart');
      addToCartButton.addEventListener('click', () => addToCart(product));

      return card;
    }

    function filterProducts(category) {
      const filteredProducts = category === 'all'
        ? products
        : products.filter((product) => product.category === category);

      productsGrid.innerHTML = '';
      filteredProducts.forEach((product) => {
        productsGrid.appendChild(createProductCard(product));
      });
      if (window.lucide) window.lucide.createIcons();
    }

    function handleCategoryButtonClick(button) {
      categoryButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      filterProducts(button.dataset.category);
    }
    const categoryButtonHandlers = [];
    categoryButtons.forEach((button) => {
      const handler = () => handleCategoryButtonClick(button);
      categoryButtonHandlers.push(handler);
      button.addEventListener('click', handler);
    });

    filterProducts('all');

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    function performSearch() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const productCards = document.querySelectorAll('.product-card');

      productCards.forEach((card) => {
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

    function handleSearchKeypress(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    }

    if (searchButton) {
      searchButton.addEventListener('click', performSearch);
    }
    if (searchInput) {
      searchInput.addEventListener('keypress', handleSearchKeypress);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener('click', handleMenuButtonClick);
      }
      categoryButtons.forEach((button, index) => {
        button.removeEventListener('click', categoryButtonHandlers[index]);
      });
      if (searchButton) {
        searchButton.removeEventListener('click', performSearch);
      }
      if (searchInput) {
        searchInput.removeEventListener('keypress', handleSearchKeypress);
      }
      if (productsGrid) {
        productsGrid.innerHTML = '';
      }
    };
  }, []);

  return (
    <>
      <title>BloomHer</title>
      <link rel="stylesheet" href="/stylepages/shop.css" />
      <Script
        src="https://unpkg.com/lucide@latest"
        strategy="afterInteractive"
        onReady={() => {
          if (window.lucide) window.lucide.createIcons();
        }}
      />

      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <h1><i data-lucide="heart" className="brand-icon"></i> BloomHer</h1>
            </div>

            <div className="nav-search desktop-only">
              <div className="search-container">
                <input type="text" id="searchInput" placeholder="Search products..." />
                <button type="button" id="searchButton" className="search-button">
                  <i data-lucide="search"></i>
                </button>
              </div>
            </div>

            <div className="nav-actions desktop-only">
              <a href="/" className="icon-button">
                <i data-lucide="home"></i>
              </a>
              <button className="icon-button">
                <i data-lucide="heart"></i>
              </button>
              <div className="cart-button">
                <i data-lucide="shopping-cart"></i>
                <span className="cart-count" id="cartCount">0</span>
              </div>
            </div>

            <button className="menu-button mobile-only" id="menuButton">
              <i data-lucide="menu"></i>
            </button>
          </div>
        </nav>

        <div className="mobile-menu" id="mobileMenu">
          <div className="mobile-menu-content">
            <div className="search-container">
              <input type="text" id="searchInput" placeholder="Search products..." />
              <button type="button" id="searchButton" className="search-button">
                <i data-lucide="search"></i>
              </button>
            </div>
            <button className="mobile-menu-item">
              <i data-lucide="heart"></i>
              <span>Wishlist</span>
            </button>
            <button className="mobile-menu-item">
              <i data-lucide="shopping-cart"></i>
              <span>Cart (<span id="mobileCartCount">0</span>)</span>
            </button>
          </div>
        </div>

        <main className="main-content">
          <div className="header">
            <h2>Featured Products</h2>
            <p>Carefully curated products for your wellness journey</p>
          </div>

          <div className="category-filters">
            <button className="category-button active" data-category="all">All</button>
            <button className="category-button" data-category="Menstrual Care">Flow Essentials</button>
            <button className="category-button" data-category="Skincare">Hygiene Hub</button>
            <button className="category-button" data-category="Wellness">Comfort & Care</button>
            <button className="category-button" data-category="Clothing">Wellness & Life Style</button>
            <button className="category-button" data-category="Personal Care">Eco-Friendly Options</button>
          </div>

          <div className="products-grid" id="productsGrid"></div>
        </main>
      </div>
    </>
  );
}
