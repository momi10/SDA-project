
document.addEventListener("DOMContentLoaded", function () {
  const stars = document.querySelectorAll(".star");
  const resetButton = document.getElementById("reset-button");
  const submitButton = document.getElementById("submit-button");
  const feedbackText = document.getElementById("feedback");
  let selectedRating = 0;
  
 // Handle star click for rating
  stars.forEach((star) => {
    star.addEventListener("click", function () {
      selectedRating = parseInt(this.getAttribute("data-value"));
      updateStarSelection(selectedRating);
    });
  });
