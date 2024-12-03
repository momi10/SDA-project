const form = document.getElementById('course-form');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const userId = document.getElementById('userId').value.trim();
        const courseName = document.getElementById('courseName').value.trim();

        // Validate input
        if (!userId || !courseName) {
            alert('Both User ID and Course Name are required.');
            return;
        }

        try {
            // Add course via /courses endpoint
            const response = await fetch('/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseid: userId, // Assuming course ID corresponds to user ID in this case
                    coursename: courseName,
                }),
            });

            if (response.ok) {
                const result = await response.text(); // Adjusted to handle plain text response
                alert(result); // Expected to be "added"
                form.reset();
            } else {
                const errorData = await response.json();
                alert(`Failed to add course: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding course:', error);
            alert('An error occurred while adding the course. Please try again later.');
        }
    });
}
