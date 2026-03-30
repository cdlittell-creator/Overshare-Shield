function toggleMenu(){
  const el = document.getElementById("navLinks");
  if(!el) return;
  el.style.display = (el.style.display === "flex" || el.style.display === "block") ? "none" : "flex";
}

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