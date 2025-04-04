// Initialize Lucide icons
lucide.createIcons();

// Community data structure
let communityData = {
    posts: [],
    comments: [],
    reactions: []
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCommunityData();
    setupImagePreview();
    setupEventListeners();
    renderPosts();
});

// Set up image preview functionality
function setupImagePreview() {
    const imageUrlInput = document.querySelector('#postImage');
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
}

// Set up event listeners
function setupEventListeners() {
    const createPostForm = document.getElementById('createPostForm');

    // Remove existing event listener (if any)
    createPostForm.removeEventListener('submit', handlePostSubmit);

    // Add the event listener
    createPostForm.addEventListener('submit', handlePostSubmit);

    // Comment form
    document.getElementById('commentForm').addEventListener('submit', handleCommentSubmit);

    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
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
        communityData.posts = communityData.posts.filter(post => post.id !== postId);
        
        // Remove associated comments
        communityData.comments = communityData.comments.filter(comment => comment.postId !== postId);
        
        // Remove associated reactions
        communityData.reactions = communityData.reactions.filter(reaction => 
            !(reaction.targetId === postId && reaction.targetType === 'post')
        );

        saveCommunityData();
        renderPosts();
    }
}

// Handle post submission
function handlePostSubmit(event) {
    event.preventDefault();

    const displayName = document.getElementById('displayName').value || 'Anonymous';
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const imageUrl = document.getElementById('postImage').value;
    const isAnonymous = document.getElementById('isAnonymous').checked;

    const post = {
        id: Date.now(),
        author: isAnonymous ? 'Anonymous' : displayName,
        title,
        content,
        imageUrl,
        date: new Date().toISOString(),
        likes: 0,
        comments: 0
    };

    communityData.posts.unshift(post);
    saveCommunityData();
    renderPosts();
    closeModal('createPostModal');
    event.target.reset();
    document.querySelector('.image-preview').style.display = 'none';
}

// Handle comment submission
function handleCommentSubmit(event) {
    event.preventDefault();
    
    const postId = event.target.dataset.postId;
    const commentText = document.getElementById('commentText').value;
    
    if (!commentText.trim()) return;

    const comment = {
        id: Date.now(),
        postId: parseInt(postId),
        author: 'Anonymous',
        text: commentText,
        date: new Date().toISOString(),
        likes: 0,
        replies: []
    };

    communityData.comments.push(comment);
    
    // Update post's comment count
    const post = communityData.posts.find(p => p.id === parseInt(postId));
    if (post) {
        post.comments++;
    }

    saveCommunityData();
    renderComments(postId);
    event.target.reset();
}

// Handle reply submission
function handleReplySubmit(event, commentId) {
    event.preventDefault();
    
    const replyText = event.target.querySelector('textarea').value;
    if (!replyText.trim()) return;

    const comment = communityData.comments.find(c => c.id === commentId);
    if (!comment) return;

    const reply = {
        id: Date.now(),
        author: 'Anonymous',
        text: replyText,
        date: new Date().toISOString(),
        likes: 0
    };

    comment.replies.push(reply);
    saveCommunityData();
    renderComments(comment.postId);
}

// Toggle like on post
function toggleLike(postId) {
    const post = communityData.posts.find(p => p.id === postId);
    if (!post) return;

    const reaction = communityData.reactions.find(r => 
        r.targetId === postId && r.targetType === 'post'
    );

    if (reaction) {
        post.likes--;
        communityData.reactions = communityData.reactions.filter(r => 
            r.targetId !== postId || r.targetType !== 'post'
        );
    } else {
        post.likes++;
        communityData.reactions.push({
            targetId: postId,
            targetType: 'post',
            type: 'like'
        });
    }

    saveCommunityData();
    renderPosts();
}

// Toggle like on comment
function toggleCommentLike(commentId) {
    const comment = communityData.comments.find(c => c.id === commentId);
    if (!comment) return;

    const reaction = communityData.reactions.find(r => 
        r.targetId === commentId && r.targetType === 'comment'
    );

    if (reaction) {
        comment.likes--;
        communityData.reactions = communityData.reactions.filter(r => 
            r.targetId !== commentId || r.targetType !== 'comment'
        );
    } else {
        comment.likes++;
        communityData.reactions.push({
            targetId: commentId,
            targetType: 'comment',
            type: 'like'
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
function filterPosts(filter) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="filterPosts('${filter}')"]`).classList.add('active');

    let filteredPosts = [...communityData.posts];

    switch (filter) {
        case 'trending':
            filteredPosts.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
            break;
        case 'recent':
            filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
    }

    renderPosts(filteredPosts);
}

// Show comments modal
function showComments(postId) {
    const post = communityData.posts.find(p => p.id === postId);
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
    lucide.createIcons();
}

// Render posts
function renderPosts(posts = communityData.posts) {
    const grid = document.getElementById('postsGrid');
    grid.innerHTML = '';

    posts.forEach(post => {
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

    lucide.createIcons();
}

// Render comments
function renderComments(postId) {
    const commentsList = document.getElementById('commentsList');
    const comments = communityData.comments.filter(c => c.postId === parseInt(postId));

    commentsList.innerHTML = '';

    comments.forEach(comment => {
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
                    ${comment.replies.map(reply => `
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

    lucide.createIcons();
}

// Check if item is liked
function isLiked(targetId, targetType) {
    return communityData.reactions.some(r => 
        r.targetId === targetId && r.targetType === targetType
    );
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Truncate text
function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

// Save and load community data
function saveCommunityData() {
    localStorage.setItem('cyclecare_community_data', JSON.stringify(communityData));
}

function loadCommunityData() {
    const savedData = localStorage.getItem('cyclecare_community_data');
    if (savedData) {
        communityData = JSON.parse(savedData);
    }
    function deletePost(postId) {
        const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);
        if (postElement) {
            postElement.remove();
        }
    }
    
    function handlePostSubmit(event) {
        event.preventDefault(); // Prevent the default form submission
    
        // Get form values
        const displayName = document.getElementById('displayName').value;
        const postTitle = document.getElementById('postTitle').value;
        const postContent = document.getElementById('postContent').value;
        const postImage = document.getElementById('postImage').value;
        const isAnonymous = document.getElementById('isAnonymous').checked;
    
        // Basic validation
        if (!postTitle || !postContent) {
            alert('Please enter both title and content.');
            return;
        }
    
        // Create post object
        const post = {
            displayName: isAnonymous ? 'Anonymous' : displayName || 'Anonymous',
            title: postTitle,
            content: postContent,
            image: postImage
        };
    
        // Add the post to the grid
        addPostToGrid(post);
    
        // Close the modal
        closeModal('createPostModal');
    
        // Reset the form
        document.getElementById('createPostForm').reset();
    }
    
    function addPostToGrid(post) {
        const postsGrid = document.getElementById('postsGrid');
    
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
    
        let postContentHTML = `
            <h3>${post.title}</h3>
            <p class="post-meta">By ${post.displayName}</p>
            <p>${post.content}</p>
        `;
    
        if (post.image) {
            postContentHTML += `<img src="${post.image}" alt="Post Image">`;
        }
    
        postDiv.innerHTML = postContentHTML;
        postsGrid.appendChild(postDiv);
    }
}