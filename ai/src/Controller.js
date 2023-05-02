class Controller {
    screen = 'menu';
    preLoad() {
        BigBrain.preload();
        SmallBrain.preload();
    }

    setup() {
        //this.screen = 'play';
        //this.doPlay();

        //this.screen = 'simulation';
        //this.doSimulation();

        this.screen = 'menu';
        this.doMenu();

        Object.keys(Game.prefs).forEach(function(k){
            Game.prefs[k] = 0;
        });
        Game.Reset();
    }

    draw() {
        if ( this.screen == 'play' ) {
            this.drawPlayers();
        } else if ( this.screen == 'simulation' ) {
            this.drawSimulation();
        }

        if ( this.screen == 'menu' && this.gameButton && this.gameButton.mouse.pressing() ) {
            this.doReset();
            this.gameButton.visible = 0;
            this.trainingButton.visible = 0;
            this.screen = 'play';
            this.doPlay();
        }

        if ( this.screen == 'menu' && this.trainingButton && this.trainingButton.mouse.pressing() ) {
            this.doReset();
            this.gameButton.visible = 0;
            this.trainingButton.visible = 0;
            this.screen = 'simulation';
            this.doSimulation();
        }

        if ( kb.pressing('escape') && this.screen != 'menu' ) {
            this.doReset();
            this.gameButton.visible = 1;
            this.trainingButton.visible = 1;
            this.screen = 'menu';
        }

        if ( this.screen == 'menu' ) {
            fill('rgba(0, 0, 0, 0.7)');
            rect(0, 0, windowWidth, windowHeight);
        }
    }

    doReset() {
        clearInterval(this.n);
        clearInterval(this.gt);
        clearInterval(this.gtt);
        clearInterval(this.gttt);
 
        if ( this.bigBrain ) {
            this.bigBrain.die();
            this.bigBrain = null;
        }

        if ( this.smallBrain ) {
            this.smallBrain.die();
            this.smallBrain = null;
        }
        
        if ( this.population ) {
            this.population.die();
            this.population = null;
        }
    }

    doMenu() {
        this.gameButton = new Sprite(windowWidth/2, windowHeight/2 - 40, 200, 70, 'static');
        this.gameButton.text = "Start Playing";

        this.trainingButton = new Sprite(windowWidth/2, windowHeight/2 + 40, 200, 70, 'static');
        this.trainingButton.text = "AI Training";
    }

    doPlay() {
        this.bigBrain = new BigBrain();
        this.smallBrain = new SmallBrain();
        this.bigBrain.train(Data.MasterMind.training);

        this.bigBrain.spawn(windowWidth/2,windowHeight/2);
        this.smallBrain.spawn(windowWidth/2 - 50,windowHeight/2 + 40);
        
        this.bigBrain.play();
        this.smallBrain.play();
    }

    doSimulation() {
        const populationInterval = 5;
        const generations = 2;

        let _this = this;

        this.bigBrain = new BigBrain();
        this.bigBrain.train(Data.MasterMind.training);
        this.bigBrain.spawn(windowWidth/2,windowHeight/2);

        
        this.population = new Population(50, 0.05, 0.99);
        this.population.spawn();

        let simulate = function( generation = 1 ) {
            _this.bigBrain.play();
            _this.population.play();
        
            _this.gt = setTimeout(()=>{
                _this.population.stop();
                _this.bigBrain.stop();
                if ( generation < generations ) {
                    _this.gtt = setTimeout(()=>{
                        _this.population.reproduce();
                        simulate(generation+1);
                    }, 4000);
                } else {
                    _this.gttt = setTimeout(()=>{
                        _this.bigBrain.speak('Now you all die, except for the Chosen one.');
                        _this.population.removeTheDoomedOnes(_this.bigBrain);

                        setTimeout(()=>{
                            _this.bigBrain.speak('Come here my child!');  
                            _this.population.getTheChosenOne().brain.moveTo(_this.bigBrain.x - 50, _this.bigBrain.y + 40);       
                        }, 20000);
                        setTimeout(()=>{
                            _this.bigBrain.speak('I love you!');     
                        }, 24000);
                        
                    }, 2000);
                }
            }, populationInterval * 1000);
        }

        simulate();
    }

    drawPlayers() {
        this.bigBrain.draw();
        this.smallBrain.draw();
    }

    drawSimulation() {
        this.bigBrain.draw();
        this.population.draw();
    }
}