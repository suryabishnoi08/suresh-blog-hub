/* * 🚀 SURESH BRAND SMART JS (PART 5/6)
 * Includes: Dark Mode, Progress Bar, Sticky Header, Drawer Toggle
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. --- DARK MODE LOGIC (Local Storage based) ---
    const darkModeBtn = document.getElementById(
        'suresh-dark-mode-toggle');
    const body = document.body;
    
    // Check if user previously set dark mode
    if (localStorage.getItem('suresh-theme') === 'dark-mode') {
        body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('suresh-theme', 'dark-mode');
            darkModeBtn.innerHTML =
            '<i class="fas fa-sun"></i>';
            showToast('suresh-copy-toast',
                '🌙 Dark Mode Activated!');
        } else {
            localStorage.setItem('suresh-theme', 'light-mode');
            darkModeBtn.innerHTML =
                '<i class="fas fa-moon"></i>';
            showToast('suresh-copy-toast',
                '☀️ Light Mode Activated!');
        }
    });
    
    // 2. --- READING PROGRESS BAR & STICKY HEADER ---
    const progressBar = document.getElementById('suresh-progress-bar');
    const header = document.querySelector('.suresh-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        // Progress Bar Calculation
        const winScroll = document.body.scrollTop || document
            .documentElement.scrollTop;
        const height = document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
        
        // Sticky Header Hide/Show on Scroll
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList
            .contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header
            .classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
        
        // Back to Top Button Visibility
        const bttBtn = document.getElementById('suresh-btt');
        if (winScroll > 500) {
            bttBtn.classList.add('show');
        } else {
            bttBtn.classList.remove('show');
        }
    });
    
    // 3. --- BACK TO TOP CLICK ---
    document.getElementById('suresh-btt').addEventListener('click',
    () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    
    // 4. --- DRAWER MENU TOGGLE (Mobile & Desktop Sidebar) ---
    const menuOpen = document.getElementById('suresh-menu-open');
    const menuClose = document.getElementById('suresh-menu-close');
    const drawer = document.getElementById('suresh-drawer');
    const overlay = document.getElementById('suresh-overlay');
    
    const toggleDrawer = (action) => {
        if (action === 'open') {
            drawer.classList.add('active');
            overlay.classList.add('active');
            body.style.overflow =
            'hidden'; // Stop background scroll
        } else {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = 'auto';
        }
    };
    
    menuOpen.addEventListener('click', () => toggleDrawer('open'));
    menuClose.addEventListener('click', () => toggleDrawer('close'));
    overlay.addEventListener('click', () => toggleDrawer('close'));
    
    // 5. --- GLOBAL TOAST FUNCTION ---
    function showToast(id, message) {
        const toast = document.createElement('div');
        toast.id = id;
        toast.className = 'show';
        toast.innerHTML = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
});
/* * 🚀 SURESH BISHNOI MASTER ENGINE (PART 6/6)
 * Includes: Live Search, Auto-TOC, Copy Warning, Visitor Counter
 */

// 6. --- SURESH LIVE SEARCH ENGINE ---
const sureshSearchInput = document.getElementById('suresh-live-search');
const sureshResultsBox = document.getElementById('suresh-search-results');

if (sureshSearchInput) {
    let debounceTimer;
    sureshSearchInput.addEventListener('keyup', function() {
        clearTimeout(debounceTimer);
        const query = this.value.trim();
        
        if (query.length < 3) {
            sureshResultsBox.style.display = 'none';
            return;
        }
        
        sureshResultsBox.style.display = 'block';
        sureshResultsBox.innerHTML =
            '<div class="suresh-loading-search"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
        
        debounceTimer = setTimeout(() => {
            fetch(
                    `/feeds/posts/summary?alt=json&q=${encodeURIComponent(query)}&max-results=5`)
                .then(response => response.json())
                .then(data => {
                    let html = '';
                    if (data.feed.entry) {
                        data.feed.entry.forEach(entry => {
                            const title = entry
                                .title.$t;
                            const link = entry.link
                                .find(l => l.rel ===
                                    'alternate')
                                .href;
                            html +=
                                `<a href="${link}" class="suresh-search-item">${title}</a>`;
                        });
                    } else {
                        html =
                            '<div class="suresh-no-result">No updates found.</div>';
                    }
                    sureshResultsBox.innerHTML = html;
                });
        }, 500);
    });
}

// 7. --- SURESH AUTO TABLE OF CONTENTS (TOC) ---
const sureshPostBody = document.querySelector('.suresh-post-body');
const sureshTocContainer = document.getElementById('suresh-auto-toc');

if (sureshPostBody && sureshTocContainer) {
    const headings = sureshPostBody.querySelectorAll('h2, h3');
    if (headings.length > 1) {
        let tocHtml =
            '<div class="suresh-toc-title">📜 Table of Contents <button id="suresh-toc-toggle">Hide</button></div><ul class="suresh-toc-list" id="suresh-toc-list">';
        
        headings.forEach((heading, index) => {
            const id = `suresh-heading-${index}`;
            heading.setAttribute('id', id);
            tocHtml +=
                `<li><a href="#${id}">${heading.innerText}</a></li>`;
        });
        
        tocHtml += '</ul>';
        sureshTocContainer.innerHTML = tocHtml;
        
        document.getElementById('suresh-toc-toggle').addEventListener('click',
            function() {
                const list = document.getElementById('suresh-toc-list');
                if (list.style.display === 'none') {
                    list.style.display = 'block';
                    this.innerText = 'Hide';
                } else {
                    list.style.display = 'none';
                    this.innerText = 'Show';
                }
            });
    }
}

// 8. --- CONTENT PROTECTION (COPY WARNING) ---
let sureshCopyAlerted = false;
document.addEventListener('copy', (e) => {
    if (!sureshCopyAlerted) {
        // First time warning
        const toast = document.getElementById('suresh-copy-toast');
        toast.innerText = "⚠️ चेतावनी: सामग्री कॉपी करना मना है!";
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
        sureshCopyAlerted = true;
        // Don't prevent default on first try if you want to allow it once, 
        // OR e.preventDefault() to block completely.
    }
});

// 9. --- VISITOR COUNTER & UPDATE TIME ---
const sureshUpdateTag = document.getElementById('suresh-update-time');
if (sureshUpdateTag) {
    const now = new Date();
    sureshUpdateTag.innerText = now.toLocaleDateString(
        'en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " +
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const sureshCounterTag = document.getElementById('suresh-visitor-count');
if (sureshCounterTag) {
    fetch("https://api.counterapi.dev/v1/suresh-jani-bishnoi/main-site/up")
        .then(res => res.json())
        .then(data => { sureshCounterTag.innerText = data.count; })
        .catch(() => { sureshCounterTag.innerText = "1000+"; });
}

console.log("🔥 Suresh Bishnoi Master Engine 7.0 Loaded Successfully!");
// 10. --- SURESH ANTI-THEFT & PRINT LOGIC ---
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    alert("⚠️ Right Click is Disabled on Suresh Bishnoi Hub!");
});

document.onkeydown = (e) => {
    if (e.keyCode == 123 || (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'
            .charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0))) || (e
            .ctrlKey && e.keyCode == 'U'.charCodeAt(0))) {
        alert("🚀 Security Alert: Developer Tools are restricted!");
        return false;
    }
};

const printPost = () => {
    window.print();
};
// 11. --- SURESH PRELOADER & HOME FEED ---
window.addEventListener('load', () => {
    const preloader = document.getElementById('suresh-preloader');
    if(preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 500);
    }

    // Home Feed Dashboard Fetch
    const feedContainer = document.getElementById('suresh-feed-posts');
    if(feedContainer) {
        fetch('/feeds/posts/summary?alt=json&max-results=5')
            .then(res => res.json())
            .then(data => {
                let html = '';
                data.feed.entry.forEach(entry => {
                    const title = entry.title.$t;
                    const link = entry.link.find(l => l.rel === 'alternate').href;
                    html += `<div class="suresh-dash-item"><a href="${link}">${title}</a></div>`;
                });
                feedContainer.innerHTML = html;
            });
    }
});

// 12. --- TRANSLATION SWITCH LOGIC ---
const translate = (lang) => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
    }
};
document.getElementById('suresh-lang-hi')?.addEventListener('click', () => translate('hi'));
document.getElementById('suresh-lang-en')?.addEventListener('click', () => translate('en'));
// 13. --- SURESH MOBILE DRAWER LOGIC ---
const sureshMenuBtn = document.querySelector('.suresh-menu-trigger');
const sureshDrawer = document.querySelector('.suresh-mobile-menu');
const sureshOverlay = document.querySelector('.suresh-overlay');

if(sureshMenuBtn) {
    sureshMenuBtn.addEventListener('click', () => {
        sureshDrawer.classList.add('active');
        sureshOverlay.classList.add('active');
    });
}

if(sureshOverlay) {
    sureshOverlay.addEventListener('click', () => {
        sureshDrawer.classList.remove('active');
        sureshOverlay.classList.remove('active');
    });
}

// 14. --- LAZY LOADING IMAGES (Speed Scan Fix) ---
document.querySelectorAll('img').forEach(img => {
    img.setAttribute('loading', 'lazy');
});
