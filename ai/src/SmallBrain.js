class SmallBrain {
    hits = 0;
    misses = 0;
    bullets = [];
    shake = false;

    constructor( cookieClickChance = 0.5 ) {
        this.cookieClickChance = cookieClickChance;
    }

    play() {
        const rand = Math.random();
        let key;
        if ( rand < this.cookieClickChance ) {
            key = 'cookie';
        } else {
            key = Utils.getRandomObjectKey();
        }
        Utils.click(key);
        this.shoot(key);
    }

    fitness() {
        return this.hits / (this.hits + this.misses);
    }

    crossover( partner ) {
        return new SmallBrain(
            (partner.cookieClickChance + this.cookieClickChance) / 2
        );
    }

    async shoot(key) {
        const coordinates = Utils.getObjectRandomCoordinatesByName(key);
        let bullet = new Sprite(this.x, this.y, 10, 'kinematic'),
            hit = Utils.getBestObjectToClick() == key;
        bullet.color = 'red';
        this.bullets.push( bullet );
        this.shot.play();

        if ( hit ) {
            this.hits++;
        } else {
            this.misses++;
        }

        this.shake = true;
        await bullet.moveTo(coordinates, 35);
        this.bulletHole(coordinates);
        if ( !hit ) {
            this.ricochet.play();
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

    spawn(x, y) {
        this.x = x;
        this.y = y;
        this.brain = new Sprite(0, 0, 64, 64, 'none');
        this.veins = loadAnimation(  window.assetPath + 'images/small-brain-sprite-x2.png', { frameSize: [64, 64], frames: 10 });
        this.brain.addAni(this.veins,  window.assetPath + 'images/brain-sprite-x2.png', 10);
        this.shot = loadSound(  window.assetPath + 'sounds/shot.mp3');
        this.ricochet = loadSound(  window.assetPath + 'sounds/ricochet.mp3');
        //this.laserSoundMiss = loadSound(  window.assetPath + 'sounds/laser-big-miss.mp3');
        //this.textBubble = new this.brainGroup.Sprite(0, 0, 198, 120, 'none');
        //this.textBubble.img = window.assetPath + 'images/brain-bubble.png';


        this.brain.x = x;
        this.brain.y = y;

        return this.brain;
    }

    die() {
        this.brain.remove();
        this.veins.remove();
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