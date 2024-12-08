
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

   // Reset button functionality
  resetButton.addEventListener("click", function () {
    selectedRating = 0;
    updateStarSelection(selectedRating);
    feedbackText.value = ""; // Clear feedback text
  });

  
  // Submit button functionality
  submitButton.addEventListener("click", function () {
    if (selectedRating === 0) {
      alert("Please provide a rating before submitting.");
      return;
    } 
    
      const feedback = feedbackText.value.trim();
    console.log("Feedback submitted:", {
      rating: selectedRating,
      feedback: feedback || "No additional comments.",
    });

                                  alert("Thank you for your feedback!");
    resetButton.click(); // Reset form after submission
  });

  // Helper function to update star selection
  function updateStarSelection(rating) {
    stars.forEach((star) => {
      const value = parseInt(star.getAttribute("data-value"));
      star.classList.toggle("selected", value <= rating);
    });
  }
});
