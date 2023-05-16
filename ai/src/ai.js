window.assetPath =  window.assetPath || 'ai/';

let canvas;
let controller = new Controller();

function preload() {
    controller.preLoad();
}

function setup() {
    canvas = new Canvas();
    controller.setup();
}

function draw() {
    clear();
    controller.draw();
}

function windowResized() {
    Utils.initCoordinates(true);
    resizeCanvas(windowWidth, windowHeight);
}