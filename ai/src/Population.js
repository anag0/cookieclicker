class Population {
    smallBrains = [];
    constructor(size, startingPoint = 0.05, endPoint = 0.95) {
        let step = (endPoint - startingPoint) / size;
        for(let i=0; i<size; ++i) {
            this.smallBrains.push(new SmallBrain(startingPoint + i * step));
        }
    }

    spawn() {
        let _this = this;
        this.smallBrains.forEach(function(smallBrain){
            let {x, y} = _this.getNewBrainCoordinates();
            console.log(x, y);
            smallBrain.spawn(x, y);
        });  
    }

    play( interval = 500 ) {
        let _this = this;
        this.interval = setInterval(function(){
            Utils.initCoordinates(true);
            _this.smallBrains.forEach(function(smallBrain, i){
                setTimeout(()=>{
                    smallBrain.play();     
                }, i*4);
            });
        }, interval);
    }

    stop() {
        clearInterval(this.interval);
    }

    draw() {
        this.smallBrains.forEach(function(smallBrain){
            smallBrain.draw();
        });
    }

    reproduce() {
        let bestBrain = 0,
            bestFitness = 0;

        this.smallBrains.forEach(function(smallBrain, i){
            if ( smallBrain.fitness() > bestFitness ) {
                bestFitness = smallBrain.fitness();
                bestBrain = i;
            }
        });

        for ( let i=0; i<this.smallBrains.length; i++ ) {
            if ( i != bestBrain ) {
                let randomBrain = Utils.randomInt(0, this.smallBrains.length-1);
                while ( randomBrain == bestBrain || randomBrain == i ) {
                    randomBrain = Utils.randomInt(0, this.smallBrains.length-1);
                }
                let child = this.smallBrains[i].crossover(this.smallBrains[randomBrain]);
                let {x, y} = this.getNewBrainCoordinates();
                child.spawn(x, y);
                this.smallBrains[i].die();
                this.smallBrains[i] = child;
            }
        }
    }

    getNewBrainCoordinates() {
        const topY = 50,
            bottomY = windowHeight-50,
            leftX = windowWidth / 3,
            rightX = leftX * 2;
        let x = Utils.randomInt(leftX, rightX),
            y = Utils.randomInt(topY, bottomY); 
        /*while(this.isBrainClose(x, y)) {
            x = Utils.randomInt(leftX, rightX);
            y = Utils.randomInt(topY, bottomY); 
        }  */

        return {'x': x, 'y': y};
    }

    isBrainClose(x, y) {
        let close = false;
        this.smallBrains.forEach( function(smallBrain){
            if ( Math.abs(smallBrain.x - x) < 20 || Math.abs(smallBrain.y - y) < 20 ) {
                close = true;
            }
        });
        return close;
    }
}