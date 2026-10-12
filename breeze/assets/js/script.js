 
    function startCountdown() {
      // Set initial duration: 4 hours, 47 minutes, 20 seconds
      let totalSeconds = (4 * 3600) + (47 * 60) + 20;
      const timerDisplay = document.getElementById('countdown-timer');

      function updateTimer() {
        if (totalSeconds <= 0) {
          totalSeconds = (4 * 3600) + (47 * 60) + 20; // Reset loop when it reaches zero
        }

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (num) => String(num).padStart(2, '0');

        timerDisplay.textContent = `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
        totalSeconds--;
      }

      updateTimer();
      setInterval(updateTimer, 1000);
    }

    window.onload = function () {
      startCountdown();
    };


    document.addEventListener("DOMContentLoaded", function () {
  const navbarCollapse = document.querySelector(".navbar-collapse");
  const navLinks = document.querySelectorAll(".navbar-collapse a");

  if (!navbarCollapse) return;

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (
        window.innerWidth < 992 &&
        navbarCollapse.classList.contains("show")
      ) {
        const collapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        collapse.hide();
      }
    });
  });
});
 