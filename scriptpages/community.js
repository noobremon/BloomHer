function addPost() {
    let username = document.getElementById('username').value;
    let content = document.getElementById('postContent').value;
    let imageFile = document.getElementById('postImage').files[0];
    if (!username || (!content && !imageFile)) {
        alert('Please enter your name and either post content or an image.');
        return;
    }
    
    let postDiv = document.createElement('div');
    postDiv.classList.add('post');
    let postContent = `<strong>${username}:</strong> ${content} <br>`;
    if (imageFile) {
        let imageUrl = URL.createObjectURL(imageFile);
        postContent += `<img src="${imageUrl}" alt="Post Image">`;
    }
    postContent += `
        <div class="reaction-buttons">
            <button onclick="react(this, 'like')">👍 Like</button>
            <button onclick="react(this, 'love')">❤️ Love</button>
        </div>
        <button onclick="showCommentBox(this)">Comment</button>
        <div class="comments"></div>`;
    postDiv.innerHTML = postContent;
    
    document.getElementById('posts').prepend(postDiv);
    document.getElementById('postContent').value = '';
    document.getElementById('postImage').value = '';
}

function react(button, type) {
    let countSpan = button.querySelector('span');
    if (!countSpan) {
        countSpan = document.createElement('span');
        countSpan.textContent = ' 1';
        button.appendChild(countSpan);
    } else {
        countSpan.textContent = ` ${parseInt(countSpan.textContent) + 1}`;
    }
}

function showCommentBox(button) {
    let commentBox = document.createElement('div');
    commentBox.innerHTML = `<input type='text' placeholder='Write a comment...' class='commentInput'>
        <button onclick='addComment(this)'>Post Comment</button>`;
    button.nextElementSibling.appendChild(commentBox);
}

function addComment(button) {
    let input = button.previousElementSibling;
    let commentText = input.value.trim();
    if (commentText) {
        let commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        // Placeholder image for user profile photo
        commentDiv.innerHTML = `<img src='https://via.placeholder.com/35' alt='user'> <span>${commentText}</span>
        <button onclick='showReplyBox(this)'>Reply</button>
        <div class='reply-box'></div>`;
        button.parentElement.parentElement.appendChild(commentDiv);
        input.value = '';
    } else {
        alert('Comment cannot be empty!');
    }
}

function showReplyBox(button) {
    let replyBox = document.createElement('div');
    replyBox.innerHTML = `<input type='text' placeholder='Write a reply...' class='commentInput'>
        <button onclick='addReply(this)'>Post Reply</button>`;
    button.nextElementSibling.appendChild(replyBox);
}

function addReply(button) {
    let input = button.previousElementSibling;
    let replyText = input.value.trim();
    if (replyText) {
        let replyDiv = document.createElement('div');
        replyDiv.classList.add('reply');
        // Placeholder image for user profile photo
        replyDiv.innerHTML = `<img src='https://via.placeholder.com/35' alt='user'> <span>${replyText}</span>`;
        button.parentElement.parentElement.appendChild(replyDiv);
        input.value = '';
    } else {
        alert('Reply cannot be empty!');
    }
}