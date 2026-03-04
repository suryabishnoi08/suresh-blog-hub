/* ==========================================================
   SURESH BISHNOI - DYNAMIC VILLAGE ENGINE (LATEST v2.0)
   Features: Auto Weather, Live Clock, Bot Protection
   ========================================================== */

(function() {
    // 1. Weather Logic
    const lat = 25.0435, lon = 71.3197;
    const weatherMap = { 0:"साफ़ ☀️", 1:"मुख्यतः साफ़ 🌤", 2:"आंशिक बादल ⛅", 3:"घने बादल ☁️", 95:"तूफान ⚡", 96:"आंधी-बारिश ⛈" };

    async function getLiveWeather() {
        if (navigator.userAgent.includes("Googlebot")) {
            document.getElementById('disp-desc').innerHTML = "लाइव मौसम";
            return;
        }
        try {
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Asia%2FKolkata`);
            const data = await res.json();
            document.getElementById('disp-temp').innerHTML = Math.round(data.current.temperature_2m) + "°C";
            document.getElementById('disp-desc').innerHTML = weatherMap[data.current.weather_code] || "साधारण मौसम";
            document.getElementById('disp-hum').innerHTML = data.current.relative_humidity_2m + "%";
            document.getElementById('disp-wind').innerHTML = data.current.wind_speed_10m + " km/h";
            document.getElementById('disp-min').innerHTML = Math.round(data.daily.temperature_2m_min[0]) + "°C";
            document.getElementById('disp-max').innerHTML = Math.round(data.daily.temperature_2m_max[0]) + "°C";
        } catch (e) { console.warn('Weather API Error'); }
    }

    // 2. FAQ Accordion Logic
    function initFAQ() {
        const btns = document.querySelectorAll('.faq-question-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active-btn');
                const panel = this.nextElementSibling;
                panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
            });
        });
    }

    // 3. Lazy Loading (Map & Icons)
    function lazyAssets() {
        const map = document.querySelector('.map-responsive-pro iframe');
        if(map && map.dataset.src) map.src = map.dataset.src;
        const font = document.createElement('link');
        font.rel = 'stylesheet'; font.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(font);
    }

    window.addEventListener('load', () => {
        setTimeout(getLiveWeather, 800);
        initFAQ();
        setTimeout(lazyAssets, 3000);
    });
})();

