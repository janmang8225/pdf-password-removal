const form = document.getElementById('pdfForm');
const result = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  result.innerHTML = 'Processing...';

  const formData = new FormData(form);

  const response = await fetch('/remove-password', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (data.success) {
    result.innerHTML = `
      <div class="success">
        <h2>Password removed successfully</h2>
        <a class="download-btn" href="${data.download}" download>
          Download PDF
        </a>
      </div>
    `;
  } else {
    result.innerHTML = `
      <div class="error">
        ${data.message}
      </div>
    `;
  }
});