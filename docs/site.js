function toggleMenu(){
  const el = document.getElementById("navLinks");
  if(!el) return;
  el.classList.toggle("show");
}

function toggleHomeDropdown(){
  const el = document.getElementById("homeDropdown");
  if(!el) return;
  el.classList.toggle("show");
}

document.addEventListener("click", function(e){
  const nav = document.getElementById("navLinks");
  const btn = document.querySelector(".menu-btn");

  if(!nav || !btn) return;

  const clickedInsideMenu = nav.contains(e.target);
  const clickedButton = btn.contains(e.target);

  if(!clickedInsideMenu && !clickedButton){
    nav.classList.remove("show");

    const homeDropdown = document.getElementById("homeDropdown");
    if(homeDropdown){
      homeDropdown.classList.remove("show");
    }
  }
});

document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    const nav = document.getElementById("navLinks");
    const homeDropdown = document.getElementById("homeDropdown");

    if(nav) nav.classList.remove("show");
    if(homeDropdown) homeDropdown.classList.remove("show");
  });
});

/* Live countdown to April 8, 2026 */
(function setupLiveCountdown(){
  const daysEl = document.getElementById("countdownDays");
  const hoursEl = document.getElementById("countdownHours");
  const minutesEl = document.getElementById("countdownMinutes");
  const secondsEl = document.getElementById("countdownSeconds");

  if(!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const targetDate = new Date("2026-04-08T00:00:00");

  function updateCountdown(){
    const now = new Date();
    const diff = targetDate - now;

    if(diff <= 0){
      daysEl.textContent = "0";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days);
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

/* Fade-in/out on scroll */
(function setupFadeInOut(){
  const items = document.querySelectorAll(".fade");
  if(!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  }, {
    threshold: 0.15
  });

  items.forEach(el => observer.observe(el));
})();