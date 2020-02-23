class lifeBar {
  constructor(setup) {
    setup.debugLog("new lifeBar");
    this.setup = setup;
    this.hearts = [];
    this.frames = [];
    this.frames.push(
      new PIXI.Rectangle(0, 0, 150 / 2, 64),
      new PIXI.Rectangle(150 / 2, 0, 150 / 2, 64)
    );
    for (let index = 0; index < setup.totalLifes; index++) {
      this.addHeart(index);
    }
  }

  addHeart = index => {
    this.heartTexture = this.setup.loader.resources["heart"].texture.clone();
    this.heartTexture.frame =
      this.setup.lifes > index ? this.frames[1] : this.frames[0];

    const heart = new PIXI.Sprite(this.heartTexture);
    heart._id = index;
    heart.anchor.x = 0.5;
    heart.anchor.y = 1;
    heart.position.y = (window.innerHeight / 8) * 7.4;
    heart.position.x =
      window.innerWidth / 12 + heart.width * index + index * 20;
    this.setup.stage.addChildAt(heart, 0);
    this.hearts.push(heart);
    this.setup.bringToFront(heart);
  };

  update = () => {
    if (this.setup.lifes <= 0) {
      return;
    }
    this.hearts.map(heart => {
      const position = heart._id + 1;

      if (position > this.setup.lifes) {
        heart.texture.frame = this.frames[0];
      } else {
        heart.texture.frame = this.frames[1];
      }
    });
  };
}

export default lifeBar;
