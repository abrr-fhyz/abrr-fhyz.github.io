function toggleBtnText(btn) {
    if (btn.innerHTML.includes("More")) {
      btn.innerHTML = 'See Less <i class="fas fa-chevron-up"></i>';
    } else {
      btn.innerHTML = 'See More <i class="fas fa-chevron-down"></i>';
    }
  }

const personalBtn = document.getElementById("personalBtn");
const personalBtn2 = document.getElementById("personalBtn2");

if (personalBtn) {
    setTheme("default");
    personalBtn.addEventListener("click", function(event) {
        setTheme("personal");
    });
}

if (personalBtn2) {
    setTheme("personal");
    personalBtn2.addEventListener("click", function(event) {
        setTheme("default");
    });
}

const lastUpdated = "September 2026";

document.getElementById("footer-placeholder").innerHTML = `
<footer class="bg-dark text-white text-center py-4">
    <div class="container">
      <p class="mb-0 small">
        Last Updated: <i>${lastUpdated}</i>.<br>
        &copy; Abrar Fahyaz.
      </p>

      <div class="mt-2">
        <a href="https://github.com/abrr-fhyz" class="text-white-50 mx-2">
          <i class="fab fa-github"></i>
        </a>

        <a href="https://www.linkedin.com/in/abrar-fahyaz/" class="text-white-50 mx-2">
          <i class="fab fa-linkedin"></i>
        </a>
      </div>
    </div>
</footer>
`;