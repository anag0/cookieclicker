class BigBrain {
    recentlyClicked = false;
    bestObjectToClick = 'cookie';
    hits = 0;
    misses = 0;
    shake = false;
    lines = [];
    spokenText = '';

    constructor( strictPrediction = false, training = false ) {
        this.strictPrediction = strictPrediction;
        this.net = new brain.NeuralNetwork();
        this.training = training;
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
            if ( !this.training ) {
                BigBrain.laserSoundHit.play();
            }
        } else {
            ++this.misses;
            if ( !this.training ) {
                BigBrain.laserSoundMiss.play();
            }
        }
    }

    static preload() {
        BigBrain.veins = loadAnimation(  window.assetPath + 'images/brain-sprite-x2.png', { frameSize: [128, 128], frames: 10 });
        BigBrain.laserSoundHit = loadSound(  window.assetPath + 'sounds/laser-big.mp3');
        BigBrain.laserSoundMiss = loadSound(  window.assetPath + 'sounds/laser-big-miss.mp3');
        //BigBrain.textBubble = new this.brainGroup.Sprite(0, 0, 198, 120, 'none');
        //BigBrain.textBubble.img = window.assetPath + 'images/brain-bubble.png';
        BigBrain.textBubble = loadImage(window.assetPath + 'images/brain-bubble.png');
    }

    spawn(x, y) {
        this.brainGroup = new Group();
        this.x = x;
        this.y = y;
        this.brain = new this.brainGroup.Sprite(0, 0, 128, 128, 'none');
        this.brain.layer = 2;
        this.brain.addAni(BigBrain.veins,  window.assetPath + 'images/brain-sprite-x2.png', 10);


        this.brainGroup.x = x;
        this.brainGroup.y = y;
        //BigBrain.textBubble.x = this.x + 120;
        //BigBrain.textBubble.y = this.y - 80;
        //BigBrain.textBubble.visible = false;

        return this.brain;
    }

    die() {
        this.brain.remove();
    }

    speak(text = 'Yo wasup') {
        let $this = this;
        this.spokenText = text;

        /*BigBrain.textBubble.visible = true;
        BigBrain.textBubble.textColor = 'white';
        BigBrain.textBubble.textSize = 24;
        BigBrain.textBubble.text = text;*/
        
        /*for ( var i=0; i<text.length; i++ ) {
            setTimeout(function(){
                console.log(text, i, text[i]);
                $this.spokenText += text[i];
            }, (i+1) * 10 );
        }*/
        clearTimeout(this.speakTimeout);
        this.speakTimeout = setTimeout(function(){
            //$BigBrain.textBubble.visible = false;
            $this.spokenText = '';
        }, 4000);
    }

    position(x, y) {
        this.x = x;
        this.y = y;
    }

    draw() {
        this.shoot();
        this.brainGroup.draw();
        this.startShake();
        this.showSpokenText();
    }

    showSpokenText() {
        //console.log(this.spokenText);
        if ( this.spokenText != '' ) {
            image( BigBrain.textBubble, this.x + 30 , this.y - 140 );
            textSize(16);
            textAlign(CENTER, CENTER);
            fill(255, 255, 255);
            text( this.spokenText, this.x + 45 , this.y - 135, 170, 80 );
        }
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