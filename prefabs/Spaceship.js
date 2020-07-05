//Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue, direction) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.direction = direction;
    }

    update() {

        //move spaceship depending on random direction
        if(this.direction > 5){
            this.x -= game.settings.spaceshipSpeed;
        }else{
            this.x += game.settings.spaceshipSpeed;
        }
        //wraparound from left to right edge
        if(this.x <= 0-this.width && this.direction > 5) {
            this.reset();
        }else if(this.x >= 640 + this.width){
            this.x = 0 - this.width;
        }

    }

    reset() {
        this.x = game.config.width;
    }
}