/**
 * Game.cookies
 * Game.UpgradesById[0].getPrice()
 */

let bigBrain = new BigBrain();
bigBrain.train(Data.MasterMind.training);

let n;
function go(timer = 200) {
    n = setInterval(function(){
        Utils.initCoordinates();
        bigBrain.play();
    }, timer);
}

function playOnce() {
    Utils.initCoordinates();
    bigBrain.play();
}

function stop() {
    clearInterval(n);
}

let canvas;

function preLoad() {
    
}

function setup() {
    canvas = new Canvas();
    bigBrain.spawn(windowWidth/2,windowHeight/2);
}

function draw() {
    clear();
    bigBrain.draw();
}