class Bird {
  constructor(setup, textureInit) {
    setup.debugLog("new Bird");
    this.setup = setup;
    let resources = setup.loader.resources;

    this.frames = [];

    const textures = [
      "birdRedHat",
      "birdYellow",
      "birdPink",
      "birdGreenBlack",
      "birdWhiteChick"
    ];
    this.textureInit = textureInit
      ? textureInit
      : textures.getRandomValue(textures);
    this.texturesSetup = {
      birdRedHat: {
        speed: 7
      },
      birdYellow: {
        speed: 1
      },
      birdPink: {
        speed: 2
      },
      birdGreenBlack: {
        speed: 3
      },
      birdPinkStripes: {
        speed: 4
      },
      birdBlueHat: {
        speed: 5
      },
      birdPunk: {
        speed: 6
      },
      birdBlue: {
        speed: 8
      },
      birdWhiteChick: {
        speed: 10
      }
    };

    this.addBird();
    this.bindEvents();
  }

  bindEvents = () => {
    window.addEventListener("resize", this.onWindowResize);
  };

  onWindowResize = e => {
    this.setBirdScale();
    this.setBirdSpeed();
  };

  setBirdScale = () => {
    if (window.innerWidth <= 768) {
      this.pixiObj.scale.set(
        Math.random() * 0.1 + (window.innerWidth / 1000) * 1.1
      );
    } else {
      this.pixiObj.scale.set(
        Math.random() * 0.4 + (window.innerWidth / 1000) * 0.25
      );
    }
  };

  setBirdSpeed = () => {
    let speedFactor = 3 * this.setup.BS;
    if (window.innerWidth <= 768) {
      speedFactor = 0.35 * this.setup.BS;
    }

    this.speed = this.texturesSetup[this.textureInit]
      ? Math.random() * speedFactor + this.texturesSetup[this.textureInit].speed
      : this.texturesSetup[this.textureInit].speed;
  };

  addBird = () => {
    this.texture = this.setup.loader.resources[
      this.textureInit
    ].texture.clone();
    this.texture.name = this.textureInit;

    this.frames.push(
      new PIXI.Rectangle(0, 0, 233, 185),
      new PIXI.Rectangle(233, 0, 233, 185),
      new PIXI.Rectangle(466, 0, 233, 185),
      new PIXI.Rectangle(0, 185, 233, 185),
      new PIXI.Rectangle(233, 185, 233, 185),
      new PIXI.Rectangle(466, 185, 233, 185),
      new PIXI.Rectangle(0, 370, 233, 185),
      new PIXI.Rectangle(233, 370, 233, 185),
      new PIXI.Rectangle(466, 370, 233, 185)
    );
    this.texture.frame = this.frames[0];
    const pixiObj = new PIXI.Sprite(this.texture);

    this.maxFramesFly = 4;
    this.af = 0;
    this.df = this.maxFramesFly; // images per seconds

    this.dead = false;
    this.directions = {
      x: 1,
      y: 1
    };

    this.setBirdSpeed();

    pixiObj.anchor.x = 0.5;
    pixiObj.anchor.y = 0.5;

    pixiObj.interactive = true;
    pixiObj.click = this.onClick;
    pixiObj.tap = this.onClick;

    this.pixiObj = pixiObj;

    this.setBirdScale();
    this.setInitialPositionY();
    this.setInitialPositionX();
  };

  setInitialPositionY = () => {
    this.pixiObj.y =
      (window.innerHeight - window.innerHeight * 0.4) * Math.random() +
      this.pixiObj.height / 2;
  };

  setInitialPositionX = () => {
    if (Math.round(Math.random())) {
      this.pixiObj.x = this.pixiObj.width / -2;
      this.flipHorizontal();
    } else {
      this.pixiObj.x = window.innerWidth + this.pixiObj.width / 2;
    }
  };

  update = () => {
    if (this.dead == false) {
      if (this.pixiObj.x - this.pixiObj.width / 2 >= window.innerWidth) {
        this.directions.x = false;
        this.setInitialPositionY();
      } else if (
        this.pixiObj.x - this.pixiObj.width / 2 <=
        0 - this.pixiObj.width
      ) {
        this.directions.x = true;
        this.setInitialPositionY();
      }
      if (this.directions.x) {
        this.pixiObj.scale.x = this.pixiObj.scale.y;
        this.pixiObj.x += this.speed;
      } else {
        this.pixiObj.scale.x = this.pixiObj.scale.y * -1;
        this.pixiObj.x -= this.speed;
      }

      if (this.af >= this.maxFramesFly) {
        this.af = 0;
      } else {
        this.af += 1 / this.df;
      }
      this.texture.frame = this.frames[Math.floor(this.af)];
    } else {
      if (this.pixiObj.y <= window.innerHeight) {
        this.pixiObj.y += this.setup.gravity;
      } else {
        this.setup.stage.removeChild(this.pixiObj);
        this.setup.targets = this.setup.targets.filter(target => {
          if (target._id != this._id) {
            return target;
          }
        });
      }
    }
  };

  flipHorizontal = () => {
    this.pixiObj.scale.x *= -1;
  };

  flipVertical = () => {
    this.pixiObj.scale.y *= -1;
  };

  onClick = e => {
    this.dead = true;
    this.setup.targetDown.push(this.pixiObj);
    this.texture.frame = this.frames[8];
    this.flipVertical();
    this.pixiObj.off("pointerdown", this.onClick);
  };
}

export default Bird;
