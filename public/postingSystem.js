// Ambil token dari localStorage
function getToken() {
    const token = localStorage.getItem('authToken');
    console.log('Token dari localStorage:', token ? 'Ada' : 'Tidak ada');
    return token;
}

// Buka modal untuk membuat posting
function openPostModal() {
    const modal = document.getElementById('postModal');
    modal.classList.add('active');
}

// Tutup modal
function closePostModal() {
    const modal = document.getElementById('postModal');
    modal.classList.remove('active');
    document.getElementById('postContent').value = '';
}

// Buat postingan
async function createPost() {
    const content = document.getElementById('postContent').value;
    const token = getToken();

    if (!content.trim()) {
        alert('Konten postingan tidak boleh kosong');
        return;
    }

    if (!token) {
        alert('Silakan login terlebih dahulu. Token tidak ditemukan.');
        console.error('Token missing:', {
            authToken: localStorage.getItem('authToken'),
            allKeys: Object.keys(localStorage)
        });
        return;
    }

    try {
        const response = await fetch('/api/post/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('postContent').value = '';
            closePostModal();
            // Refresh posts
            loadPosts();
            alert('Postingan berhasil dibuat');
        } else {
            alert('Error: ' + data.message);
            console.error('Create post failed:', data);
        }
    } catch (error) {
        console.error('Buat postingan error:', error);
        alert('Terjadi kesalahan saat membuat postingan');
    }
}

// Muat semua postingan
async function loadPosts() {
    try {
        const response = await fetch('/api/post/all');
        const data = await response.json();

        if (data.success) {
            displayPosts(data.posts);
        } else {
            console.error('Error loading posts:', data.message);
        }
    } catch (error) {
        console.error('Load posts error:', error);
    }
}

// Tampilkan postingan
function displayPosts(posts) {
    const container = document.getElementById('postsContainer');
    const token = getToken();
    
    // Hapus contoh postingan jika ada
    const existingPosts = container.querySelectorAll('.post-card');
    existingPosts.forEach(post => post.remove());

    if (posts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Tidak ada postingan</p>';
        return;
    }

    posts.forEach(post => {
        const postCard = createPostCard(post, token);
        container.appendChild(postCard);
    });
}

// Buat elemen post card
function createPostCard(post, token) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.id = 'post-' + post._id;

    const hasLiked = token && post.likes.some(like => like._id === getUserIdFromToken(token));
    const hasDisliked = token && post.dislikes.some(dislike => dislike._id === getUserIdFromToken(token));

    const timeAgo = getTimeAgo(post.createdAt);

    card.innerHTML = `
        <div class="post-header">
            <div class="post-author-info">
                <div class="post-author-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="post-author-details">
                    <h3>${post.authorUsername}</h3>
                    <div class="post-author-meta">${timeAgo}</div>
                </div>
            </div>
            <button class="post-menu-btn" onclick="openPostMenu('${post._id}')">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        </div>
        <div class="post-content">
            <p>${escapeHtml(post.content)}</p>
        </div>
        <div class="post-stats" style="display: flex; justify-content: space-between; padding: 10px 20px; font-size: 13px; color: #666; border-top: 1px solid #e0e0e0;">
            <span>${post.likes.length} Suka</span>
            <span>${post.dislikes.length} Tidak Suka</span>
            <span>${post.comments.length} Komentar</span>
        </div>
        <div class="post-actions-bar">
            <button class="post-action ${hasLiked ? 'liked' : ''}" onclick="likePost('${post._id}')">
                <i class="fas fa-thumbs-up"></i>
                <span>Suka</span>
            </button>
            <button class="post-action ${hasDisliked ? 'disliked' : ''}" onclick="dislikePost('${post._id}')">
                <i class="fas fa-thumbs-down"></i>
                <span>Tidak Suka</span>
            </button>
            <button class="post-action" onclick="toggleCommentSection('${post._id}')">
                <i class="fas fa-comment"></i>
                <span>Komentar</span>
            </button>
        </div>
        <div class="post-comments-section" id="comments-${post._id}" style="display: none; padding: 15px 20px; background: #f9f9f9; border-top: 1px solid #e0e0e0;">
            <div id="comments-list-${post._id}" class="comments-list"></div>
            ${token ? `
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <input type="text" class="comment-input" id="comment-input-${post._id}" placeholder="Tulis komentar..." style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;">
                    <button onclick="addComment('${post._id}')" style="background: #2777b9; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 13px;">Posting</button>
                </div>
            ` : `
                <p style="color: #999; font-size: 13px;">Silakan <a href="/login" style="color: #2777b9;">login</a> untuk berkomentar</p>
            `}
        </div>
    `;

    // Tambah komentar yang sudah ada
    setTimeout(() => {
        const commentsList = card.querySelector(`#comments-list-${post._id}`);
        if (post.comments.length > 0) {
            post.comments.forEach(comment => {
                const commentEl = document.createElement('div');
                commentEl.className = 'comment-item';
                commentEl.style.cssText = 'margin-bottom: 10px; padding: 8px; background: white; border-radius: 4px;';
                commentEl.innerHTML = `
                    <div style="display: flex; justify-content: space-between;">
                        <strong style="font-size: 12px;">${comment.authorUsername}</strong>
                        ${token && comment.author._id === getUserIdFromToken(token) ? `
                            <button onclick="deleteComment('${post._id}', '${comment._id}')" style="background: none; border: none; color: #999; cursor: pointer; font-size: 12px;">×</button>
                        ` : ''}
                    </div>
                    <p style="font-size: 13px; margin: 3px 0; color: #333;">${escapeHtml(comment.content)}</p>
                    <small style="color: #999; font-size: 11px;">${getTimeAgo(comment.createdAt)}</small>
                `;
                commentsList.appendChild(commentEl);
            });
        } else {
            commentsList.innerHTML = '<p style="color: #999; font-size: 13px;">Belum ada komentar</p>';
        }
    }, 0);

    return card;
}

// Like postingan
async function likePost(postId) {
    const token = getToken();

    if (!token) {
        alert('Silakan login terlebih dahulu');
        console.error('Token not found for like operation');
        return;
    }

    try {
        const response = await fetch(`/api/post/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            loadPosts();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Like error:', error);
        alert('Terjadi kesalahan');
    }
}

// Dislike postingan
async function dislikePost(postId) {
    const token = getToken();

    if (!token) {
        alert('Silakan login terlebih dahulu');
        console.error('Token not found for dislike operation');
        return;
    }

    try {
        const response = await fetch(`/api/post/${postId}/dislike`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            loadPosts();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Dislike error:', error);
        alert('Terjadi kesalahan');
    }
}

// Toggle comment section
function toggleCommentSection(postId) {
    const section = document.getElementById(`comments-${postId}`);
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// Tambah komentar
async function addComment(postId) {
    const content = document.getElementById(`comment-input-${postId}`).value;
    const token = getToken();

    if (!content.trim()) {
        alert('Komentar tidak boleh kosong');
        return;
    }

    if (!token) {
        alert('Silakan login terlebih dahulu');
        console.error('Token not found for comment operation');
        return;
    }

    try {
        const response = await fetch(`/api/post/${postId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById(`comment-input-${postId}`).value = '';
            loadPosts();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Add comment error:', error);
        alert('Terjadi kesalahan');
    }
}

// Hapus komentar
async function deleteComment(postId, commentId) {
    if (!confirm('Hapus komentar ini?')) return;

    const token = getToken();

    if (!token) {
        alert('Silakan login terlebih dahulu');
        console.error('Token not found for delete comment operation');
        return;
    }

    try {
        const response = await fetch(`/api/post/${postId}/comment/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            loadPosts();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Delete comment error:', error);
        alert('Terjadi kesalahan');
    }
}

// Helper function: Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Helper function: Get time ago
function getTimeAgo(createdAt) {
    const now = new Date();
    const postDate = new Date(createdAt);
    const seconds = Math.floor((now - postDate) / 1000);

    if (seconds < 60) return 'baru saja';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' menit lalu';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' jam lalu';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' hari lalu';
    return postDate.toLocaleDateString('id-ID');
}

// Helper function: Get user ID dari token
function getUserIdFromToken(token) {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.userId;
    } catch (error) {
        return null;
    }
}

// Open post menu
function openPostMenu(postId) {
    const token = getToken();
    if (!token) return;

    // Di sini Anda bisa menambahkan menu untuk edit/delete postingan
    console.log('Menu untuk postingan:', postId);
}

// Load posts ketika halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();

    // Trigger modal ketika post input diklik
    const postInputTrigger = document.getElementById('postInputTrigger');
    if (postInputTrigger) {
        postInputTrigger.addEventListener('click', openPostModal);
    }
});

// Add style untuk liked/disliked button
const style = document.createElement('style');
style.textContent = `
    .post-action.liked {
        color: #2777b9;
    }
    
    .post-action.disliked {
        color: #e74c3c;
    }
`;
document.head.appendChild(style);
