// Site-wide enhancements
document.addEventListener('DOMContentLoaded', () => {
  // Update any © year automatically
  const year = new Date().getFullYear();
  document.querySelectorAll('footer, .site-footer').forEach(footer => {
    footer.innerHTML = footer.innerHTML.replace(/©\s*\d{4}/, `© ${year}`);
  });

  // Add a class to indicate JS is active (can be used in CSS if needed)
  document.documentElement.classList.add('js-enabled');
});

