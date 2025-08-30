// public/script.js
document.addEventListener('DOMContentLoaded', () => {
  const codeInput = document.getElementById('codeInput');
  const reviewButton = document.getElementById('reviewButton');
  const reviewResult = document.getElementById('reviewResult');

  reviewButton.addEventListener('click', async () => {
    const code = codeInput.value;
    if (!code.trim()) {
      alert('Please paste some code to review.');
      return;
    }

    // Show a loading message
    reviewResult.textContent = 'Analyzing your code... Please wait. 🤔';

    try {
      const response = await fetch('/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with the server.');
      }

      const data = await response.json();
      // Display the feedback from the AI
      reviewResult.textContent = data.feedback;

    } catch (error) {
      reviewResult.textContent = `An error occurred: ${error.message}`;
      console.error('Error:', error);
    }
  });
});