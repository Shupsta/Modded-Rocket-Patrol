class Play extends Phaser.Scene {

    constructor() {
        super("playScene");
    }

    preload() {
        //load images/tile sprites
        this.load.image('rocket', './assets/dog.png');
        this.load.image('duck_flip', './assets/duck_flip.png');
        this.load.image('spaceship', './assets/duck.png');
        this.load.image('background_mountains', './assets/background_mountains.png');
        this.load.image('background_trees', './assets/background_trees.png');
        this.load.image('top_bar', './assets/top_bar.png');
        this.load.image('bottom_bar', './assets/bottom_bar.png');
        this.load.image('side_bar', './assets/side_bars.png');
        this.load.spritesheet('explosion', './assets/explosion_duck.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame:9});
    }

    create() {
        //place tile sprite
        this.background_mountains = this.add.tileSprite(0, 0, 640, 480, 'background_mountains').setOrigin(0, 0);
        this.background_trees = this.add.tileSprite(0, 0, 640, 480, 'background_trees').setOrigin(0, 0);
        //place white rectangle boarder
        // this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.top_bar = this.add.sprite(5, 5, 'top_bar').setOrigin(0, 0);//adds top bar
        // this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.bottom_bar = this.add.sprite(5, 443, 'bottom_bar').setOrigin(0, 0);//adds bottom bar
        // this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.left_bar = this.add.sprite(5, 5, 'side_bar').setOrigin(0, 0);//adds left bar
        // this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.right_bar = this.add.sprite(603, 5, 'side_bar').setOrigin(0, 0);//adds right bar
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);
        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2 - 8, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);
        //add spaceships (x3)
        if((Math.random() * 10) > 5){
            this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30, 6).setOrigin(0, 0);
        }else{
            this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'duck_flip', 0, 30, 4).setOrigin(0, 0);
        }

        if((Math.random() * 10) > 5){
            this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20, 6).setOrigin(0, 0);
        }else{
            this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'duck_flip', 0, 20, 4).setOrigin(0, 0);
        }

        if((Math.random() * 10) > 5){
            this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10, 6).setOrigin(0, 0);
        }else{
            this.ship03 = new Spaceship(this, game.config.width, 260, 'duck_flip', 0, 10, 4).setOrigin(0, 0);
        }



        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        //score
        this.p1Score = 0;
        //score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100

        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        
        //game over flag
        this.gameOver = false;
        
        //60 second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () =>{
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        
    }

    update() {
        //check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)){
            this.scene.restart(this.p1Score);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.scene.start("menuScene");
        }
        if(!this.gameOver){
        this.background_mountains.tilePositionX -= 1;
        this.background_trees.tilePositionX -= 3;
        this.p1Rocket.update();
        this.ship01.update();
        this.ship02.update();
        this.ship03.update();
    }
        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
           this.p1Rocket.collisionReset();
           this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.collisionReset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.collisionReset();
            this.shipExplode(this.ship01);
        }

    }

    checkCollision(rocket, ship) {
        //simple AABB (Axis-Aligned Bounding Boxes)checking
        if(rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
            }else {
                return false;
            }
    }

    shipExplode(ship) {
        ship.alpha = 0 //hides the ship
        //create explosion sprite at ships position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode'); //plays explosion animation
        boom.on('animationcomplete', () => { //callback after animation completes
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        //score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }

}