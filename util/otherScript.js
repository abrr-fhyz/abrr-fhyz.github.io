function toggleBtnText(btn) {
    if (btn.innerHTML.includes("More")) {
      btn.innerHTML = 'See Less <i class="fas fa-chevron-up"></i>';
    } else {
      btn.innerHTML = 'See More <i class="fas fa-chevron-down"></i>';
    }
  }