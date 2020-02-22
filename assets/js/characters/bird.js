class Bird {
  constructor(setup, textureInit) {
    this.setup = setup;
    let resources = setup.loader.resources;

    const run = [];
    const textures = [
      "birdRedHat",
      "birdYellow",
      "birdPink",
      "birdGreenBlack",
      "birdWhiteChick"
    ];
    const texture = textureInit
      ? setup.loader.resources[textureInit].texture.clone()
      : setup.loader.resources[
          textures.getRandomValue(textures)
        ].texture.clone();
    run.push(
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
    texture.frame = run[0];
    this.run = run;
    const pixiObj = new PIXI.Sprite(texture);
    this.texture = texture;
    pixiObj.scale.set(Math.random() * 0.4 + 0.4);

    this.pixiObj = pixiObj;
    this.maxFramesFly = 4;
    this.af = 0;
    this.df = this.maxFramesFly; // images per seconds
    pixiObj.zOrder = 2;
    pixiObj.zIndex = 2;

    this.dead = false;
    this.directions = {
      x: 1,
      y: 1
    };
    this.speed = Math.random() * 3 + 2;
    pixiObj.anchor.x = 0.5;
    pixiObj.anchor.y = 0.5;

    this.setInitialPositionY();
    this.setInitialPositionX();
    pixiObj.interactive = true;
    pixiObj.buttonMode = true;
    pixiObj.on("pointerdown", this.onClick);
  }

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

  fly = () => {
    if (this.dead == false) {
      if (this.pixiObj.x - this.pixiObj.width / 2 >= window.innerWidth) {
        this.directions.x = false;
        this.setInitialPositionY();
        this.pixiObj.scale.x *= -1;
      } else if (
        this.pixiObj.x - this.pixiObj.width / 2 <=
        0 - this.pixiObj.width
      ) {
        this.directions.x = true;
        this.setInitialPositionY();
        this.pixiObj.scale.x *= -1;
      }
      if (this.directions.x) {
        this.pixiObj.x += this.speed;
      } else {
        this.pixiObj.x -= this.speed;
      }

      if (this.af >= this.maxFramesFly) {
        this.af = 0;
      } else {
        this.af += 1 / this.df;
      }
      this.texture.frame = this.run[Math.floor(this.af)];
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
    this.setup.successfulShots += 1;
    this.texture.frame = this.run[8];
    this.flipVertical();
    this.pixiObj.off("pointerdown", this.onClick);

    if (Math.round(Math.random())) {
      const target = new Bird(this.setup);
      this.setup.stage.addChildAt(target.pixiObj, 2);
      this.setup.targets.push(target);
      this.setup.spawnedTargets += 1;
      target._id = this.setup.spawnedTargets;
    }
  };
}

export default Bird;
