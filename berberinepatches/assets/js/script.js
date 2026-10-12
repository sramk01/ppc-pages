 


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
 