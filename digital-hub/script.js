/* Suresh Bishnoi Digital Hub - Core Engine v1.0
   Dynamic Features | PageSpeed Optimized | Vanilla JS
*/

const SureshEngine = {
    init: function() {
        console.log("🚀 Suresh Premium Engine Active");
        this.handleHeader();
        this.lazyLoadImages();
    },

    // Header logic: Scroll hone par header ka look badalna
    handleHeader: function() {
        const header = document.querySelector('.s-header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
                header.style.padding = "0 4%";
            } else {
                header.style.boxShadow = "var(--shadow)";
                header.style.padding = "0 5%";
            }
        });
    },

    // Images ko PageSpeed ke liye optimize karna
    lazyLoadImages: function() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    }
};

// Start the engine
document.addEventListener("DOMContentLoaded", () => SureshEngine.init());

