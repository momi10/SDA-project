class Feedback {
  constructor() {
    this.stars = document.querySelectorAll(".star");
    this.submitButton = document.getElementById("submit-button");
    this.resetButton = document.getElementById("reset-button");  // Add the reset button
    this.feedbackInput = document.getElementById("feedback");

    this.bindEvents();
  }

  bindEvents() {
    this.submitButton.addEventListener("click", this.submitFeedback.bind(this));
    this.resetButton.addEventListener("click", this.resetForm.bind(this));  // Add reset button event
    this.stars.forEach((star, index) => {
      star.addEventListener("click", () => this.setRating(index));
    });
  }

  setRating(index) {
    this.stars.forEach((star, i) => {
      if (i <= index) {
        star.classList.add("active");
      } else {
        star.classList.remove("active");
      }
    });
  }

  async submitFeedback() {
    const rating = document.querySelectorAll(".star.active").length;
    const comment = this.feedbackInput.value;

    if (!rating) {
      alert("Please provide a rating.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/submit-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Feedback submitted successfully!");
      } else {
        alert(result.message || "Failed to submit feedback.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback.");
    }
  }

  resetForm() {
    
    this.stars.forEach(star => star.classList.remove("active"));
    
    
    this.feedbackInput.value = '';
  }
}

const feedback = new Feedback();
