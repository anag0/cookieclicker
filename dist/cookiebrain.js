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
}let Data = {
    MasterMind: {
        training: [
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 1,
                "Prism": 1,
                "Chancemaker": 1,
                "Fractal engine": 1,
                "Javascript console": 1,
                "Idleverse": 1,
                "Cortex baker": 0,
                "upgrade": 1
              },
              "output": {
                "upgrade": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 1,
                "Prism": 1,
                "Chancemaker": 1,
                "Fractal engine": 1,
                "Javascript console": 1,
                "Idleverse": 1,
                "Cortex baker": 1,
                "upgrade": 1
              },
              "output": {
                "upgrade": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 1,
                "Prism": 1,
                "Chancemaker": 1,
                "Fractal engine": 1,
                "Javascript console": 1,
                "Idleverse": 1,
                "Cortex baker": 1,
                "upgrade": 0
              },
              "output": {
                "Cortex baker": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 1,
                "Prism": 1,
                "Chancemaker": 1,
                "Fractal engine": 1,
                "Javascript console": 1,
                "Idleverse": 1,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Idleverse": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 1,
                "Prism": 1,
                "Chancemaker": 1,
                "Fractal engine": 1,
                "Javascript console": 1,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Javascript console": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 1,
                "Prism": 1,
                "Chancemaker": 1,
                "Fractal engine": 1,
                "Javascript console": 1,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Javascript console": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 1,
                "Prism": 1,
                "Chancemaker": 1,
                "Fractal engine": 1,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Fractal engine": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 1,
                "Prism": 1,
                "Chancemaker": 1,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Chancemaker": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 1,
                "Prism": 1,
                "Chancemaker": 1,
                "Fractal engine": 1,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Fractal engine": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 1,
                "Prism": 1,
                "Chancemaker": 1,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Chancemaker": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 1,
                "Prism": 1,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Prism": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 1,
                "Prism": 1,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Prism": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 1,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Antimatter condenser": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 1,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Time machine": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Portal": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 1,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Portal": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 1,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Alchemy lab": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 1,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Shipment": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 1,
                "Shipment": 0,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Wizard tower": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 1,
                "Wizard tower": 0,
                "Shipment": 0,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Temple": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 1,
                "Temple": 0,
                "Wizard tower": 0,
                "Shipment": 0,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Bank": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 1,
                "Bank": 0,
                "Temple": 0,
                "Wizard tower": 0,
                "Shipment": 0,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Factory": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 0,
                "Bank": 0,
                "Temple": 0,
                "Wizard tower": 0,
                "Shipment": 0,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Mine": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 1,
                "Factory": 0,
                "Bank": 0,
                "Temple": 0,
                "Wizard tower": 0,
                "Shipment": 0,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Mine": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 1,
                "Mine": 0,
                "Factory": 0,
                "Bank": 0,
                "Temple": 0,
                "Wizard tower": 0,
                "Shipment": 0,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Farm": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 1,
                "Farm": 0,
                "Mine": 0,
                "Factory": 0,
                "Bank": 0,
                "Temple": 0,
                "Wizard tower": 0,
                "Shipment": 0,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Grandma": 1
              }
            },
            {
              "input": {
                "Cursor": 1,
                "Grandma": 0,
                "Farm": 0,
                "Mine": 0,
                "Factory": 0,
                "Bank": 0,
                "Temple": 0,
                "Wizard tower": 0,
                "Shipment": 0,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "Cursor": 1
              }
            },
            {
              "input": {
                "Cursor": 0,
                "Grandma": 0,
                "Farm": 0,
                "Mine": 0,
                "Factory": 0,
                "Bank": 0,
                "Temple": 0,
                "Wizard tower": 0,
                "Shipment": 0,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 1
              },
              "output": {
                "cookie": 1
              }
            },
            {
              "input": {
                "Cursor": 0,
                "Grandma": 0,
                "Farm": 0,
                "Mine": 0,
                "Factory": 0,
                "Bank": 0,
                "Temple": 0,
                "Wizard tower": 0,
                "Shipment": 0,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 1
              },
              "output": {
                "upgrade": 1
              }
            },
            {
              "input": {
                "Cursor": 0,
                "Grandma": 0,
                "Farm": 0,
                "Mine": 0,
                "Factory": 0,
                "Bank": 0,
                "Temple": 0,
                "Wizard tower": 0,
                "Shipment": 0,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 1
              },
              "output": {
                "upgrade": 1
              }
            },
            {
              "input": {
                "Cursor": 0,
                "Grandma": 0,
                "Farm": 0,
                "Mine": 0,
                "Factory": 0,
                "Bank": 0,
                "Temple": 0,
                "Wizard tower": 0,
                "Shipment": 0,
                "Alchemy lab": 0,
                "Portal": 0,
                "Time machine": 0,
                "Antimatter condenser": 0,
                "Prism": 0,
                "Chancemaker": 0,
                "Fractal engine": 0,
                "Javascript console": 0,
                "Idleverse": 0,
                "Cortex baker": 0,
                "upgrade": 0
              },
              "output": {
                "cookie": 1
              }
            }
          ]
    }
}let Utils = {
    objects: {
        'cookie': {
            id: 'bigCookie',
            coordinates: {
                x: 0,
                y: 0
            }
        },
        'upgrade': {
            id: 'upgrade0',
            coordinates: {
                x: 0,
                y: 0
            }
        },
        'Cursor': {id: 'product0', coordinates:{x:0, y:0}}, 
        'Grandma': {id: 'product1', coordinates:{x:0, y:0}}, 
        'Farm': {id: 'product2', coordinates:{x:0, y:0}}, 
        'Mine': {id: 'product3', coordinates:{x:0, y:0}}, 
        'Factory': {id: 'product4', coordinates:{x:0, y:0}}, 
        'Bank': {id: 'product5', coordinates:{x:0, y:0}}, 
        'Temple': {id: 'product6', coordinates:{x:0, y:0}}, 
        'Wizard tower': {id: 'product7', coordinates:{x:0, y:0}}, 
        'Shipment': {id: 'product8', coordinates:{x:0, y:0}}, 
        'Alchemy lab': {id: 'product9', coordinates:{x:0, y:0}}, 
        'Portal': {id: 'product10', coordinates:{x:0, y:0}}, 
        'Time machine': {id: 'product11', coordinates:{x:0, y:0}}, 
        'Antimatter condenser': {id: 'product12', coordinates:{x:0, y:0}}, 
        'Prism': {id: 'product13', coordinates:{x:0, y:0}}, 
        'Chancemaker': {id: 'product14', coordinates:{x:0, y:0}}, 
        'Fractal engine': {id: 'product15', coordinates:{x:0, y:0}}, 
        'Javascript console': {id: 'product16', coordinates:{x:0, y:0}}, 
        'Idleverse': {id: 'product17', coordinates:{x:0, y:0}}, 
        'Cortex baker': {id: 'product18', coordinates:{x:0, y:0}}
    },

    initCoordinates: function() {
        let $this = this;
        Object.keys(this.objects).forEach(function(name){
            if ( $this.objects[name].coordinates.x == 0 ) {
                let c = document.querySelector('#' + $this.objects[name].id).getBoundingClientRect();
                $this.objects[name].coordinates.x = c.left;
                $this.objects[name].coordinates.y = c.top;
                if ( name == 'cookie' ) {
                    $this.objects[name].coordinates.x += 48;
                    $this.objects[name].coordinates.y += 48;
                }
            }
        });
    },

    getNodeIdByObjectName: function(name) {
        return this.objects[name].id;
    },

    getObjectCoordinatesByName: function(name) {
        return this.objects[name].coordinates;
    },

    getObjectRandomCoordinatesByName: function(name) {
        let {x, y} = this.objects[name].coordinates;
        let cx = 0, cy = 0;

        if ( x == 0 || y == 0 ) {
            cx = this.randomInt(windowWidth/3, (windowWidth/3)*2);
            cy = this.randomInt(100, windowHeight);
        } else {
            if ( name == 'cookie' ) {
                cx = x + this.randomInt(5, 155);
                cy = y + this.randomInt(5, 155);
            } else if ( name == 'upgrade' ) {
                cx = x + this.randomInt(5, 55);
                cy = y + this.randomInt(5, 55);
            } else {
                cx = x + this.randomInt(5, 295);
                cy = y + this.randomInt(5, 59);
            }
        }

        return {x: cx, y: cy};
    },

    click: function(key) {
        let id = '#' + Utils.getNodeIdByObjectName(key);
        document.querySelector(id).dispatchEvent(new Event('click'));
    },

    getCurrentGameState: function() {
        let state = {};
        Game.ObjectsById.forEach(function(building, id){
            state[building.name] = Game.cookies > building.price ? 1 : 0;
        });
        state['upgrade'] = (Game.UpgradesInStore.length > 0 && Game.cookies > Game.UpgradesInStore[0].getPrice()) ? 1 : 0;
        return state;
    },

    getStateByClickTarget: function(target) {
        let state = {};
    
        if ( target.id == 'bigCookie' ) {
            state['cookie'] = 1;
        } else if ( target.id.indexOf('product') >-1 ) {
            let id = parseInt(target.id.replace('product', ''));
            state[Game.ObjectsById[id].name] = 1;
        } else if ( target.id.indexOf('upgrade') >-1 ) {
            state['upgrade'] = 1;
        } else {
            return false;
        }
    
        return state;
    },

    getBestObjectToClick: function() {
        let state = this.getCurrentGameState(),
            name = 'cookie';
        if ( state['upgrade'] == 1 ) {
            name = 'upgrade';
        } else {
            let highestTier = -1,
                $this = this;
            Object.keys(state).forEach((key)=>{
                if ( state[key] == 1 && $this.objects[key].id.indexOf('product') > -1 ) {
                    const tier = parseInt($this.objects[key].id.replace('product', ''));
                    if ( tier > highestTier ) {
                        highestTier = tier;
                        name = key;
                    }
                }
            });
        }
        return name;
    },

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
};/**
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