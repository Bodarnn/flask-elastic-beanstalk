"use strict";

class CanvasDrawer {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.canvas.width = 280;
        this.canvas.height = 280;

        this.context = this.canvas.getContext("2d", {alpha: false});
        this.context.fillStyle = "#ffffff";
        this.context.fillRect(0, 0, 280, 280)
        this.context.lineWidth = 20;
        this.context.lineCap = "round";
        this.context.strokeStyle = "000000";

        this.isDrawing = false;

        this.canvas.addEventListener("mousedown", this.startDrawing.bind(this));
        this.canvas.addEventListener("mousemove", this.draw.bind(this));
        this.canvas.addEventListener("mouseup", this.stopDrawing.bind(this));
        this.canvas.addEventListener("mouseleave", this.stopDrawing.bind(this));
    }

    startDrawing(event) {
        this.isDrawing = true;
        this.context.beginPath();
        this.context.moveTo(event.offsetX, event.offsetY);
    }

    draw(event) {
        if (!this.isDrawing) return;
        this.context.lineTo(event.offsetX, event.offsetY);
        this.context.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
        this.context.closePath();
    }
}

const canvasDrawer = new CanvasDrawer();
const predict = document.getElementById("predict");
const message = document.getElementById("message");

predict.addEventListener("click", () => {
    canvasDrawer.canvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append("image", blob);
        fetch("/predict", {method: "POST", body: formData})
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data);
            message.textContent = `Looks like a ${data["prediction"]}`;
        })
        .catch((error) => {
            console.error("Failure:", error);
            message.textContent = `${error.name} try again`;
        });
    });
});
