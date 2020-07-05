class Menu extends Phaser.Scene {

    constructor() {
        super("menuScene");
    }

    preload() {

        //load audio
        this.load.audio('sfx_select', './assets/gun_cocking.mp3');//sound from zapsplat.com
        this.load.audio('sfx_explosion', './assets/duck_quack.mp3');//sound from zapsplat.com
        this.load.audio('sfx_rocket', './assets/dog_bark.mp3');//sound from zapsplat.com


    }

    create() {
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0

        }

        //show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.add.text(centerX, centerY - textSpacer, 'DUCK! PATROL', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, 'Use arrows to move and (F) to Fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(centerX, centerY + textSpacer, 'Press <- for easy and -> for Hard', menuConfig).setOrigin(0.5);
        
        //define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // this.add.text(20, 20, "Rocket Patrol Menu");
        // this.scene.start("playScene");
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            //easyMode
            game.settings.spaceshipSpeed =3;
            game.settings.gameTimer = 60_000;
            
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            //hard mode
            game.settings.spaceshipSpeed = 4;
            game.settings.gameTimer = 45_000;
            this.sound.play('sfx_select');
            this.scene.start("playScene")
        }

    }

}