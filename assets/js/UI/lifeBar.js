class lifeBar {
  constructor(setup) {
    setup.debugLog("new lifeBar");
    this.setup = setup;
    this.mobileFactor = window.innerWidth <= 768 ? 2 : 1;
    this.hearts = [];
    this.frames = [];
    this.frames.push(
      new PIXI.Rectangle(0, 0, 150 / 2, 64),
      new PIXI.Rectangle(150 / 2, 0, 150 / 2, 64)
    );
    this.reDrawHearts();
    this.bindEvents();
  }

  bindEvents = () => {
    window.addEventListener("resize", this.onWindowResize);
  };

  onWindowResize = () => {
    this.mobileFactor = window.innerWidth <= 768 ? 2 : 1;

    this.hearts.map((heart, index) => {
      this.setHeartPosition(index, heart);
    });
  };

  reDrawHearts = () => {
    this.hearts = [];
    for (let index = 0; index < this.setup.totalLifes; index++) {
      this.addHeart(index);
    }
  };

  setHeartPosition = (index, heart) => {
    heart.scale.set((window.innerWidth / 100) * 0.03 * this.mobileFactor);
    heart.y = heart.height;
    heart.x =
      window.innerWidth -
      this.setup.BS * 40 -
      heart.width * (index + 1) -
      (index + 1) * this.setup.BS * 20;
    this.setup.bringToFront(heart);
  };

  addHeart = index => {
    this.heartTexture = this.setup.loader.resources["heart"].texture.clone();
    this.heartTexture.frame =
      this.setup.lifes > index ? this.frames[1] : this.frames[0];

    const heart = new PIXI.Sprite(this.heartTexture);
    heart._id = index;
    heart.anchor.x = 0;
    heart.anchor.y = 0;
    this.setup.stage.addChildAt(heart, 1);
    this.hearts.push(heart);
    this.setHeartPosition(index, heart);
  };

  update = () => {
    this.hearts.map(heart => {
      this.setup.bringToFront(heart);
      const position = heart._id + 1;

      if (position > this.setup.lifes) {
        heart.texture.frame = this.frames[0];
      } else {
        heart.texture.frame = this.frames[1];
      }
    });

    if (this.setup.lifes <= 0) {
      this.setup.debugLog("dead – 0 lifes left");
      this.setup.debugLog("---");
      this.setup.currentStageChanged = true;
      this.setup.currentStageId = "start";
    }
  };
}

export default lifeBar;
