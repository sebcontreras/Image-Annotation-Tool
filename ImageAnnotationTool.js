var loadFile = function (event) {
    var image = document.getElementById('input-image');
    image.src = URL.createObjectURL(event.target.files[0]);
};
