class Population {
    smallBrains = [];
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
        let _this = this;
        this.interval = setInterval(function(){
            Utils.initCoordinates(true);
            _this.smallBrains.forEach(function(smallBrain, i){
                _this.smallBrains[i].play();  
                /*setTimeout(()=>{
                    _this.smallBrains[i].play();     
                }, i*40);*/
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
        this.drawStats();
    }

    drawStats() {
        fill('rgba(0, 0, 0, 0.7)');
        rect(0, 0, 360, windowHeight);

        textAlign(LEFT);
        fill(255, 255, 255);
        textSize(24);
        text( 'Small Brain Stats', 40 , windowHeight - 630, 280, 24 );
        textSize(12);
        text( 'Number    Hits      Misses      S      Fitness', 40 , windowHeight - 600, 280, 14 );
        textSize(10);

        this.smallBrains.forEach(function(smallBrain, i){
            if ( smallBrain.generation > 0 ) {
                fill(255, 255, 0);
            } else {
                fill(255, 255, 255);
            }
            let offsetY = windowHeight - 590 + (i*10);
            text( '#'+ (i+1), 40 , offsetY, 280, 14 );
            text( smallBrain.hits + '(' + smallBrain.objectHits + ')', 96 , offsetY, 280, 14 );
            text( smallBrain.misses + '(' + smallBrain.objectMisses + ')', 136 , offsetY, 280, 14 );
            text( smallBrain.generation, 194 , offsetY, 280, 14 );
            text( smallBrain.fitness().toFixed(3), 246 , offsetY, 280, 14 );
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