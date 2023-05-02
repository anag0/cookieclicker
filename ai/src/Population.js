class Population {
    smallBrains = [];
    generation = 1;

    constructor(size, startingPoint = 0.05, endPoint = 0.95) {
        let step = (endPoint - startingPoint) / size;
        for(let i=0; i<size; ++i) {
            this.smallBrains.push(new SmallBrain(startingPoint + i * step, true));
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

    play( interval = 200 ) {
        this.smallBrains.forEach(function(smallBrain){
            smallBrain.play(interval);  
        });
    }

    stop() {
        this.smallBrains.forEach(function(smallBrain){
            smallBrain.stop();  
        });
    }

    die() {
        this.stop();
        this.smallBrains.forEach(function(smallBrain, i){
            smallBrain.die();
        });
    }

    draw() {
        this.smallBrains.forEach(function(smallBrain){
            smallBrain.draw();
        });
        this.drawStats();
    }

    drawStats() {
        let _this = this;

        fill('rgba(0, 0, 0, 0.7)');
        rect(0, 0, 360, windowHeight);

        textAlign(LEFT);
        fill(255, 255, 255);
        textSize(24);
        text( 'Generation: ' + this.generation, 40 , windowHeight - 660, 320, 24 );
        text( 'Population Stats', 40 , windowHeight - 630, 320, 24 );
        textSize(12);
        text( 'Number    Hits      Misses      S      Fitness    Parameter', 40 , windowHeight - 600, 320, 14 );
        textSize(10);

        this.smallBrains.forEach(function(smallBrain, i){
            if ( smallBrain.generation > 0 ) {
                fill(255, 255, 0);
            } else {
                fill(255, 255, 255);
            }

            if ( i == _this.getFittest() ) {
                fill(255, 0, 0);
            }

            let offsetY = windowHeight - 590 + (i*10);
            text( '#'+ (i+1), 40 , offsetY, 280, 14 );
            text( smallBrain.hits + '(' + smallBrain.objectHits + ')', 96 , offsetY, 280, 14 );
            text( smallBrain.misses + '(' + smallBrain.objectMisses + ')', 136 , offsetY, 280, 14 );
            text( smallBrain.generation, 194 , offsetY, 280, 14 );
            text( smallBrain.fitness().toFixed(3), 222 , offsetY, 280, 14 );
            text( smallBrain.cookieClickChance.toFixed(3), 274 , offsetY, 280, 14 );
        });
    }

    reproduce() {
        let bestBrain = 0,
            bestFitness = 0,
            averageFittness = 0,
            survivors = [];

        // Get the best and calculate avarege    
        this.smallBrains.forEach(function(smallBrain, n){
            averageFittness += smallBrain.fitness(); 
            if ( smallBrain.fitness() > bestFitness ) {
                bestFitness = smallBrain.fitness();
                bestBrain = n;
            }
        });
        averageFittness = averageFittness / this.smallBrains.length;

        // Get the survivors
        this.smallBrains.forEach(function(smallBrain, n){
            if ( smallBrain.fitness() > averageFittness ) {
                survivors.push(n);
            }
        });

        //console.log('best brain', bestBrain);

        for ( let i=0; i<this.smallBrains.length; i++ ) {
            if ( i != bestBrain && survivors.indexOf(i) == -1 ) {
                let randomBrain = Utils.randomInt(0, this.smallBrains.length-1);
                while ( randomBrain == i ) {
                    randomBrain = Utils.randomInt(0, this.smallBrains.length-1);
                }
                let child = this.smallBrains[i].crossover(this.smallBrains[randomBrain]);
                let {x, y} = this.getNewBrainCoordinates();
                child.spawn(x, y);
                this.smallBrains[i].die();
                this.smallBrains[i] = child;
            } else {
                ++this.smallBrains[i].generation;
            }
        }

        this.generation++;
    }

    getTheChosenOne() {
        let bestFitness = 0, bestBrain;

        this.smallBrains.forEach(function(smallBrain, n){
            if ( smallBrain.fitness() > bestFitness ) {
                bestFitness = smallBrain.fitness();
                bestBrain = smallBrain;
            }
        });

        return bestBrain;
    }

    getFittest() {
        let bestFitness = 0, bestBrain = 0;

        this.smallBrains.forEach(function(smallBrain, n){
            if ( smallBrain.fitness() > bestFitness ) {
                bestFitness = smallBrain.fitness();
                bestBrain = n;
            }
        });

        return bestBrain;
    }

    removeTheDoomedOnes( bigBrain ) {
        let _this = this;
        this.smallBrains.forEach(function(smallBrain, i){
            setTimeout(function(){
                if ( _this.smallBrains.length > 1 ) {
                    let n = 0;
                    while ( n == _this.getFittest() ) {
                        n++;
                    }
                    bigBrain.shootAt(smallBrain.x, smallBrain.y);
                    _this.smallBrains[n].die();     
                    _this.smallBrains.splice(n, 1);
                }
            }, 400 * i);
        });
    }

    getNewBrainCoordinates() {
        const topY = 50,
            bottomY = windowHeight-50,
            leftX = windowWidth / 3,
            rightX = leftX * 2;
        let x = Utils.randomInt(leftX, rightX),
            y = Utils.randomInt(topY, bottomY); 
        while(this.isCloseToCenter(x, y)) {
            x = Utils.randomInt(leftX, rightX);
            y = Utils.randomInt(topY, bottomY); 
        }

        return {'x': x, 'y': y};
    }

    isCloseToCenter(x, y) {
        let a = x - windowWidth / 2,
            b = y - windowHeight / 2;
        return Math.sqrt( a*a + b*b ) < 250;
    }
}