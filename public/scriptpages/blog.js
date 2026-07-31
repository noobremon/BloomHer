// Initialize Lucide icons
lucide.createIcons();

// Sample blog data
const sampleBlogs = [
    {
        id: 1,
        title: "My PCOS Journey: From Diagnosis to Healing",
        author: "Sarah Mitchell",
        date: "March 15, 2025",
        category: "PCOS Journey",
        image: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&q=80",
        excerpt: "When I was diagnosed with PCOS at 25, I felt lost and overwhelmed. Here's how I found my path to healing through lifestyle changes and self-care...",
        content: `
            <p>When I was diagnosed with PCOS at 25, my world felt like it had been turned upside down. The symptoms I'd been experiencing finally had a name, but that didn't make them any easier to deal with. Irregular periods, acne, weight gain, and the constant worry about fertility – it was overwhelming.</p>
            
            <p>My journey to healing began with small steps. First, I educated myself about PCOS and its effects on the body. I learned that while there's no cure, there are many ways to manage symptoms and improve quality of life.</p>
            
            <h3>Lifestyle Changes That Made a Difference</h3>
            
            <p>The biggest impact came from changing my diet and exercise routine. I started following a low-glycemic diet, which helped stabilize my blood sugar and reduce insulin resistance. Regular exercise, particularly strength training and yoga, became my daily companions.</p>
            
            <h3>Finding the Right Support</h3>
            
            <p>Perhaps the most crucial part of my journey was building a support system. I found an endocrinologist who listened to my concerns and worked with me to develop a treatment plan. I joined PCOS support groups where I could share experiences with others who understood exactly what I was going through.</p>
            
            <h3>Where I Am Today</h3>
            
            <p>Five years later, I'm in a much better place. My symptoms are managed, my cycles are more regular, and most importantly, I've learned to be patient and kind with myself. PCOS is still part of my life, but it no longer defines me.</p>
            
            <p>To anyone just starting their PCOS journey: there is hope. Take it one day at a time, celebrate small victories, and remember that you're not alone in this journey.</p>`
    },
];

let userBlogs = [];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI elements
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close"><i data-lucide="x"></i></button>
            <div class="full-blog-content"></div>
        </div>
    `;
    document.body.appendChild(modal);

    // Initialize write blog form
    const writeForm = document.createElement('div');
    writeForm.className = 'write-blog-form';
    writeForm.innerHTML = `
        <h3>Write Your Story</h3>
        <form id="blogForm">
            <div class="form-group">
                <label for="author">Your Name</label>
                <input type="text" id="author" required placeholder="Enter your name">
            </div>
            <div class="form-group">
                <label for="title">Title</label>
                <input type="text" id="title" required placeholder="Give your story a title">
            </div>
            <div class="form-group">
                <label for="category">Category</label>
                <select id="category" required>
                    <option value="PCOS">PCOS</option>
                    <option value="Menstrual Health">Menstrual Health</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Support">Support</option>
                </select>
            </div>
            <div class="form-group">
                <label for="imageUrl">Image URL</label>
                <input type="url" id="imageUrl" required placeholder="Enter a valid image URL (e.g., https://images.unsplash.com/...)">
                <p class="form-hint">Tip: You can use images from Unsplash by right-clicking an image and selecting 'Copy image address'</p>
            </div>
            <div class="image-preview" style="display: none;">
                <img id="imagePreview" src="" alt="Preview">
            </div>
            <div class="form-group">
                <label for="content">Your Story</label>
                <textarea id="content" required placeholder="Share your experience..."></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="toggleWriteForm()">Cancel</button>
                <button type="submit" class="btn-primary">Publish Story</button>
            </div>
        </form>
    `;
    document.querySelector('.write-cta .container').appendChild(writeForm);

    // Image preview functionality
    const imageUrlInput = document.querySelector('#imageUrl');
    const imagePreview = document.querySelector('.image-preview');
    const previewImg = document.querySelector('#imagePreview');

    imageUrlInput.addEventListener('input', function() {
        const url = this.value;
        if (url) {
            previewImg.src = url;
            previewImg.onload = function() {
                imagePreview.style.display = 'block';
            };
            previewImg.onerror = function() {
                imagePreview.style.display = 'none';
                alert('Invalid image URL. Please provide a valid image URL.');
            };
        } else {
            imagePreview.style.display = 'none';
        }
    });

    // Event Listeners
    document.querySelectorAll('.read-more').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const blogId = link.closest('article').dataset.blogId;
            showFullBlog(blogId);
        });
    });

    document.querySelector('.modal-close').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.querySelector('#blogForm').addEventListener('submit', (e) => {
        e.preventDefault();
        publishBlog();
    });

    // Load More Stories
    let currentPage = 1;
    const loadMoreBtn = document.querySelector('.load-more button');
    loadMoreBtn.addEventListener('click', loadMoreStories);

    // Write Story Button
    document.querySelector('.write-cta .btn-primary').addEventListener('click', toggleWriteForm);

    // Initialize Lucide icons for dynamic content
    lucide.createIcons();
});

function showFullBlog(blogId) {
    const blog = [...sampleBlogs, ...userBlogs].find(b => b.id === parseInt(blogId));
    if (!blog) return;

    const modal = document.querySelector('.modal');
    const content = modal.querySelector('.full-blog-content');
    
    content.innerHTML = `
        <img src="${blog.image}" alt="${blog.title}">
        <h2>${blog.title}</h2>
        <p class="post-meta">
            <span><i data-lucide="user" class="icon-tiny"></i> ${blog.author}</span>
            <span><i data-lucide="calendar" class="icon-tiny"></i> ${blog.date}</span>
        </p>
        <div class="content">${blog.content}</div>
    `;

    modal.style.display = 'block';
    lucide.createIcons();
}

function toggleWriteForm() {
    const form = document.querySelector('.write-blog-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    if (form.style.display === 'none') {
        document.querySelector('#blogForm').reset();
        document.querySelector('.image-preview').style.display = 'none';
    }
}

function publishBlog() {
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const category = document.querySelector('#category').value;
    const content = document.querySelector('#content').value;
    const image = document.querySelector('#imageUrl').value;

    // Validate image URL
    const img = new Image();
    img.onload = function() {
        // Image is valid, proceed with publishing
        const newBlog = {
            id: Date.now(),
            title,
            author,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            category,
            image,
            excerpt: content.substring(0, 150) + "...",
            content
        };

        userBlogs.unshift(newBlog);
        addBlogToPage(newBlog);
        toggleWriteForm();
        document.querySelector('#blogForm').reset();
        document.querySelector('.image-preview').style.display = 'none';
    };
    
    img.onerror = function() {
        alert('Please provide a valid image URL before publishing.');
    };
    
    img.src = image;
}

function addBlogToPage(blog) {
    const postsGrid = document.querySelector('.posts-grid');
    const blogElement = document.createElement('article');
    blogElement.className = 'post-card';
    blogElement.dataset.blogId = blog.id;
    
    blogElement.innerHTML = `
        <div class="post-image">
            <img src="${blog.image}" alt="${blog.title}">
            <div class="category">${blog.category}</div>
        </div>
        <div class="post-content">
            <h3>${blog.title}</h3>
            <p class="post-meta">
                <span><i data-lucide="user" class="icon-tiny"></i> ${blog.author}</span>
                <span><i data-lucide="calendar" class="icon-tiny"></i> ${blog.date}</span>
            </p>
            <p class="post-excerpt">${blog.excerpt}</p>
            <a href="#" class="read-more">Read More <i data-lucide="arrow-right" class="icon-tiny"></i></a>
        </div>
        <button class="delete-blog" onclick="deleteBlog(${blog.id})">
            <i data-lucide="trash-2"></i>
        </button>
    `;

    postsGrid.insertBefore(blogElement, postsGrid.firstChild);
    lucide.createIcons();

    // Add read more event listener
    blogElement.querySelector('.read-more').addEventListener('click', (e) => {
        e.preventDefault();
        showFullBlog(blog.id);
    });
}

function deleteBlog(blogId) {
    if (confirm('Are you sure you want to delete this blog?')) {
        userBlogs = userBlogs.filter(blog => blog.id !== blogId);
        const blogElement = document.querySelector(`[data-blog-id="${blogId}"]`);
        if (blogElement) {
            blogElement.remove();
        }
    }
}

function loadMoreStories() {
    const loadMoreBtn = document.querySelector('.load-more button');
    loadMoreBtn.innerHTML = '<div class="loading-spinner"></div>';

    // Simulate loading delay
    setTimeout(() => {
        // Add 6 more sample blogs
        const newBlogs = generateMoreBlogs();
        newBlogs.forEach(blog => addBlogToPage(blog));

        loadMoreBtn.innerHTML = '<span>Load More Stories</span><i data-lucide="chevron-down" class="icon-tiny"></i>';
        lucide.createIcons();
    }, 1000);
}

function generateMoreBlogs() {
    // Generate 6 sample blogs with different content
    return Array(6).fill(null).map((_, index) => ({
        id: Date.now() + index,
        title: `Sample Blog ${index + 1}`,
        author: "Guest Author",
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        category: ["PCOS", "Menstrual Health", "Wellness", "Support"][Math.floor(Math.random() * 4)],
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80",
        excerpt: "This is a sample blog post that demonstrates the layout and styling...",
        content: `
            <p>This is a sample blog post that demonstrates the layout and styling of our blog platform. In a real implementation, this would contain meaningful content about personal experiences, advice, and support related to menstrual health and PCOS management.</p>
            
            <h3>Sample Heading</h3>
            
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`
    }));
}

document.addEventListener('DOMContentLoaded', () => {
    const blogForm = document.getElementById('writeBlogForm');
    const blogGrid = document.getElementById('blogGrid');

    blogForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve form data
        const name = blogForm.querySelector('input[placeholder="Your Name"]').value.trim();
        const category = blogForm.querySelector('select').value;
        const title = blogForm.querySelector('input[placeholder="Blog Title"]').value.trim();
        const story = blogForm.querySelector('textarea').value.trim();
        const imageUpload = blogForm.querySelector('#imageUpload').files[0];

        // Only create the blog card if all fields are filled
        if (!name || !category || !title || !story || !imageUpload) return;

        // Create a new blog card element
        const blogCard = document.createElement('div');
        blogCard.classList.add('blog-card');

        // Create a FileReader to read the uploaded image
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;

            blogCard.innerHTML = `
                <button class="delete-btn">Delete</button>
                <div class="post-image">
                    <img src="${imageUrl}" alt="${title}">
                </div>
                <h3>${title}</h3>
                <p class="blog-excerpt">${story}</p>
                <p class="blog-meta">By ${name} | Category: ${category}</p>
            `;

            // Append the new blog card to the blog grid
            blogGrid.appendChild(blogCard);

            // Reset the form for the next submission
            blogForm.reset();
        };

        // Read the uploaded image as a data URL
        reader.readAsDataURL(imageUpload);
    });

    // Attach an event listener to the blog grid for delete actions
    blogGrid.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('delete-btn')) {
            // Remove the blog card containing the clicked delete button
            const blogCard = e.target.closest('.blog-card');
            if (blogCard) {
                blogCard.remove();
            }
        }
    });
});