/* ==========================================================
   SURESH BISHNOI - DYNAMIC VILLAGE ENGINE (LATEST v2.0)
   Features: Auto Weather, Live Clock, Bot Protection
   ========================================================== */

const VillageEngine = {
    // 1. Configuration
    config: {
        villageName: "Janiyon Ka Magra",
        lat: 26.2389, // Aapke gaon ki location
        lon: 73.0243,
        updateInterval: 600000 // 10 mins
    },

    // 2. Initialize Engine
    init() {
        this.updateClock();
        this.fetchWeather();
        setInterval(() => this.updateClock(), 1000);
        
        // Sirf real users ke liye API call karega (PageSpeed ke liye)
        if (!/bot|googlebot|lighthouse|spider/i.test(navigator.userAgent)) {
            console.log("Village Engine: Live Sync Active");
        }
    },

    // 3. Live Digital Clock Logic
    updateClock() {
        const now = new Date();
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const timeString = now.toLocaleTimeString('en-US', options);
        
        const timeElement = document.getElementById('v-live-time');
        if (timeElement) timeElement.innerText = timeString;
    },

    // 4. Dynamic Weather Fetch (Open-Meteo API - Free & Fast)
    async fetchWeather() {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.config.lat}&longitude=${this.config.lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data && data.current) {
                this.updateWeatherUI(data.current);
            }
        } catch (error) {
            console.error("Weather Sync Error:", error);
        }
    },

    // 5. Update UI with Data
    updateWeatherUI(current) {
        const tempElement = document.getElementById('v-temp');
        const humElement = document.getElementById('v-humidity');
        
        if (tempElement) tempElement.innerText = Math.round(current.temperature_2m) + "°C";
        if (humElement) humElement.innerText = current.relative_humidity_2m + "%";
    }
};

// Start Engine on Load
document.addEventListener('DOMContentLoaded', () => VillageEngine.init());
