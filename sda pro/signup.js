// Handle form submission
document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission
  // Redirect to homepage
  window.location.href = '/homepage';
});
