document.addEventListener('DOMContentLoaded', () => {
    // Fetch fields from the server and populate the page
    fetchFields();

    // Function to fetch fields from the server
    function fetchFields() {
        fetch('/fields')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch fields');
                }
                return response.json();
            })
            .then((data) => {
                populateFields(data);
            })
            .catch((error) => {
                console.error('Error fetching fields:', error);
                const fieldsContainer = document.querySelector('.fields');
                fieldsContainer.innerHTML = '<p>Error loading fields. Please try again later.</p>';
            });
    }

    // Function to dynamically populate the fields in the HTML
    function populateFields(fields) {
        const fieldsContainer = document.querySelector('.fields');
        fieldsContainer.innerHTML = ''; // Clear any existing content

        if (fields.length === 0) {
            fieldsContainer.innerHTML = '<p>No fields available.</p>';
            return;
        }

        // Create links for each field
        fields.forEach((field) => {
            const fieldLink = document.createElement('a');
            fieldLink.href = `/fields/${field.fieldid}`; // Example of linking to a field-specific page
            fieldLink.textContent = field.fieldname;
            fieldLink.className = 'field';
            fieldsContainer.appendChild(fieldLink);
        });
    }
});
