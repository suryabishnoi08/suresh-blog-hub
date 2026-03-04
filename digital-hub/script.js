  <script type='text/javascript'>
    //<![CDATA[
    document.addEventListener('DOMContentLoaded', () => {

      /* --- 1. REAL TIME SERVER COUNTER & TIME --- */
      const updateTime = () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); 
        const updateTag = document.getElementById('update-time');
        if (updateTag) updateTag.innerHTML = `${dateStr}, ${timeStr}`;
      };
      updateTime();

      const counterTag = document.getElementById("live-visitor-count");
      if (counterTag) {
        fetch("https://api.counterapi.dev/v1/suresh-jani-bishnoi/main-site/up")
          .then(res => res.json())
          .then(data => counterTag.innerText = data.count)
          .catch(err => {
            console.error("Counter Error:", err);
            counterTag.innerText = "1000+";
          });
      }

      /* --- 2. ANTI-COPY PROTECTION --- */
      let copyCount = 0; 
      document.addEventListener('copy', (e) => {
        copyCount++;
        if (copyCount === 1) {
          e.preventDefault();
          showCopyWarning();
        } else {
          copyCount = 0;
        }
      });

      const showCopyWarning = () => {
        let existing = document.getElementById('copy-warning-toast');
        if (existing) existing.remove(); 
        const msg = document.createElement('div');
        msg.id = 'copy-warning-toast';
        msg.innerHTML = '⚠️ चेतावनी: सामग्री कॉपी करना मना है! (अगली बार कॉपी हो जाएगा)'; 
        document.body.appendChild(msg);
        requestAnimationFrame(() => msg.classList.add('show-toast')); 
        setTimeout(() => {
          msg.classList.remove('show-toast');  
          setTimeout(() => msg.remove(), 400);
        }, 3000);
      };

      /* --- 3. GOOGLE TRANSLATE & TEXT RESIZE --- */
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const lang = e.target.getAttribute('data-lang');
          const select = document.querySelector('.goog-te-combo') || document.querySelector('#google_translate_element select');
          if (select) {
            select.value = lang;
            select.dispatchEvent(new Event('change'));
          }
        });
      });

      document.querySelectorAll('.resize-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const multiplier = parseInt(e.target.getAttribute('data-resize'));
          let content = document.querySelector('.post-body') || document.body;
          let currentSizeNum = parseFloat(window.getComputedStyle(content, null).getPropertyValue('font-size'));
          if (!content.dataset.baseSize) content.dataset.baseSize = currentSizeNum;
          let baseSize = parseFloat(content.dataset.baseSize);
          
          if (multiplier === 0) content.style.fontSize = `${baseSize}px`;
          else if (multiplier === 1) content.style.fontSize = `${baseSize * 1.2}px`;
          else if (multiplier === -1) content.style.fontSize = `${baseSize * 0.85}px`;
        });
      });

      /* --- 4. DARK MODE TOGGLE --- */
      const darkModeBtn = document.getElementById('darkModeToggle');
      const themeText = document.getElementById('themeText');
      const icon = document.querySelector('#darkModeToggle i');
      
      const applyDarkMode = (isDark) => {
        if (isDark) {
          document.body.classList.add("dark-mode");
          if (themeText) themeText.innerText = "Light";
          if (icon) icon.className = "fas fa-sun";
        } else {
          document.body.classList.remove("dark-mode");
          if (themeText) themeText.innerText = "Dark";
          if (icon) icon.className = "fas fa-moon";
        }
      };

      if (localStorage.getItem("suresh_theme") === "dark") applyDarkMode(true);

      if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
          const isDark = document.body.classList.toggle("dark-mode");
          localStorage.setItem("suresh_theme", isDark ? "dark" : "light");
          applyDarkMode(isDark);
        });
      }

      /* --- 5. MAGIC BADGE CONVERTER --- */
      document.querySelectorAll('.dash-item-title, .main-post-title, .post-title, h3.post-title a, .gov-list-table td b, .post-body b').forEach(el => {
        const text = el.innerHTML;
        const match = text.match(/\[New(?:\|(\d{2}-\d{2}-\d{4}))?\]/i); 
        if (match) {
          const [fullMatch, dateStr] = match;
          let showBadge = true;  
          if (dateStr) {
            const [day, month, year] = dateStr.split("-");
            const expireDate = new Date(year, month - 1, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);  
            if (today > expireDate) showBadge = false;
          }
          el.innerHTML = showBadge 
            ? text.replace(fullMatch, '<span class="magic-new-badge">NEW</span>') 
            : text.replace(fullMatch, "").trim();
        }
      });

      /* --- 6. 3D SIDEBAR LOGIC --- */
      const sb = document.getElementById("appSidebar");
      const ov = document.getElementById("sidebarBackdrop");
      const bd = document.body;

      document.getElementById('menuToggleBtn')?.addEventListener('click', () => {
        if (sb.classList.contains("mini")) sb.classList.remove("mini");
        sb.classList.toggle("active");
        ov.classList.toggle("active");
        bd.classList.toggle("sidebar-open", sb.classList.contains("active"));
      });

      const closeSidebar = () => {
        sb.classList.remove("active");
        ov.classList.remove("active");
        bd.classList.remove("sidebar-open");
      };
      document.getElementById('closeSidebarBtn')?.addEventListener('click', closeSidebar);
      ov?.addEventListener('click', closeSidebar);

      document.getElementById('toggleMiniBtn')?.addEventListener('click', () => {
        sb.classList.toggle("mini");  
        const isMini = sb.classList.contains("mini");
        bd.classList.toggle("sidebar-open", !isMini);
        ov.classList.toggle("active", !isMini);
      });

      document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
        trigger.addEventListener('click', function() {
          if (sb.classList.contains("mini")) {
            document.getElementById('toggleMiniBtn').click();
            return; 
          }
          this.classList.toggle("open");
          const submenu = this.nextElementSibling;
          if (submenu && submenu.style.maxHeight) {
            submenu.style.maxHeight = null;
          } else if (submenu) {
            submenu.style.maxHeight = `${submenu.scrollHeight}px`;
            let parent = this.parentElement.closest(".submenu-box");
            while (parent) {
              parent.style.maxHeight = `${parseInt(parent.style.maxHeight) + submenu.scrollHeight}px`;
              parent = parent.parentElement.closest(".submenu-box");
            }
          }
        });
      });

      /* --- 7. PRINT BUTTON --- */
      document.getElementById('printPostBtn')?.addEventListener('click', () => window.print());

      /* --- 8. SMART VERIFIED ADMIN BADGE --- */
      document.querySelectorAll('cite.user, .comment-author').forEach(el => {
        if (el.innerText.trim() === "Suresh Bishnoi") {
          const innerLink = el.querySelector('a');
          if (innerLink) innerLink.classList.add('is-admin-name');
          else el.classList.add('is-admin-name');
          const dateEl = el.parentNode.querySelector('.comment-timestamp');
          if (dateEl) dateEl.style.color = "#999";
        }
      });

      /* --- 9. DOUBLE BACK PRESS TO EXIT --- */
      let backPressedCount = 0;
      let initialHash = window.location.hash;
      history.pushState(null, null, location.href);
      
      window.addEventListener('popstate', () => {
        if (window.location.hash !== initialHash) {
          initialHash = window.location.hash;
          return;
        }
        if (backPressedCount === 0) {
          history.pushState(null, null, location.href);
          const toast = document.createElement('div');
          toast.id = 'pro-exit-toast';
          toast.innerText = "Press back again to exit";
          document.body.appendChild(toast);
          requestAnimationFrame(() => toast.style.opacity = '1');  
          backPressedCount++;
          setTimeout(() => {
            if (toast) {
              toast.style.opacity = '0';
              setTimeout(() => toast.remove(), 300);
            }
            backPressedCount = 0;
          }, 2500);
        } else {
          history.back();
        }
      });

      /* --- 10. SCROLL PROGRESS & TO-TOP --- */
      const progressPath = document.querySelector('.progress-wrap path');
      if (progressPath) {
        const pathLength = progressPath.getTotalLength();
        progressPath.style.transition = 'none';
        progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = 'stroke-dashoffset 10ms linear';
        
        const updateProgress = () => {
          const scroll = window.scrollY || window.pageYOffset;
          const height = document.documentElement.scrollHeight - window.innerHeight;
          const progress = pathLength - (scroll * pathLength / height);
          progressPath.style.strokeDashoffset = progress;
          
          const myBar = document.getElementById("myBar");
          if (myBar) myBar.style.width = `${(scroll / height) * 100}%`;
          
          const progWrap = document.querySelector('.progress-wrap');
          if (progWrap) progWrap.classList.toggle('active-progress', scroll > 50);
        };
        updateProgress();
        window.addEventListener('scroll', updateProgress);
      }

      document.getElementById('scrollToTopBtn')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      /* --- 11. LIVE SEARCH BOX --- */
      const searchInput = document.querySelector('input[name="q"], #sidebar-search-input');
      if (searchInput) {
        const searchForm = searchInput.closest('form');
        const resultsBox = document.createElement('div');
        resultsBox.id = 'live-search-container';
        searchForm.parentElement.style.position = 'relative';
        searchForm.parentElement.appendChild(resultsBox);
        
        let typeTimer;
        searchInput.addEventListener('keyup', function() {
          clearTimeout(typeTimer);
          const query = this.value.trim();
          if (query.length < 2) {
            resultsBox.style.display = 'none';
            return;
          } 
          resultsBox.style.display = 'block';
          resultsBox.innerHTML = `<div class="search-loading"><i class="fas fa-circle-notch"></i> Searching for "${query}"...</div>`;
          
          typeTimer = setTimeout(() => {
            fetch(`/feeds/posts/summary?alt=json&q=${encodeURIComponent(query)}&max-results=5`)
              .then(res => res.json())
              .then(data => {
                let htmlCode = ''; 
                if (data.feed.entry) {
                  data.feed.entry.forEach(entry => {
                    const postTitle = entry.title.$t;
                    const postLink = entry.link.find(l => l.rel === 'alternate')?.href || '#';
                    const postThumb = entry.media$thumbnail ? entry.media$thumbnail.url.replace('/s72-c/', '/s100-c/') : 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhJtxThUi_030GFwewFxWuYdPoTJyMuOTBYvNpw_Y6wz0Z6y2rLNBQ5GUvI_xHptxIUewAs2S0X5cXp_7lc7RoIUu5D-dTzM9gnBPblQSy5P1h-lb4LC32GA0MrhqDX2m-qc8cVJfoWe422IL6f8IqpjI_lt-ONBa__Vwt6nNfEtbpSwq_wCvBau2eHVOBk/w180-h80-rw/57853.png';
                    htmlCode += `<a href="${postLink}" class="search-result-item"><img src="${postThumb}" class="search-result-thumb"><div class="search-result-title">${postTitle}</div></a>`;
                  });
                } else {
                  htmlCode = `<div class="search-no-result">No results found for "${query}"</div>`;
                }
                resultsBox.innerHTML = htmlCode;
              }).catch(() => resultsBox.innerHTML = `<div class="search-no-result">Error loading results.</div>`);
          }, 500);
        }); 
        document.addEventListener('click', (e) => {
          if (!searchForm.contains(e.target)) resultsBox.style.display = 'none';
        });
      }

      /* --- 12. AUTO TOC & READING TIME --- */
      const postBody = document.querySelector('.post-body');
      if (postBody) {
        // TOC
        const headings = postBody.querySelectorAll('h2, h3, h4');
        if (headings.length >= 2) {
          const tocContainer = document.createElement('div');
          tocContainer.id = 'auto-toc';
          tocContainer.innerHTML = '<div class="toc-title">Table of Contents <button id="tocToggleBtn">[Hide]</button></div><ol id="toc-list"></ol>';
          const tocList = tocContainer.querySelector('#toc-list');
          
          headings.forEach((heading, index) => {
            const anchorId = `toc-point-${index}`;
            heading.id = anchorId; 
            const li = document.createElement('li');
            li.className = heading.tagName.toLowerCase(); 
            li.innerHTML = `<a href="#${anchorId}">${heading.innerText}</a>`;
            tocList.appendChild(li);
          });
          headings[0].parentNode.insertBefore(tocContainer, headings[0]);
          
          document.getElementById('tocToggleBtn').addEventListener('click', function() {
            if (tocList.style.display === 'none') {
              tocList.style.display = 'block';
              this.innerText = '[Hide]';
            } else {
              tocList.style.display = 'none';
              this.innerText = '[Show]';
            }
          });
        }
        // Reading Time
        const wordCount = postBody.innerText.trim().split(/\s+/).length;
        const time = Math.max(1, Math.ceil(wordCount / 200));
        const timeCountTag = document.getElementById('readTimeCount');
        if (timeCountTag) timeCountTag.innerText = `${time} min read`;
      } else {
        const infoStrip = document.querySelector('.gov-info-strip');
        if (infoStrip) infoStrip.style.display = 'none';
      }

      /* --- 13. DISABLE DEV TOOLS --- */
      document.onkeydown = (e) => {
        if (e.keyCode === 123 || 
           (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
           (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
           (e.ctrlKey && e.shiftKey && e.keyCode === 74)) { // Ctrl+Shift+J
          return false;
        }
      };

      /* --- 14. COMMENTS ACCESSIBILITY FIX --- */
      const jadSeFix = () => {
        document.querySelectorAll('.comment-thread ol > div').forEach(div => {
          const li = document.createElement('li');
          li.style.listStyle = 'none';
          div.parentNode.insertBefore(li, div);
          li.appendChild(div);
        });
        document.querySelectorAll('li').forEach(li => {
          if (li.parentElement) {
            const parentTag = li.parentElement.tagName.toLowerCase();
            if (!['ul', 'ol', 'menu'].includes(parentTag)) {
              const ol = document.createElement('ol');
              ol.style.listStyle = 'none';
              ol.style.padding = '0';
              ol.style.margin = '0';
              li.parentNode.insertBefore(ol, li);
              ol.appendChild(li);
            }
          }
        });
        document.querySelectorAll('.comment-reply, .thread-collapsed a, .thread-expanded a, .item-control a, .comments-outer-box a:not([href])').forEach(link => {
          if (!link.hasAttribute('href') || link.getAttribute('href') === '' || link.getAttribute('href').includes('javascript')) {
            link.setAttribute('href', '#comment-editor');
          }
          link.setAttribute('role', 'button');
          link.setAttribute('rel', 'nofollow');
        });
      };
      jadSeFix();
      const targetNode = document.getElementById('comment-holder');
      if (targetNode) new MutationObserver(jadSeFix).observe(targetNode, { childList: true, subtree: true });

    });

    /* --- 15. JSON FEED FUNCTIONS (Global Scope required for Blogger Callbacks) --- */
    window.loadProfessionalPosts = (json) => {
      const posts = json.feed.entry;
      const proList = document.getElementById("pro-post-list");
      if (!proList || !posts) return;
      
      let html = ""; 
      posts.forEach(post => {
        const title = post.title.$t;
        const [year, month, day] = post.published.$t.substring(0, 10).split("-");
        const link = post.link.find(l => l.rel === "alternate")?.href || '#';
        html += `<div class="dash-item"><div class="dash-item-date">${day}-${month}-${year}</div><a class="dash-item-title" href="${link}">${title}</a></div>`;
      });
      proList.innerHTML = html;
    };

    window.loadSarkariTable = (json) => {
      const entries = json.feed.entry;
      const tbody = document.getElementById('gov-live-table');
      if (!tbody) return;
      if (!entries || entries.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4' style='text-align:center;'>No Updates Found</td></tr>";
        return;
      }
      let html = '';
      entries.forEach((entry, i) => {
        let title = entry.title.$t;
        const [year, month, day] = entry.published.$t.substring(0, 10).split('-');
        const link = entry.link.find(l => l.rel === "alternate")?.href || '#';
        if (title.includes('[New]')) title = title.replace('[New]', '<span class="magic-new-badge">NEW</span>');
        
        html += `<tr><td style="text-align:center;">${i + 1}</td><td style="white-space:nowrap;">${day}-${month}-${year}</td><td><b>${title}</b></td><td style="text-align:center;"><a class="btn-view-details" href="${link}">View Details</a></td></tr>`;
      });
      tbody.innerHTML = html;
    };

    window.loadRelatedPosts = (json) => {
      const relContainer = document.getElementById("custom-related-posts");
      if (!relContainer) return;
      const posts = json.feed.entry;
      let html = "";
      const defaultImg = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhJtxThUi_030GFwewFxWuYdPoTJyMuOTBYvNpw_Y6wz0Z6y2rLNBQ5GUvI_xHptxIUewAs2S0X5cXp_7lc7RoIUu5D-dTzM9gnBPblQSy5P1h-lb4LC32GA0MrhqDX2m-qc8cVJfoWe422IL6f8IqpjI_lt-ONBa__Vwt6nNfEtbpSwq_wCvBau2eHVOBk/w180-h80-rw/57853.png";
      
      if (posts && posts.length > 0) {
        posts.slice(0, 3).forEach(post => {
          const title = post.title.$t;
          const link = post.link.find(l => l.rel === "alternate")?.href || '#';
          const imgUrl = post.media$thumbnail ? post.media$thumbnail.url.replace("/s72-c/", "/s400/") : defaultImg;
          html += `<a href="${link}" class="rel-post-item"><img src="${imgUrl}" class="rel-thumb" alt="Thumb"/><span class="rel-title">${title}</span></a>`;
        });
      } else {
        html = '<p style="padding:10px; color:#666;">कोई और अपडेट नहीं मिली।</p>';
      }
      relContainer.innerHTML = html;
    };
    //]]>
  </script>

  <script defer='defer' src='/feeds/posts/summary?alt=json-in-script&amp;max-results=10&amp;callback=loadProfessionalPosts'></script>
  <script defer='defer' src='/feeds/posts/summary?alt=json-in-script&amp;callback=loadSarkariTable&amp;max-results=100'></script>
  
  <b:if cond='data:view.isPost'>
    <b:if cond='data:post.labels'>
      <b:loop index='i' values='data:post.labels' var='label'>
        <b:if cond='data:i == 0'>
          <script defer='defer' expr:src='&quot;/feeds/posts/summary/-/&quot; + data:label.name + &quot;?alt=json-in-script&amp;callback=loadRelatedPosts&amp;max-results=4&quot;' type='text/javascript'/>
        </b:if>
      </b:loop>
    </b:if>
  </b:if>

  <div class='hidden-translate-box' id='google_translate_element'/>
  <script type='text/javascript'>
    //<![CDATA[
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'hi,en', autoDisplay: false }, 'google_translate_element');
    }
    //]]>
  </script>
  <script defer='defer' src='//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit' type='text/javascript'></script>

