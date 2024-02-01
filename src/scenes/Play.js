class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);
        //green ui background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00ff00).setOrigin(0,0);
        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xffffff).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xffffff).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xffffff).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xffffff).setOrigin(0,0);

        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)

        //adding 3 spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0,0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 7 + borderPadding * 1, 'spaceship', 0, 10).setOrigin(0,0)
        //adding speeders
        this.speeder01 = new Speeder(this, game.config.width + borderUISize * 7, borderUISize * 3 + borderPadding * 1, 'speeder', 0, 40).setOrigin(0,0)
        this.speeder02 = new Speeder(this, game.config.width, borderUISize * 8 + borderPadding * 2, 'speeder', 0, 15).setOrigin(0,0)
        
        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        //init score
        this.p1Score = 0

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

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig)

        //game over flag
        this.gameOver = false

        //timer
        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        },
        null,
        this
        )

        //timer display
        let timerConfig = {
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
        
        this.timeLeft = this.add.text(borderUISize * 8 + borderPadding * 1, borderUISize + borderPadding * 2, this.clock.elapsed, timerConfig)
        //console.log(this.clock.elapsed)
        //console.log(this.timeLeft)

        //physics colliders
        this.physics.add.collider(this.p1Rocket, this.ship03, this.handleCollision, null, this)
        this.physics.add.collider(this.p1Rocket, this.ship02, this.handleCollision, null, this)
        this.physics.add.collider(this.p1Rocket, this.ship01, this.handleCollision, null, this)
        //physics colliders speeders
        this.physics.add.collider(this.p1Rocket, this.speeder01, this.handleCollision, null, this)
        this.physics.add.collider(this.p1Rocket, this.speeder02, this.handleCollision, null, this)

        //testing
        console.log(this)
    }

    update() {
        //restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }
        //to menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start('menuScene')
        }

        this.starfield.tilePositionX -= 4;
        
        this.timeLeft.text = Math.ceil((game.settings.gameTimer - this.clock.elapsed) / 1000)

        if(!this.gameOver) {
            //rocket update
            this.p1Rocket.update();
            
            //ship updates
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.speeder01.update();
            this.speeder02.update();
        }

        //old non-physics collisions
        /*
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }
        */
    }    

    //old collision checking
    /*
    checkCollision(rocket, ship) {
        //simple aabb checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
            return true
        } else {
            return false
        }
    }
    */

    handleCollision(rocket, ship) {
        rocket.reset()
        this.shipExplode(ship)
    }

    shipExplode(ship) {
        //hide ship for a bit
        ship.alpha = 0
        //test if is ship or speeder?
        //console.log(ship.constructor.name)
        let isSpeeder = 1
        if(ship.constructor.name == 'Speeder') {
            isSpeeder = 0.5
        }
        //create boom
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0).setScale(1, isSpeeder);
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
            ship.reset()
            ship.alpha = 1
            boom.destroy()
        })
        //add time
        this.clock.elapsed -= ship.points * 100
        //score
        console.log(`added ${ship.points} points`)
        console.log(`added ${ship.points/10} second(s)`)
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score

        this.sound.play('sfx-explosion')
    }
}