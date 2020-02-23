;
;
var DesiredOutputFormat = /** @class */ (function () {
    function DesiredOutputFormat(imageName) {
        this.annotations = [];
        this.imageName = imageName;
    }
    DesiredOutputFormat.prototype.addNode1 = function (node) {
        this.annotations.push(node);
    };
    return DesiredOutputFormat;
}());
;
var output, type, typeOfAn, canvasFull = false;
objectCounter = 0,
    pointULCounter = 0,
    pointLRCounter = 0;
var canvas, ctx, mousePos, rect = {}, closeEnough = 10, dragTL = false, dragBL = false, dragTR = false, dragBR = false;
var snapshot;
var imageData;
var data;
function takeSnapshot() {
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;
}
function restoreSnapshot() {
    ctx.putImageData(imageData, 0, 0);
}
var loadFile = function (event) {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    if (canvasFull === true)
        newImageClearAll(canvas, ctx);
    var fileInput = document.getElementById('file');
    var fileName = fileInput.value.split(/(\\|\/)/g).pop();
    var image = new Image;
    //newImageClearAll(canvas, ctx);
    output = new DesiredOutputFormat(fileName);
    image.onload = drawImageActualSize;
    image.src = URL.createObjectURL(event.target.files[0]);
    function drawImageActualSize() {
        canvas.style.width = '100%';
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        ctx.drawImage(this, 0, 0, image.width, image.height);
        canvasFull = true;
        takeSnapshot();
    }
};
function newImageClearAll(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvasFull = false;
    //output = null;
    objectCounter = pointULCounter = pointLRCounter = 0;
    document.getElementById("canvas").innerHTML = null;
    document.getElementById("outputJSONFormat").innerHTML = null;
}
function getCanvasCoordinates(event) {
    var rect = canvas.getBoundingClientRect(), scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}
function drawRectangle(toolType) {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    type = toolType;
    if (type === "Interesting")
        ctx.strokeStyle = 'green';
    else if (type === "Uninteresting")
        ctx.strokeStyle = 'red';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    takeSnapshot();
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mouseup', mouseUp, false);
}
function mouseDown(ev) {
    mousePos = getCanvasCoordinates(ev);
    takeSnapshot();
    if (rect.w === undefined) {
        rect.startX = mousePos.x;
        rect.startY = mousePos.y;
        dragBR = true;
    }
    else if (checkCloseEnough(mousePos.x, rect.startX) && checkCloseEnough(mousePos.y, rect.startY)) {
        dragTL = true;
    }
    else if (checkCloseEnough(mousePos.x, rect.startX + rect.w) && checkCloseEnough(mousePos.y, rect.startY)) {
        dragTR = true;
    }
    else if (checkCloseEnough(mousePos.x, rect.startX) && checkCloseEnough(mousePos.y, rect.startY + rect.h)) {
        dragBL = true;
    }
    else if (checkCloseEnough(mousePos.x, rect.startX + rect.w) && checkCloseEnough(mousePos.y, rect.startY + rect.h)) {
        dragBR = true;
    }
    else {
        // handle not resizing
    }
    draw();
}
function mouseMove(ev) {
    mousePos = getCanvasCoordinates(ev);
    if (dragTL) {
        rect.w += rect.startX - mousePos.x;
        rect.h += rect.startY - mousePos.y;
        rect.startX = mousePos.x;
        rect.startY = mousePos.y;
    }
    else if (dragTR) {
        rect.w = Math.abs(rect.startX - mousePos.x);
        rect.h += rect.startY - mousePos.y;
        rect.startY = mousePos.y;
    }
    else if (dragBL) {
        rect.w += rect.startX - mousePos.x;
        rect.h = Math.abs(rect.startY - mousePos.y);
        rect.startX = mousePos.x;
    }
    else if (dragBR) {
        rect.w = Math.abs(rect.startX - mousePos.x);
        rect.h = Math.abs(rect.startY - mousePos.y);
    }
    restoreSnapshot();
    draw();
}
function mouseUp() {
    takeSnapshot();
    restoreSnapshot();
    draw();
    pointULCounter++;
    var pointUL = { pointID: "PointUL" + pointULCounter, x: rect.startX, y: rect.startY };
    pointLRCounter++;
    var pointLR = { pointID: "PointLR" + pointLRCounter, x: rect.startX + rect.w, y: rect.startY + rect.h };
    objectCounter++;
    var node = { annotationID: "Object" + objectCounter, upperLeft: pointUL, lowerRight: pointLR, type: type };
    output.addNode1(node);
    dragTL = dragTR = dragBL = dragBR = false;
    rect.w = undefined;
}
function draw() {
    if (type == "Interesting")
        ctx.fillStyle = "rgba(76, 175, 80, 1.0)";
    else if (type == "Uninteresting")
        ctx.fillStyle = "rgba(76, 175, 80, 1.0)";
    ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
}
function checkCloseEnough(p1, p2) {
    return Math.abs(p1 - p2) < closeEnough;
}
function addNode(node) {
    output.annotations.push(node);
}
function outputJSON() {
    document.getElementById("outputJSONFormat").innerHTML = null;
    var out = '';
    out += JSON.stringify(output, null, 4);
    document.getElementById("outputJSONFormat").innerHTML = out;
    console.log(out);
}
