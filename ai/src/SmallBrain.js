class SmallBrain {
    hits = 0;
    misses = 0;
    objectHits = 0;
    objectMisses = 0;
    bullets = [];
    shake = false;
    animationKey = 0;
    generation = 0;

    constructor( cookieClickChance = 0.5, training = false ) {
        this.cookieClickChance = cookieClickChance;
        this.training = training;
    }

    play() {
        const rand = Math.random();
        let key;
        if ( rand < this.cookieClickChance ) {
            key = 'cookie';
        } else {
            key = Utils.getRandomObjectKey();
        }
        if ( !this.training ) {
            Utils.click(key);
        }
        this.shoot(key);
    }

    fitness() {
        if ( (this.hits + this.misses + this.objectHits*1000 + this.objectMisses*1000) > 0 ) {
            return (this.hits + (this.objectHits*1000) ) / (this.hits + this.misses + this.objectHits*1000 + this.objectMisses*1000);
        } else {
            return 0;
        }
    }

    crossover( partner ) {
        return new SmallBrain(
            (partner.cookieClickChance + this.cookieClickChance) / 2,
            this.training
        );
    }

    async shoot(key) {
        const coordinates = Utils.getObjectRandomCoordinatesByName(key);
        let bullet = new Sprite(this.x, this.y, 10, 'kinematic'),
            hit = Utils.getBestObjectToClick() == key;
        bullet.color = 'red';
        this.bullets.push( bullet );

        if ( !this.training ) {
            SmallBrain.shot.play();
        }

        if ( hit ) {
            if ( key != 'cookie' ) {
                this.objectHits++;
            } else {
                this.hits++;
            }
        } else {
            if ( key == 'cookie' ) {
                this.objectMisses++;
            } else {
                this.misses++;
            }
        }

        this.shake = true;
        await bullet.moveTo(coordinates, 35);
        this.bulletHole(coordinates);
        if ( !hit && !this.training ) {
            SmallBrain.ricochet.play();
        }
        bullet.remove();
        this.bullets.shift();
        this.shake = false;
    }

    bulletHole(coordinates) {
        let hole = new Sprite(coordinates.x, coordinates.y, 12, 'kinematic');
        hole.d = 14;
        hole.color = 'rgba(0,0,0,1)';
        setTimeout(function(){
            hole.color = 'rgba(0,0,0,0.5)';
        }, 500);
        setTimeout(function(){
            hole.color = 'rgba(0,0,0,0.2)';
        }, 750);
        setTimeout(function(){
            hole.remove();
        }, 1000);
    }

    draw() {
        strokeWeight(0);
        this.bullets.forEach((bullet)=>{
            bullet.draw();
        });
        this.brain.draw();
        this.startShake();
    }

    static preload() {
        SmallBrain.shot = loadSound(  window.assetPath + 'sounds/shot.mp3');
        SmallBrain.ricochet = loadSound(  window.assetPath + 'sounds/ricochet.mp3');

        SmallBrain.ani = [];
        for (var i=0; i<100; ++i) {
            let ani = loadAnimation(  window.assetPath + 'images/small-brain-sprite-x2.png', { frameSize: [64, 64], frames: 10 });
            SmallBrain.ani.push({
                'ani': ani,
                'inUse': false
            });
        }
        //SmallBrain.ani = loadAnimation(  window.assetPath + 'images/small-brain-sprite-x2.png', { frameSize: [64, 64], frames: 10 });
    }

    spawn(x, y) {
        this.x = x;
        this.y = y;
        this.brain = new Sprite(0, 0, 64, 64, 'none');
        this.brain.layer = 1;
        //let ani = { ...SmallBrain.beat };
        //let ani = loadAnimation(  window.assetPath + 'images/small-brain-sprite-x2.png', { frameSize: [64, 64], frames: 10 });
        for (var i=0; i<100; ++i) {
            if ( !SmallBrain.ani[i].inUse ) {
                this.brain.addAni(SmallBrain.ani[i].ani);
                SmallBrain.ani[i].ani.frame = Utils.randomInt(1, 9);
                SmallBrain.ani[i].inUse = true;
                this.animationKey = i;
                break;
            }
        }
        //this.brain.addAni(SmallBrain.ani);
        //this.laserSoundMiss = loadSound(  window.assetPath + 'sounds/laser-big-miss.mp3');
        //this.textBubble = new this.brainGroup.Sprite(0, 0, 198, 120, 'none');
        //this.textBubble.img = window.assetPath + 'images/brain-bubble.png';


        this.brain.x = x;
        this.brain.y = y;

        return this.brain;
    }

    die() {
        SmallBrain.ani[this.animationKey].inUse = false;
        this.brain.remove();
    }

    async startShake() {
        if ( this.shake ) {
            let nx = Utils.randomInt(this.x-2, this.x+2),
                ny = Utils.randomInt(this.y-2, this.y+2);
            await this.brain.moveTo(nx, ny, 20);
            this.startShake();
        }
    }
}