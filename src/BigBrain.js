class BigBrain {
    recentlyClicked = false;
    bestObjectToClick = 'cookie';
    hits = 0;
    misses = 0;
    shake = false;
    lines = [];

    constructor( strictPrediction = false ) {
        this.strictPrediction = strictPrediction;
        this.net = new brain.NeuralNetwork();
    }

    train(data = false) {
        if ( data === false ) {
            this.net.train(this.trainingData);
        } else {
            this.net.train(data);
        }
    }

    recordTrainingData() {
        let $this = this;
        this.trainingData = [];
        document.addEventListener('mousedown', function(event){
            let output = Utils.getStateByClickTarget(event.target);
            if ( output !== false ) {
                $this.trainingData.push({
                    'input': Utils.getCurrentGameState(),
                    'output': output
                });
            }
        });
    }

    getHighestPrediction(prediction) {
        return Object.keys(prediction).reduce(function(a, b){ return prediction[a] > prediction[b] ? a : b });
    }

    getPredictionByWeights(prediction) {
        let sum = 0, partialSum = 0, key = 0;
        Object.keys(prediction).forEach((k) => {
            sum += prediction[k];
        });
        const n = Math.random() * sum;
        Object.keys(prediction).every((k) => {
            partialSum += prediction[k];
            if ( partialSum > n ) {
                key = k;
                return false;
            }
            return true;
        });
        return key;
    }

    play() {
        let prediction = this.net.run(Utils.getCurrentGameState()), objectKey;
        if ( this.strictPrediction ) {
            objectKey = this.getHighestPrediction(prediction);
        } else {
            objectKey = this.getPredictionByWeights(prediction);
        }
        this.bestObjectToClick = Utils.getBestObjectToClick();
        Utils.click(objectKey);
        this.recentlyClicked = objectKey;
        if ( this.recentlyClicked == this.bestObjectToClick ) {
            ++this.hits;
        } else {
            ++this.misses;
        }
        this.laserSound.play();
    }

    spawn(x, y) {
        this.brainGroup = new Group();
        this.x = x;
        this.y = y;
        this.brain = new this.brainGroup.Sprite(x, y, 128, 128, 'static');
        this.veins = loadAnimation('images/brain-sprite-x2.png', { frameSize: [128, 128], frames: 10 });
        this.brain.addAni(this.veins, 'images/brain-sprite-x2.png', 10);


        this.laserSound = loadSound('sounds/laser.mp3');

        return this.brain;
    }

    draw() {
        this.shoot();
        this.startShake();
    }

    shoot() {
        let $this = this;
        if ( this.recentlyClicked !== false ) {
            let {x, y} = Utils.getObjectRandomCoordinatesByName(this.recentlyClicked);
            this.lines.push({
                "x":x, 
                "y": y, 
                "frame": 0, 
                "hit": this.recentlyClicked == this.bestObjectToClick
            });
            this.recentlyClicked = false;
            this.shake = true;
        }
        this.lines.forEach(function(l, i, obj){
            if ( l.hit ) {
                strokeWeight(1);
                stroke(255, 100, 100); 
                fill(255, 100, 100);
                circle(l.x, l.y, 8);

                strokeWeight(4);
                stroke(255, 0, 0);
                line($this.x, $this.y, l.x, l.y);

                strokeWeight(2);
                stroke(255, 255,255);
                line($this.x, $this.y, l.x, l.y);
            } else {
                strokeWeight(4);
                stroke(150, 150, 150); 
                line($this.x, $this.y, l.x, l.y);

                fill(150, 150, 150);
                circle(l.x, l.y, 8);
            }
            ++l.frame;
            if ( l.frame > 7 ) {
                obj.splice(i, 1);
            }
        });
        if ( this.lines.length == 0 ) {
            this.shake = false;
        }
    }

    move(x,y) {
        this.brainGroup.moveTowards({'x':x,'y':y}, 0.10);
    }

    async startShake() {
        if ( this.shake ) {
            let nx = Utils.randomInt(this.x-3, this.x+3),
                ny = Utils.randomInt(this.y-3, this.y+3);
            await this.brainGroup.moveTo(nx, ny, 10);
            this.startShake();
        }
    }
}