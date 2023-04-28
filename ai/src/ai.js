/**
 * Game.cookies
 * Game.UpgradesById[0].getPrice()
 */

window.assetPath =  window.assetPath || 'ai/';

/*let bigBrain = new BigBrain();
bigBrain.train(Data.MasterMind.training);

let smallBrain = new SmallBrain();

let bp = new Population(100, 0.05, 0.95);

let n, m;
function go(timer = 200) {
    n = setInterval(function(){
        Utils.initCoordinates();
        bigBrain.play();
    }, timer);
}


function goSmallBrain(timer = 200) {
    m = setInterval(function(){
        Utils.initCoordinates();
        smallBrain.play();
    }, timer);
}

function playOnce() {
    Utils.initCoordinates();
    bigBrain.play();
}

function stop() {
    clearInterval(n);
    clearInterval(m);
}

let canvas;

function preLoad() {
    
}

function setup() {
    canvas = new Canvas();
    bigBrain.spawn(windowWidth/2,windowHeight/2);
    smallBrain.spawn(windowWidth/2 - 50,windowHeight/2 + 40);
    bp.spawn();
}

function draw() {
    clear();
    bigBrain.draw();
    smallBrain.draw();
    bp.draw();
}

function windowResized() {
    Utils.initCoordinates(true);
    resizeCanvas(windowWidth, windowHeight);
    bigBrain.position(windowWidth/2,windowHeight/2);
}*/

let canvas;
let controller = new Controller();

function preload() {
    controller.preLoad();
}

function setup() {
    canvas = new Canvas();
    //controller.setup();
}

function draw() {
    clear();
    controller.draw();
}

function windowResized() {
    Utils.initCoordinates(true);
    resizeCanvas(windowWidth, windowHeight);
}