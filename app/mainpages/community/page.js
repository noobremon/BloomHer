'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function CommunityPage() {
  const communityDataRef = useRef({
    posts: [],
    comments: [],
    reactions: [],
  });

  function saveCommunityData() {
    localStorage.setItem('cyclecare_community_data', JSON.stringify(communityDataRef.current));
  }

  function loadCommunityData() {
    const savedData = localStorage.getItem('cyclecare_community_data');
    if (savedData) {
      communityDataRef.current = JSON.parse(savedData);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }

  // Check if item is liked
  function isLiked(targetId, targetType) {
    return communityDataRef.current.reactions.some((r) =>
      r.targetId === targetId && r.targetType === targetType);
  }

  // Show create post modal
  function showCreatePostModal() {
    document.getElementById('createPostModal').style.display = 'block';
  }

  // Close modal
  function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
  }

  // Delete post
  function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
      // Remove post
      communityDataRef.current.posts = communityDataRef.current.posts.filter((post) => post.id !== postId);

      // Remove associated comments
      communityDataRef.current.comments = communityDataRef.current.comments.filter((comment) => comment.postId !== postId);

      // Remove associated reactions
      communityDataRef.current.reactions = communityDataRef.current.reactions.filter((reaction) =>
        !(reaction.targetId === postId && reaction.targetType === 'post'));

      saveCommunityData();
      renderPosts();
    }
  }

  // Handle post submission
  function handlePostSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const imageUrl = document.getElementById('postImage').value;
    const isAnonymous = document.getElementById('isAnonymous').checked;
    const displayName = isAnonymous ? 'Anonymous' : (document.getElementById('displayName').value || 'Anonymous');

    // Ensure title and content are not empty
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required.');
      return;
    }

    const post = {
      id: Date.now(),
      author: displayName,
      title,
      content,
      imageUrl,
      date: new Date().toISOString(),
      likes: 0,
      comments: 0,
    };

    communityDataRef.current.posts.unshift(post);
    saveCommunityData();
    renderPosts();
    closeModal('createPostModal');
    event.target.reset();
    document.querySelector('.image-preview').style.display = 'none';
  }

  // Handle comment submission
  function handleCommentSubmit(event) {
    event.preventDefault();

    const postId = parseInt(event.target.dataset.postId, 10);
    const commentText = document.getElementById('commentText').value;

    if (!commentText.trim()) return;

    const comment = {
      id: Date.now(),
      postId,
      author: 'Anonymous',
      text: commentText,
      date: new Date().toISOString(),
      likes: 0,
      replies: [],
    };

    communityDataRef.current.comments.push(comment);

    // Update post's comment count
    const post = communityDataRef.current.posts.find((p) => p.id === postId);
    if (post) {
      post.comments++;
    }

    saveCommunityData();
    renderComments(postId);
    // Update the posts grid to reflect new comment count
    renderPosts();
    event.target.reset();
  }

  // Handle reply submission
  function handleReplySubmit(event, commentId) {
    event.preventDefault();

    const replyText = event.target.querySelector('textarea').value;
    if (!replyText.trim()) return;

    const comment = communityDataRef.current.comments.find((c) => c.id === commentId);
    if (!comment) return;

    const reply = {
      id: Date.now(),
      author: 'Anonymous',
      text: replyText,
      date: new Date().toISOString(),
      likes: 0,
    };

    comment.replies.push(reply);
    saveCommunityData();
    renderComments(comment.postId);
    // Update the posts grid to reflect new reply
    renderPosts();
  }

  // Toggle like on post
  function toggleLike(postId) {
    const post = communityDataRef.current.posts.find((p) => p.id === postId);
    if (!post) return;

    const reaction = communityDataRef.current.reactions.find((r) =>
      r.targetId === postId && r.targetType === 'post');

    if (reaction) {
      post.likes--;
      communityDataRef.current.reactions = communityDataRef.current.reactions.filter((r) =>
        r.targetId !== postId || r.targetType !== 'post');
    } else {
      post.likes++;
      communityDataRef.current.reactions.push({
        targetId: postId,
        targetType: 'post',
        type: 'like',
      });
    }

    saveCommunityData();
    renderPosts();
  }

  // Toggle like on comment
  function toggleCommentLike(commentId) {
    const comment = communityDataRef.current.comments.find((c) => c.id === commentId);
    if (!comment) return;

    const reaction = communityDataRef.current.reactions.find((r) =>
      r.targetId === commentId && r.targetType === 'comment');

    if (reaction) {
      comment.likes--;
      communityDataRef.current.reactions = communityDataRef.current.reactions.filter((r) =>
        r.targetId !== commentId || r.targetType !== 'comment');
    } else {
      comment.likes++;
      communityDataRef.current.reactions.push({
        targetId: commentId,
        targetType: 'comment',
        type: 'like',
      });
    }

    saveCommunityData();
    renderComments(comment.postId);
  }

  // Show reply form
  function showReplyForm(commentId) {
    const replyForm = document.querySelector(`#replyForm-${commentId}`);
    if (replyForm) {
      replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
    }
  }

  // Filter posts
  // NOTE: the original `filterPosts()` located the clicked filter button via
  // `document.querySelector('[onclick="filterPosts(\'trending\')"]')` — a
  // lookup against the literal `onclick` HTML attribute. Since these buttons
  // now use React's `onClick` prop (required for a JSX conversion) instead of
  // a literal `onclick` attribute, that attribute no longer exists in the
  // rendered DOM, so the lookup would always return `null` and throw when
  // `.classList.add('active')` was called on it — breaking filtering
  // entirely. To keep the actual (working) original behavior intact, the
  // clicked button element is passed in directly instead of being
  // re-discovered via that now-nonexistent attribute.
  function filterPosts(filter, buttonEl) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach((btn) => btn.classList.remove('active'));
    if (buttonEl) {
      buttonEl.classList.add('active');
    }

    let filteredPosts = [...communityDataRef.current.posts];

    switch (filter) {
      case 'trending':
        filteredPosts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
        break;
      case 'recent':
        filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      default:
        break;
    }

    renderPosts(filteredPosts);
  }

  // Show comments modal
  function showComments(postId) {
    const post = communityDataRef.current.posts.find((p) => p.id === postId);
    if (!post) return;

    const modal = document.getElementById('commentsModal');
    const postDetails = document.getElementById('modalPostDetails');
    const commentForm = document.getElementById('commentForm');

    postDetails.innerHTML = `
        <h2>${post.title}</h2>
        <div class="post-meta">
            <span>${post.author}</span>
            <span>${formatDate(post.date)}</span>
        </div>
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post image" class="post-image">` : ''}
        <p class="post-text">${post.content}</p>
        <div class="post-actions">
            <button class="action-btn ${isLiked(post.id, 'post') ? 'liked' : ''}" 
                    onclick="toggleLike(${post.id})">
                <i data-lucide="heart"></i>
                <span>${post.likes}</span>
            </button>
            <button class="action-btn">
                <i data-lucide="message-circle"></i>
                <span>${post.comments}</span>
            </button>
        </div>
    `;

    commentForm.dataset.postId = postId;
    renderComments(postId);
    modal.style.display = 'block';
    if (window.lucide) window.lucide.createIcons();
  }

  // Render posts
  function renderPosts(posts = communityDataRef.current.posts) {
    const grid = document.getElementById('postsGrid');
    grid.innerHTML = '';

    posts.forEach((post) => {
      const article = document.createElement('article');
      article.className = 'post-card';
      article.innerHTML = `
            ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post image" class="post-image">` : ''}
            <button class="delete-blog" onclick="deletePost(${post.id})">
                <i data-lucide="trash-2"></i>
            </button>
            <div class="post-content">
                <div class="post-meta">
                    <span>${post.author}</span>
                    <span>${formatDate(post.date)}</span>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-text">${truncateText(post.content, 150)}</p>
                <div class="post-actions">
                    <button class="action-btn ${isLiked(post.id, 'post') ? 'liked' : ''}" 
                            onclick="toggleLike(${post.id})">
                        <i data-lucide="heart"></i>
                        <span>${post.likes}</span>
                    </button>
                    <button class="action-btn" onclick="showComments(${post.id})">
                        <i data-lucide="message-circle"></i>
                        <span>${post.comments}</span>
                    </button>
                </div>
            </div>
        `;
      grid.appendChild(article);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // Render comments
  function renderComments(postId) {
    const commentsList = document.getElementById('commentsList');
    const comments = communityDataRef.current.comments.filter((c) => c.postId === parseInt(postId, 10));

    commentsList.innerHTML = '';

    comments.forEach((comment) => {
      const div = document.createElement('div');
      div.className = 'comment';
      div.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${formatDate(comment.date)}</span>
            </div>
            <p class="comment-text">${comment.text}</p>
            <div class="comment-actions">
                <button class="action-btn ${isLiked(comment.id, 'comment') ? 'liked' : ''}" 
                        onclick="toggleCommentLike(${comment.id})">
                    <i data-lucide="heart"></i>
                    <span>${comment.likes}</span>
                </button>
                <button class="action-btn" onclick="showReplyForm(${comment.id})">
                    <i data-lucide="reply"></i>
                    <span>Reply</span>
                </button>
            </div>
            <div class="reply-form" id="replyForm-${comment.id}" style="display: none;">
                <form onsubmit="handleReplySubmit(event, ${comment.id})">
                    <textarea placeholder="Write a reply..." require></textarea>
                    <button type="submit" class="btn-primary">Reply</button>
                </form>
            </div>
            ${comment.replies.length > 0 ? `
                <div class="replies">
                    ${comment.replies.map((reply) => `
                        <div class="comment">
                            <div class="comment-header">
                                <span class="comment-author">${reply.author}</span>
                                <span class="comment-date">${formatDate(reply.date)}</span>
                            </div>
                            <p class="comment-text">${reply.text}</p>
                            <div class="comment-actions">
                                <button class="action-btn ${isLiked(reply.id, 'reply') ? 'liked' : ''}" 
                                        onclick="toggleReplyLike(${reply.id})">
                                    <i data-lucide="heart"></i>
                                    <span>${reply.likes}</span>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;
      commentsList.appendChild(div);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // Set up image preview functionality
  function handleImageUrlInput() {
    const imageUrlInput = document.querySelector('#postImage');
    const imagePreview = document.querySelector('.image-preview');
    const previewImg = document.querySelector('#imagePreview');

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
  }

  // Close modals when clicking outside
  function handleWindowClick(event) {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  }

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    loadCommunityData();

    // Set up image preview functionality
    const imageUrlInput = document.querySelector('#postImage');
    if (imageUrlInput) {
      imageUrlInput.addEventListener('input', handleImageUrlInput);
    }

    // Set up event listeners
    // NOTE: the original HTML's `createPostForm` also has an inline
    // `onsubmit="handlePostSubmit(event)"` attribute (converted below to the
    // JSX `onSubmit` prop) *in addition to* this `addEventListener` call in
    // `setupEventListeners()` — a pre-existing double-binding. Both fire on
    // every submit; the second (redundant) invocation runs against an
    // already-reset form, tripping the "Title and content are required."
    // alert a second time after a successful post. Preserved as-is.
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
      createPostForm.addEventListener('submit', handlePostSubmit);
    }

    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
      commentForm.addEventListener('submit', handleCommentSubmit);
    }

    // Close modals when clicking outside
    window.onclick = handleWindowClick;

    // `renderPosts()`/`renderComments()` build cards via `innerHTML` with
    // literal `onclick="deletePost(...)"`-style attribute strings, which the
    // browser resolves against the global scope when clicked — expose these
    // on `window` the way a plain (non-module) `<script>` would. Note
    // `toggleReplyLike` is referenced the same way inside `renderComments()`
    // but was never defined anywhere in the original `community.js` either —
    // that dangling reference (it throws if a reply's like button is
    // clicked) is a pre-existing bug, preserved as-is (not defined here).
    window.deletePost = deletePost;
    window.toggleLike = toggleLike;
    window.showComments = showComments;
    window.toggleCommentLike = toggleCommentLike;
    window.showReplyForm = showReplyForm;
    window.handleReplySubmit = handleReplySubmit;

    renderPosts();

    return () => {
      if (imageUrlInput) {
        imageUrlInput.removeEventListener('input', handleImageUrlInput);
      }
      if (createPostForm) {
        createPostForm.removeEventListener('submit', handlePostSubmit);
      }
      if (commentForm) {
        commentForm.removeEventListener('submit', handleCommentSubmit);
      }
      window.onclick = null;
      delete window.deletePost;
      delete window.toggleLike;
      delete window.showComments;
      delete window.toggleCommentLike;
      delete window.showReplyForm;
      delete window.handleReplySubmit;

      const grid = document.getElementById('postsGrid');
      if (grid) grid.innerHTML = '';
    };
  }, []);

  return (
    <>
      <title>BloomHer- Community</title>
      <link rel="stylesheet" href="/stylepages/community.css" />
      <Script
        src="https://unpkg.com/lucide@latest"
        strategy="afterInteractive"
        onReady={() => {
          if (window.lucide) window.lucide.createIcons();
        }}
      />

      <div className="app-container">
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
                <a href="/mainpages/community" className="active">Community</a>
                <a href="/mainpages/blog">Blog</a>
                <button className="btn-primary">Sign In</button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="community-hero">
          <div className="container">
            <div className="hero-content">
              <h1>Share Your Story</h1>
              <p>A safe space to share experiences, ask questions, and support each other.</p>
              <br />
              <button className="btn-primary" onClick={showCreatePostModal}>
                <i data-lucide="edit-3" className="icon-small"></i>
                <span>Create Post</span>
              </button>
            </div>
          </div>
        </header>

        {/* Posts Section */}
        <section className="posts-section">
          <div className="container">
            <div className="posts-header">
              <h2>Community Posts</h2>
              <div className="posts-filter">
                <button className="filter-btn active" onClick={(e) => filterPosts('all', e.currentTarget)}>All Posts</button>
                <button className="filter-btn" onClick={(e) => filterPosts('trending', e.currentTarget)}>Trending</button>
                <button className="filter-btn" onClick={(e) => filterPosts('recent', e.currentTarget)}>Recent</button>
              </div>
            </div>
            <div className="posts-grid" id="postsGrid">
              {/* Posts will be dynamically added here */}
              {/* Example post element */}
              <div className="post" data-post-id="${post.id}">
                {'{...}'}
                <div className="post-actions">
                  <button>
                    <i data-lucide="message-square" className="icon-small"></i>
                    <span className="comment-count">{'${commentCount} Comments'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Create Post Modal */}
        <div className="modal" id="createPostModal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => closeModal('createPostModal')}>
              <i data-lucide="x"></i>
            </button>
            <h2>Create Post</h2>
            <form id="createPostForm" onSubmit={handlePostSubmit}>
              <div className="form-group">
                <label htmlFor="displayName">Display Name (Optional)</label>
                <input type="text" id="displayName" placeholder="Anonymous" />
              </div>
              <div className="form-group">
                <label htmlFor="postTitle">Title</label>
                <input type="text" id="postTitle" required placeholder="Give your post a title" />
              </div>
              <div className="form-group">
                <label htmlFor="postContent">Your Story</label>
                <textarea id="postContent" rows="6" required placeholder="Share your experience, question, or thoughts..."></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="postImage">Image URL (Optional)</label>
                <input type="url" id="postImage" placeholder="Enter image URL" />
                <p className="form-hint">Tip: You can use images from Unsplash by right-clicking an image and selecting &apos;Copy image address&apos;</p>
              </div>
              <div className="image-preview" style={{ display: 'none' }}>
                <img id="imagePreview" alt="Preview" />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" id="isAnonymous" defaultChecked />
                  Post anonymously
                </label>
              </div>
              <button type="submit" className="btn-primary">Publish Post</button>
            </form>
          </div>
        </div>

        {/* Comments Modal */}
        <div className="modal" id="commentsModal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => closeModal('commentsModal')}>
              <i data-lucide="x"></i>
            </button>
            <div className="post-details" id="modalPostDetails">
              {/* Post details will be dynamically added here */}
            </div>
            <div className="comments-section">
              <h3>Comments</h3>
              <form id="commentForm" className="comment-form">
                <textarea id="commentText" placeholder="Write a comment..." required></textarea>
                <button type="submit" className="btn-primary">
                  <i data-lucide="send" className="icon-small"></i>
                  <span>Post Comment</span>
                </button>
              </form>
              <div className="comments-list" id="commentsList">
                {/* Comments will be dynamically added here */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer>
          <div className="container">
            <div className="footer-content">
              <div className="footer-logo">
                <i data-lucide="heart" className="icon-rose"></i>
                <span className="brand">BloomHer</span>
              </div>
              <div className="footer-links">
                <a href="#">Guidelines</a>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
