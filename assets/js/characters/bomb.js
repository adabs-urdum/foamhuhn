class Bomb {
  constructor(setup) {
    setup.debugLog("new Bomb");
    this.setup = setup;
    this.ranDetonation = false;
    this.detonated = false;
    this.speed = Math.random() * 3 + 2;
    this.directions = {
      x: 1,
      y: 1
    };
    this.texture = setup.loader.resources["bomb"].texture.clone();
    this.pixiObj = new PIXI.Sprite(this.texture);
    this.pixiObj.scale.x = 0.5;
    this.pixiObj.scale.y = 0.5;
    this.pixiObj.interactive = true;
    this.pixiObj.click = this.detonate;
    const singleFrameWidth = 197;
    this.frames = [];
    this.maxFrames = 11;
    this.af = 0;
    this.df = 1; // images per seconds
    this.frames.push(
      new PIXI.Rectangle(0, 0, singleFrameWidth, 190),
      new PIXI.Rectangle(singleFrameWidth, 0, singleFrameWidth, 190),
      new PIXI.Rectangle(singleFrameWidth * 2, 0, singleFrameWidth, 190),
      new PIXI.Rectangle(singleFrameWidth * 3, 0, singleFrameWidth, 190),
      new PIXI.Rectangle(singleFrameWidth * 4, 0, singleFrameWidth, 190),
      new PIXI.Rectangle(singleFrameWidth * 5, 0, singleFrameWidth, 190),
      new PIXI.Rectangle(singleFrameWidth * 6, 0, singleFrameWidth, 190),
      new PIXI.Rectangle(singleFrameWidth * 7, 0, singleFrameWidth, 190),
      new PIXI.Rectangle(singleFrameWidth * 8, 0, singleFrameWidth, 190),
      new PIXI.Rectangle(singleFrameWidth * 9, 0, singleFrameWidth, 190),
      new PIXI.Rectangle(singleFrameWidth * 10, 0, singleFrameWidth, 190),
      new PIXI.Rectangle(singleFrameWidth * 11, 0, singleFrameWidth, 190)
    );
    this.texture.frame = this.frames[0];
    this.setInitialPositionY();
    this.setInitialPositionX();
  }

  detonate = () => {
    this.detonated = true;
    if (this.af >= this.maxFrames) {
      if (this.ranDetonation == false) {
        this.pixiObj.alpha = 0;
        this.setup.lifes -= 1;
        this.ranDetonation = true;
      }
      return;
    } else {
      this.af += 1 / this.df;
      this.texture.frame = this.frames[Math.floor(this.af)];
    }
  };

  flipHorizontal = () => {
    this.pixiObj.scale.x *= -1;
  };

  flipVertical = () => {
    this.pixiObj.scale.y *= -1;
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
    if (this.detonated == false) {
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
      this.texture.frame = this.frames[0];
    } else {
      this.detonate();
    }
  };
}

export default Bomb;
