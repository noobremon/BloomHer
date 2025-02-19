// Initialize Lucide icons
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Sticky header with background change
    const nav = document.querySelector('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize elements with full opacity
    document.querySelectorAll('.feature-card, .benefit-item, .hero-content, .hero-image').forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    });

    // Scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation with initial state
    document.querySelectorAll('.feature-card, .benefit-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });

    // Parallax effect for community section
    window.addEventListener('scroll', () => {
        const communitySection = document.querySelector('.community');
        if (communitySection) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            communitySection.style.backgroundPosition = `center ${rate}px`;
        }
    });

    // Dynamic gradient background on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (scrolled / maxScroll) * 100;
        
        document.body.style.background = `
            linear-gradient(135deg, 
            hsl(${scrollProgress}, 100%, 95%) 0%,
            white 50%,
            hsl(${scrollProgress + 30}, 100%, 95%) 100%)
        `;
    });

    // Dropdown Menu Toggle - Replace the existing dropdown code with this
    document.querySelectorAll('.dropdown-toggle').forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const dropdownMenu = item.nextElementSibling;
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            dropdownMenu.classList.toggle('show');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInside = event.target.closest('.dropdown-toggle') || event.target.closest('.dropdown-menu');
        if (!isClickInside) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });
});