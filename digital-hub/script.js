/* Suresh Bishnoi Digital Hub - Premium JS Engine v2.0
   Features: Dynamic Comments Fetcher | Smooth Scroll | Performance Boost
*/

const SureshBlog = {
    settings: {
        blogUrl: window.location.origin,
        postID: document.body.dataset.postId || ""
    },

    init: function() {
        console.log("💎 Suresh Premium Engine: Phase 4 Active");
        this.setupComments();
        this.cleanBloggerGarbage();
    },

    // 1. Dynamic Comment Link Handler
    setupComments: function() {
        const cmtBtns = document.querySelectorAll('.read-more-btn');
        cmtBtns.forEach(btn => {
            btn.addEventListener('mouseover', () => {
                btn.style.boxShadow = "0 5px 15px rgba(0, 102, 255, 0.3)";
            });
            btn.addEventListener('mouseout', () => {
                btn.style.boxShadow = "none";
            });
        });
    },

    // 2. Blogger ka kachra saaf karne ka logic (Frontend side)
    cleanBloggerGarbage: function() {
        // Unnecessary elements ko hide karna jo Blogger force karta hai
        const quickedit = document.querySelectorAll('.quickedit, .widget-item-control');
        quickedit.forEach(el => el.style.display = 'none');
    }
};

// Global Initialization
document.addEventListener("DOMContentLoaded", () => SureshBlog.init());
