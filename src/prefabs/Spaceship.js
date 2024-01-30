//spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)    //add to existing scene
        this.points = pointValue    // store point value
        this.moveSpeed = game.settings.spaceshipSpeed          //movement speed in pixels/frame
    }

    update() {
        //move left
        this.x -= this.moveSpeed

        //wrap around form left to right
        if(this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }

    reset () {
        this.x = game.config.width
    }
}