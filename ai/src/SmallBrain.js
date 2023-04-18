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

    async shoot(key) {
        const coordinates = Utils.getObjectRandomCoordinatesByName(key);
        let bullet = new Sprite(this.x, this.y, 10);
        this.bullets.push( bullet );
        if ( Utils.getBestObjectToClick() == key ) {
            this.hits++;
        } else {
            this.misses++;
        }

        this.shake = true;
    
        await bullet.moveTo(coordinates, 35);
        bullet.remove();
        this.bullets.shift();
        this.shake = false;
        console.log(this.bullets);
    }

    draw() {
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
        //this.laserSoundHit = loadSound(  window.assetPath + 'sounds/laser-big.mp3');
        //this.laserSoundMiss = loadSound(  window.assetPath + 'sounds/laser-big-miss.mp3');
        //this.textBubble = new this.brainGroup.Sprite(0, 0, 198, 120, 'none');
        //this.textBubble.img = window.assetPath + 'images/brain-bubble.png';


        this.brain.x = x;
        this.brain.y = y;

        return this.brain;
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