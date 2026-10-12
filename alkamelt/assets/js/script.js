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
        <img src="assets/image/index-img.webp" 
             alt="AlkaMelt Bottle" 
             style="width: 80px; height: 80px; border-radius: 8px;">
        <div>
           ⭐⭐⭐⭐⭐<br>
            <strong>${name}</strong> from <strong>${state}</strong> purchased 
            <strong>${bottleCount}</strong> of AlkaMelt   
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

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function () {
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

function copyCode() {
  const codeText = document.getElementById("codeSnippet").innerText;

  // Clipboard standard API with fallback
  if (navigator.clipboard) {
    navigator.clipboard.writeText(codeText).then(showToast);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = codeText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showToast();
  }
}

function showToast() {
  const toast = document.getElementById("copyToast");
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

document.getElementById("currentYear").textContent = new Date().getFullYear();