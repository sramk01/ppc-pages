const names = [
  "James",
  "Andrew B.",
  "Harper Lewis",
  "Robert L.",
  "Michael R",
  "William Harris",
  "Daniel Carter",
  "Brian",
  "Mark Brooks",
  "Devid Johnson",
  "Jacob Reed",
];
const states = [
  "California",
  "Washington",
  "Florida",
  "New York",
  "Illinois",
  "Ohio",
  "New York",
  "Austin",
  "Denver, Colorado",
  "Ohio",
  "Pennsylvania",
];
const bottles = ["2 Bottle", "6 Bottle", "3 Bottle"];

function showPurchaseProof() {
  const name = names[Math.floor(Math.random() * names.length)];
  const state = states[Math.floor(Math.random() * states.length)];
  const bottleCount = bottles[Math.floor(Math.random() * bottles.length)];
  const timeAgo = Math.floor(Math.random() * 10) + 1;

  document.getElementById("proof-text").innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
        <img src="assets/image/sugar-pure-balance-6.webp" 
             alt="Sugar Pure Balance Bottle" 
             style="width: 80px; height: 50px; border-radius: 8px;">
        <div>
            ⭐⭐⭐⭐⭐<br>
            <strong>${name}</strong> from <strong>${state}</strong> purchased 
            <strong>${bottleCount}</strong> of Sugar Pure Balance   
            <br><small>${timeAgo} minutes ago</small>
        </div>
    </div>
`;

  const box = document.getElementById("purchase-proof");

  if (window.innerWidth < 500) {
    box.style.display = "none";
    return;
  }

  box.style.display = "block";
  setTimeout(() => {
    box.style.transform = "translateX(0)";
  }, 100);
  setTimeout(() => {
    box.style.transform = "translateX(-120%)";
  }, 5000);
}

setInterval(showPurchaseProof, 6000);


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
