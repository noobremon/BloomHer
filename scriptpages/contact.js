document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const socialIcons = document.querySelectorAll('.social-icon');

    // Handle form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Message sent successfully!';
        document.body.appendChild(successMessage);

        // Show success message
        successMessage.style.display = 'block';

        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
            successMessage.remove();
            
            // Reset form
            contactForm.reset();
            
            // Redirect to home page after message
            window.location.href = 'index.html';
        }, 3000);
    });

    // Add hover effect to social icons
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });

        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});