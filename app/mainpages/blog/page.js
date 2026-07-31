'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const sampleBlogsData = [
  {
    id: 1,
    title: 'My PCOS Journey: From Diagnosis to Healing',
    author: 'Sarah Mitchell',
    date: 'March 15, 2025',
    category: 'PCOS Journey',
    image: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&q=80',
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
            
            <p>To anyone just starting their PCOS journey: there is hope. Take it one day at a time, celebrate small victories, and remember that you're not alone in this journey.</p>`,
  },
];

export default function BlogPage() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    let userBlogs = [];
    let loadMoreTimeoutId = null;

    let modal;
    let writeForm;
    let imageUrlInput;
    let imagePreview;
    let previewImg;
    let modalCloseBtn;
    let blogFormEl;
    let loadMoreBtn;
    let writeCtaBtn;
    let readMoreLinks = [];

    function showFullBlog(blogId) {
      const blog = [...sampleBlogsData, ...userBlogs].find((b) => b.id === parseInt(blogId, 10));
      if (!blog) return;

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
      if (window.lucide) window.lucide.createIcons();
    }

    function toggleWriteForm() {
      const form = document.querySelector('.write-blog-form');
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
      if (form.style.display === 'none') {
        document.querySelector('#blogForm').reset();
        document.querySelector('.image-preview').style.display = 'none';
      }
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
      if (window.lucide) window.lucide.createIcons();

      blogElement.querySelector('.read-more').addEventListener('click', (e) => {
        e.preventDefault();
        showFullBlog(blog.id);
      });
    }

    function deleteBlog(blogId) {
      if (confirm('Are you sure you want to delete this blog?')) {
        userBlogs = userBlogs.filter((blog) => blog.id !== blogId);
        const blogElement = document.querySelector(`[data-blog-id="${blogId}"]`);
        if (blogElement) {
          blogElement.remove();
        }
      }
    }

    function publishBlog() {
      const title = document.querySelector('#title').value;
      const author = document.querySelector('#author').value;
      const category = document.querySelector('#category').value;
      const content = document.querySelector('#content').value;
      const image = document.querySelector('#imageUrl').value;

      const img = new Image();
      img.onload = function () {
        const newBlog = {
          id: Date.now(),
          title,
          author,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          category,
          image,
          excerpt: `${content.substring(0, 150)}...`,
          content,
        };

        userBlogs.unshift(newBlog);
        addBlogToPage(newBlog);
        toggleWriteForm();
        document.querySelector('#blogForm').reset();
        document.querySelector('.image-preview').style.display = 'none';
      };

      img.onerror = function () {
        alert('Please provide a valid image URL before publishing.');
      };

      img.src = image;
    }

    function generateMoreBlogs() {
      return Array(6)
        .fill(null)
        .map((_, index) => ({
          id: Date.now() + index,
          title: `Sample Blog ${index + 1}`,
          author: 'Guest Author',
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          category: ['PCOS', 'Menstrual Health', 'Wellness', 'Support'][Math.floor(Math.random() * 4)],
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80',
          excerpt: 'This is a sample blog post that demonstrates the layout and styling...',
          content: `
            <p>This is a sample blog post that demonstrates the layout and styling of our blog platform. In a real implementation, this would contain meaningful content about personal experiences, advice, and support related to menstrual health and PCOS management.</p>
            
            <h3>Sample Heading</h3>
            
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        }));
    }

    function loadMoreStories() {
      loadMoreBtn.innerHTML = '<div class="loading-spinner"></div>';

      loadMoreTimeoutId = setTimeout(() => {
        const newBlogs = generateMoreBlogs();
        newBlogs.forEach((blog) => addBlogToPage(blog));

        loadMoreBtn.innerHTML = '<span>Load More Stories</span><i data-lucide="chevron-down" class="icon-tiny"></i>';
        if (window.lucide) window.lucide.createIcons();
      }, 1000);
    }

    // Expose the two functions referenced via inline onclick="..." string
    // attributes injected through innerHTML (Cancel button inside the
    // dynamically-created write-blog-form, and the delete button on each
    // dynamically-created post card) — matches the original blog.js,
    // where these were plain global (window-scoped) function declarations.
    window.toggleWriteForm = toggleWriteForm;
    window.deleteBlog = deleteBlog;

    const handleImageUrlInput = function () {
      const url = imageUrlInput.value;
      if (url) {
        previewImg.src = url;
        previewImg.onload = function () {
          imagePreview.style.display = 'block';
        };
        previewImg.onerror = function () {
          imagePreview.style.display = 'none';
          alert('Invalid image URL. Please provide a valid image URL.');
        };
      } else {
        imagePreview.style.display = 'none';
      }
    };

    const handleReadMoreClick = function (e) {
      e.preventDefault();
      const blogId = e.currentTarget.closest('article').dataset.blogId;
      showFullBlog(blogId);
    };

    const handleModalCloseClick = function () {
      modal.style.display = 'none';
    };

    const handleBlogFormSubmit = function (e) {
      e.preventDefault();
      publishBlog();
    };

    const handleLoadMoreClick = function () {
      loadMoreStories();
    };

    // Original first DOMContentLoaded block from blog.js.
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close"><i data-lucide="x"></i></button>
            <div class="full-blog-content"></div>
        </div>
    `;
    document.body.appendChild(modal);

    writeForm = document.createElement('div');
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

    imageUrlInput = document.querySelector('#imageUrl');
    imagePreview = document.querySelector('.image-preview');
    previewImg = document.querySelector('#imagePreview');

    imageUrlInput.addEventListener('input', handleImageUrlInput);

    readMoreLinks = Array.from(document.querySelectorAll('.read-more'));
    readMoreLinks.forEach((link) => link.addEventListener('click', handleReadMoreClick));

    modalCloseBtn = document.querySelector('.modal-close');
    modalCloseBtn.addEventListener('click', handleModalCloseClick);

    blogFormEl = document.querySelector('#blogForm');
    blogFormEl.addEventListener('submit', handleBlogFormSubmit);

    loadMoreBtn = document.querySelector('.load-more button');
    loadMoreBtn.addEventListener('click', handleLoadMoreClick);

    writeCtaBtn = document.querySelector('.write-cta .btn-primary');
    writeCtaBtn.addEventListener('click', toggleWriteForm);

    if (window.lucide) window.lucide.createIcons();

    // Second, originally-separate `DOMContentLoaded` block from blog.js.
    // Pre-existing dead/broken code: `#writeBlogForm` and `#blogGrid` do
    // not exist anywhere in blog.html, so `document.getElementById(...)`
    // returns null and the very next line (`blogForm.addEventListener`)
    // always throws a TypeError in the original site too. Preserved here
    // exactly, isolated in its own try/catch so it doesn't prevent the
    // block above from running (matching independently-invoked listeners).
    try {
      const blogForm = document.getElementById('writeBlogForm');
      const blogGrid = document.getElementById('blogGrid');

      blogForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = blogForm.querySelector('input[placeholder="Your Name"]').value.trim();
        const category = blogForm.querySelector('select').value;
        const title = blogForm.querySelector('input[placeholder="Blog Title"]').value.trim();
        const story = blogForm.querySelector('textarea').value.trim();
        const imageUpload = blogForm.querySelector('#imageUpload').files[0];

        if (!name || !category || !title || !story || !imageUpload) return;

        const blogCard = document.createElement('div');
        blogCard.classList.add('blog-card');

        const reader = new FileReader();
        reader.onload = function (ev) {
          const imageUrl = ev.target.result;

          blogCard.innerHTML = `
                <button class="delete-btn">Delete</button>
                <div class="post-image">
                    <img src="${imageUrl}" alt="${title}">
                </div>
                <h3>${title}</h3>
                <p class="blog-excerpt">${story}</p>
                <p class="blog-meta">By ${name} | Category: ${category}</p>
            `;

          blogGrid.appendChild(blogCard);
          blogForm.reset();
        };

        reader.readAsDataURL(imageUpload);
      });

      blogGrid.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('delete-btn')) {
          const blogCard = e.target.closest('.blog-card');
          if (blogCard) {
            blogCard.remove();
          }
        }
      });
    } catch (err) {
      console.error(err);
    }

    return () => {
      delete window.toggleWriteForm;
      delete window.deleteBlog;

      if (loadMoreTimeoutId) clearTimeout(loadMoreTimeoutId);

      if (imageUrlInput) imageUrlInput.removeEventListener('input', handleImageUrlInput);
      readMoreLinks.forEach((link) => link.removeEventListener('click', handleReadMoreClick));
      if (modalCloseBtn) modalCloseBtn.removeEventListener('click', handleModalCloseClick);
      if (blogFormEl) blogFormEl.removeEventListener('submit', handleBlogFormSubmit);
      if (loadMoreBtn) loadMoreBtn.removeEventListener('click', handleLoadMoreClick);
      if (writeCtaBtn) writeCtaBtn.removeEventListener('click', toggleWriteForm);

      if (modal) modal.remove();
      if (writeForm) writeForm.remove();
    };
  }, []);

  return (
    <>
      <title>BloomHer</title>
      <link rel="stylesheet" href="/stylepages/blog.css" />
      <Script
        src="https://unpkg.com/lucide@latest"
        strategy="afterInteractive"
        onReady={() => {
          if (window.lucide) window.lucide.createIcons();
        }}
      />

      <div className="min-h-screen">
        {/* Navigation */}
        <nav>
          <div className="container">
            <div className="nav-content">
              <div className="logo">
                <i data-lucide="heart" className="icon-rose"></i>
                <span className="brand">BloomHer</span>
              </div>
              <div className="nav-links">
                <a href="/">Home</a>
                <a href="/mainpages/blog" className="active">Blog</a>
                <a href="#write">Write a Story</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Featured Posts */}
        <section className="featured-posts">
          <div className="container">
            <h2>Featured Stories</h2>
            <div className="featured-grid">
              <article className="featured-post">
                <div className="post-image">
                  <img src="https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&q=80" alt="Woman practicing yoga" />
                  <div className="category">PCOS Journey</div>
                </div>
                <div className="post-content">
                  <h3>My PCOS Journey: From Diagnosis to Healing</h3>
                  <p className="post-meta">
                    <span><i data-lucide="user" className="icon-tiny"></i> Sarah Mitchell</span>
                    <span><i data-lucide="calendar" className="icon-tiny"></i> March 15, 2025</span>
                  </p>
                  <p className="post-excerpt">When I was diagnosed with PCOS at 25, I felt lost and overwhelmed. Here&apos;s how I found my path to healing through lifestyle changes and self-care...</p>
                  <a href="#" className="read-more">Read More <i data-lucide="arrow-right" className="icon-tiny"></i></a>
                </div>
              </article>

              <article className="featured-post">
                <div className="post-image">
                  <img src="https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?auto=format&fit=crop&q=80" alt="Support group meeting" />
                  <div className="category">Support</div>
                </div>
                <div className="post-content">
                  <h3>Supporting My Wife Through Her PCOS Battle</h3>
                  <p className="post-meta">
                    <span><i data-lucide="user" className="icon-tiny"></i> James Wilson</span>
                    <span><i data-lucide="calendar" className="icon-tiny"></i> March 10, 2025</span>
                  </p>
                  <p className="post-excerpt">As a husband, watching my wife struggle with PCOS was heartbreaking. Here&apos;s what I learned about being a supportive partner...</p>
                  <a href="#" className="read-more">Read More <i data-lucide="arrow-right" className="icon-tiny"></i></a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="recent-posts">
          <div className="container">
            <div className="section-header">
              <h2>Recent Stories</h2>
              <div className="categories">
                <button className="category-btn active">All</button>
                <button className="category-btn">PCOS</button>
                <button className="category-btn">Menstrual Health</button>
                <button className="category-btn">Wellness</button>
                <button className="category-btn">Support</button>
              </div>
            </div>

            <div className="posts-grid">
              <article className="post-card">
                <div className="post-image">
                  <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80" alt="Meditation session" />
                  <div className="category">Wellness</div>
                </div>
                <div className="post-content">
                  <h3>Finding Peace Through Mindfulness</h3>
                  <p className="post-meta">
                    <span><i data-lucide="user" className="icon-tiny"></i> Emma Lee</span>
                    <span><i data-lucide="calendar" className="icon-tiny"></i> March 8, 2025</span>
                  </p>
                  <p className="post-excerpt">How meditation and mindfulness helped me manage PCOS symptoms and reduce stress...</p>
                  <a href="#" className="read-more">Read More <i data-lucide="arrow-right" className="icon-tiny"></i></a>
                </div>
              </article>

              <article className="post-card">
                <div className="post-image">
                  <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80" alt="Healthy food" />
                  <div className="category">Menstrual Health</div>
                </div>
                <div className="post-content">
                  <h3>Natural Remedies for Menstrual Pain</h3>
                  <p className="post-meta">
                    <span><i data-lucide="user" className="icon-tiny"></i> Maya Patel</span>
                    <span><i data-lucide="calendar" className="icon-tiny"></i> March 5, 2025</span>
                  </p>
                  <p className="post-excerpt">Discovering the power of natural remedies and lifestyle changes in managing menstrual pain...</p>
                  <a href="#" className="read-more">Read More <i data-lucide="arrow-right" className="icon-tiny"></i></a>
                </div>
              </article>

              <article className="post-card">
                <div className="post-image">
                  <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80" alt="Support group" />
                  <div className="category">Support</div>
                </div>
                <div className="post-content">
                  <h3>Building a Support System</h3>
                  <p className="post-meta">
                    <span><i data-lucide="user" className="icon-tiny"></i> Rachel Chen</span>
                    <span><i data-lucide="calendar" className="icon-tiny"></i> March 3, 2025</span>
                  </p>
                  <p className="post-excerpt">The importance of having a strong support system when dealing with PCOS and how to build one...</p>
                  <a href="#" className="read-more">Read More <i data-lucide="arrow-right" className="icon-tiny"></i></a>
                </div>
              </article>
            </div>

            <div className="load-more">
              <button className="btn-secondary">
                <span>Load More Stories</span>
                <i data-lucide="chevron-down" className="icon-tiny"></i>
              </button>
            </div>
          </div>
        </section>

        {/* Write a Story CTA */}
        <section id="write" className="write-cta">
          <div className="container">
            <div className="cta-content">
              <i data-lucide="pen-tool" className="icon-large"></i>
              <h2>Share Your Story</h2>
              <p>Your experience could be the light that guides someone else through their journey.</p>
              <button className="btn-primary" id="startWritingBtn">
                <i data-lucide="edit-3" className="icon-small"></i>
                <span>Start Writing</span>
              </button>
            </div>
          </div>
        </section>

        {/*
          Write Blog Section — pre-existing bug preserved from the original
          blog.html: this section's source markup is malformed/incomplete
          (the intended "write blog" form content and its closing tags are
          missing). Per the HTML5 error-recovery parsing rules a real
          browser applies, the *actual* site footer (logo + About/Contact
          links) ends up nested inside this hidden (`display: none`)
          section instead of rendering as a normal page footer — meaning
          the footer never actually appears on the live original page.
          Reproduced verbatim below to match that exact (broken) rendered
          DOM/behavior, not the presumably-intended structure.
        */}
        <section className="write-blog" id="writeBlogSection" style={{ display: 'none' }}>
          <div className="container">
            <div className="write-blog-header">
              {/* Footer */}
              <footer>
                <div className="container">
                  <div className="footer-content">
                    <div className="footer-logo">
                      <i data-lucide="heart" className="icon-rose"></i>
                      <span className="brand">BloomHer</span>
                    </div>
                    <div className="footer-links">
                      <a href="/">About</a>
                      <a href="#">Contact Us</a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
