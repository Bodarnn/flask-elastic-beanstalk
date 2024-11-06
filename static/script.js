window.onload = function() {
    var myCanvas = document.getElementById("myCanvas");
    var ctx = myCanvas.getContext("2d");
    
    // Fill Window Width and Height
    myCanvas.width = 280;
    myCanvas.height = 280;
    
    // Set Background Color
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
    
    // Mouse Event Handlers
    if (myCanvas) {
        var isDown = false;
        var canvasX, canvasY;
        ctx.lineWidth = 5;
        
        $(myCanvas)
            .mousedown(function(e) {
                isDown = true;
                ctx.beginPath();
                canvasX = e.pageX - myCanvas.offsetLeft;
                canvasY = e.pageY - myCanvas.offsetTop;
                ctx.moveTo(canvasX, canvasY);
            })
            .mousemove(function(e) {
                if (isDown) {
                    canvasX = e.pageX - myCanvas.offsetLeft;
                    canvasY = e.pageY - myCanvas.offsetTop;
                    ctx.lineTo(canvasX, canvasY);
                    ctx.strokeStyle = "#000";
                    ctx.stroke();
                }
            })
            .mouseup(function(e) {
                isDown = false;
                ctx.closePath();
            });
    }
    
    // Touch Events Handlers
    draw = {
        started: false,
        start: function(evt) {
            evt.preventDefault(); // Prevent default to avoid scrolling
            ctx.beginPath();
            const rect = myCanvas.getBoundingClientRect();
            ctx.moveTo(
                evt.touches[0].clientX - rect.left,
                evt.touches[0].clientY - rect.top
            );
            this.started = true;
        },
        move: function(evt) {
            evt.preventDefault();
            if (this.started) {
                const rect = myCanvas.getBoundingClientRect();
                ctx.lineTo(
                    evt.touches[0].clientX - rect.left,
                    evt.touches[0].clientY - rect.top
                );
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 10;
                ctx.stroke();
            }
        },
        end: function(evt) {
            this.started = false;
        }
    };
    
    // Touch Events
    myCanvas.addEventListener('touchstart', draw.start, false);
    myCanvas.addEventListener('touchend', draw.end, false);
    myCanvas.addEventListener('touchmove', draw.move, false);
    
    // Disable Page Move
    document.body.addEventListener('touchmove', function(evt) {
        evt.preventDefault();
    }, false);
};

document.getElementById('saveCanvas').addEventListener('click', async () => {
    const myCanvas = document.getElementById("myCanvas");
    const imageData = myCanvas.toDataURL("image/png");

    // Convert base64 image to blob
    const response = await fetch(imageData);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('image', blob, 'canvas.png');

    try {
        const apiResponse = await fetch('/api/invert', {
            method: 'POST',
            body: formData,
        });

        if (!apiResponse.ok) {
            throw new Error(`Upload failed: ${apiResponse.statusText}`);
        }

        const result = await apiResponse.json();
        console.log('Inverted Success:', result);
        document.getElementById('message').textContent = `It's a ${result}`;

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').textContent = error.message;
    }
});

// Existing Upload Functionality
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
