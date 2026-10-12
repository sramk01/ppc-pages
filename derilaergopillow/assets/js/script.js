const names = [
  "James",
  "Sarah T.",
  "Harper Lewis",
  "Michael Carter",
  "Ella Carter",
  "William Harris",
  "Daniel Carter",
  "Brian",
  "Eleanor Brooks",
  "Emily Johnson",
  "Isabella Reed",
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
const bottles = ["1 Derila Pillow", "3 Derila Pillow", "2 Derila Pillow"];

function showPurchaseProof() {
  const name = names[Math.floor(Math.random() * names.length)];
  const state = states[Math.floor(Math.random() * states.length)];
  const bottleCount = bottles[Math.floor(Math.random() * bottles.length)];
  const timeAgo = Math.floor(Math.random() * 10) + 1;

  document.getElementById("proof-text").innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
        <img src="assets/image/bannerimg.webp" 
             alt="Derila Pillow Bottle" 
             style="width: 80px; height: 80px; border-radius: 8px;">
        <div>
            ⭐⭐⭐⭐⭐<br>
            <strong>${name}</strong> from <strong>${state}</strong> purchased 
            <strong>${bottleCount}</strong> of Derila Pillow
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
