type Point={
    pointID: string,
    x, y
};

type Annotation={
    annotationID: string,
    upperLeft: Point,
    lowerRight: Point,
    type: "Interesting" | "Uninteresting" 
};

type DesiredOutputFormat={
    imageName: string,
    annotations: Annotation[]
};

var loadFile =  function(event) {
    var image = document.getElementById('input-image');
    image.src = URL.createObjectURL(event.target.files[0]);
};


