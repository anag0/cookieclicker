class Controller {
    screen = 'menu';
    preLoad() {
        BigBrain.preload();
        SmallBrain.preload();
    }

    setup() {
        //this.screen = 'play';
        //this.doPlay();

        this.screen = 'simulation';
        this.doSimulation();
    }

    draw() {
        if ( this.screen == 'play' ) {
            this.drawPlayers();
        } else if ( this.screen == 'simulation' ) {
            this.drawSimulation();
        }
    }

    doMenu() {

    }

    doPlay() {
        let _this = this;
        this.bigBrain = new BigBrain();
        this.smallBrain = new SmallBrain();
        this.bigBrain.train(Data.MasterMind.training);

        this.bigBrain.spawn(windowWidth/2,windowHeight/2);
        this.smallBrain.spawn(windowWidth/2 - 50,windowHeight/2 + 40);
        
        this.n = setInterval(function(){
            Utils.initCoordinates();
            _this.bigBrain.play();
            _this.smallBrain.play();
        }, 200);
    }

    doSimulation() {
        let _this = this;
        this.population = new Population(100, 0.05, 0.99);
        const generations = 10;

        this.population.spawn();
        this.population.play();

        for (let generation=1; generation<=generations; ++generation) {
            setTimeout(()=>{
                _this.population.stop();
                _this.population.reproduce();
                setTimeout(()=>{
                    this.pn = setInterval(function(){
                        _this.population.play();
                    }, 200);
                }, 1000);
            }, 5000 * generation);
        }
    }

    drawPlayers() {
        this.bigBrain.draw();
        this.smallBrain.draw();
    }

    drawSimulation() {
        this.population.draw();
    }
}