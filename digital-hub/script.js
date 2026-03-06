/* =========================================
   PREMIUM DYNAMIC SCRIPTS (2026 VERSION)
   Suresh Bishnoi Digital Hub
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  console.log("Suresh Bishnoi Digital Hub - Theme Loaded Successfully! 🚀");
  
  // 1. डायनामिक स्टिकी हेडर (Dynamic Sticky Header)
  // जब यूजर नीचे स्क्रॉल करेगा, तो हेडर की शैडो गहरी हो जाएगी (Premium 3D feel)
  const header = document.querySelector('.centered-top-container');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        header.style.transition = 'box-shadow 0.3s ease';
      } else {
        header.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.05)';
      }
    });
  }
  
  // 2. स्मूथ स्क्रॉलिंग (Smooth Scrolling)
  // जब कोई "Read More" या किसी भी लिंक पर क्लिक करेगा, तो पेज झटके से नहीं, बल्कि स्मूथली जाएगा
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetElement = document.querySelector(this
        .getAttribute('href'));
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // 3. मोबाइल मेनू टॉगल (Mobile Menu Hamburger)
  // मोबाइल स्क्रीन पर मेनू को खोलने और बंद करने के लिए
  const menuButton = document.querySelector('.hamburger-menu');
  const navMenu = document.querySelector('nav[role="navigation"]');
  
  if (menuButton && navMenu) {
    menuButton.addEventListener('click', () => {
      // मेनू को शो/हाइड करने का टॉगल
      if (navMenu.style.display === 'block') {
        navMenu.style.display = 'none';
      } else {
        navMenu.style.display = 'block';
      }
    });
  }
});
