document.getElementById('recipe-form').addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent default form submission

    // Get the user input and split it into an array of ingredients
    const ingredients = document.getElementById('ingredients').value.trim().split(',').map(item => item.trim());

    try {
        // Send the ingredients to the server to generate a recipe
        const response = await fetch('/generate-recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ingredients })  // Send ingredients as JSON
        });

        const data = await response.json();

        // Convert markdown to HTML and display the generated recipe
        const htmlContent = marked.parse(data.recipe);
        document.getElementById('recipe-content').innerHTML = htmlContent;
        document.getElementById('recipe-output-container').style.display = 'block';
    } catch (error) {
        console.error('Error generating recipe:', error);
        document.getElementById('recipe-content').innerText = 'An error occurred. Please try again later.';
        document.getElementById('recipe-output-container').style.display = 'block';
    }
});
