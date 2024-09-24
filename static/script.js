document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image file.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('/api', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Success:', result);
        document.getElementById('message').textContent = `It's a ${result}`;

        const imgElement = document.getElementById('uploadedImage');
        const reader = new FileReader();
        
        reader.onload = (e) => {
            imgElement.src = e.target.result;
            imgElement.style.display = 'block';
        };

        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').textContent = error.message;
    }
});
