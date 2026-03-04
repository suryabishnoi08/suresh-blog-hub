/* --- SURESH BISHNOI DIGITAL HUB - DYNAMIC ENGINE v6.0 --- */

const SureshComments = {
    init: function() {
        // Check karna ki hum post page par hain ya nahi
        const commentRoot = document.getElementById('s-comments-root');
        if(!commentRoot) return; 

        // Article ID se Post ID nikalna
        const article = document.querySelector('article.s-post-card');
        if(!article) return;
        
        const postId = article.id.split('-')[1];
        
        // Comments fetch karna shuru karein
        this.fetchComments(postId, commentRoot);
    },

    fetchComments: function(postId, root) {
        root.innerHTML = '<div class="s-no-comments">⏳ Premium Comments Load ho rahe hain...</div>';
        
        // Blogger JSON API Call (Without slowing down PageSpeed)
        const script = document.createElement('script');
        script.src = `/feeds/${postId}/comments/default?alt=json-in-script&callback=SureshComments.render`;
        document.body.appendChild(script);
    },

    render: function(data) {
        const root = document.getElementById('s-comments-root');
        
        // Agar koi comment nahi hai
        if(!data.feed || !data.feed.entry) {
            root.innerHTML = `
                <h3 class="s-cmt-heading">Discussion (0)</h3>
                <div class="s-no-comments">✨ अभी तक कोई कमेंट नहीं है। आप शुरुआत करें!</div>
            `;
            return;
        }

        const entries = data.feed.entry;
        let html = `<h3 class="s-cmt-heading">Discussion (${entries.length})</h3><div class="s-cmt-list">`;

        // Har comment ke liye loop chalana
        entries.forEach(entry => {
            const author = entry.author[0].name.$t;
            // High-resolution avatar set karna
            const avatar = entry.author[0].gd$image.src.replace('/s16-c/', '/s50-c/'); 
            const content = entry.content.$t;
            // Date ko Indian format mein dikhana
            const date = new Date(entry.published.$t).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' });

            html += `
                <div class="s-cmt-item">
                    <img src="${avatar}" alt="${author}" class="s-cmt-avatar"/>
                    <div class="s-cmt-content">
                        <div class="s-cmt-header">
                            <span class="s-cmt-author">${author}</span>
                            <span class="s-cmt-date">${date}</span>
                        </div>
                        <div class="s-cmt-text">${content}</div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        root.innerHTML = html;
    }
};

// Jaise hi page load ho, Engine start kar do
document.addEventListener("DOMContentLoaded", () => SureshComments.init());
