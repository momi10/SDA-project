document.getElementById("inquiry-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
        const response = await fetch("http://localhost:4000/submit-inquiry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message); // Show success message
            document.getElementById("inquiry-form").reset(); // Clear form fields
        } else {
            alert(result.message || "Failed to send the inquiry.");
        }
    } catch (error) {
        console.error("Error submitting inquiry:", error);
        alert("Error submitting the inquiry.");
    }
});
