import Bird from "../characters/bird.js";

class Level {
  constructor(setup, config) {
    this.config = config;
    this.setup = setup;
    console.log("constructing Level");
    console.log(config);

    for (let i = 0; i < config.initialTargetAmount; i++) {
      setup.targets.push(
        new Bird(setup, config.targetTypes.getRandomValue(config.targetTypes))
      );
    }

    setup.targets.map(target => {
      setup.spawnedTargets += 1;
      target._id = setup.spawnedTargets;
      setup.stage.addChildAt(target.pixiObj, 1);
    });

    this.showLevelMessage();

    this.spawnInterval = null;
    if (config.spawnNew) {
      this.startSpawnInterval();
    }
  }

  showLevelMessage = () => {
    console.log("showLevelMessage");
    this.levelMessage = new PIXI.Text(this.config.instructionsText, {
      fontFamily: this.setup.fontFamily,
      fontSize: 150 * this.setup.BS,
      fill: 0x000000
    });
    this.levelMessage.anchor.set(0.5);
    this.levelMessage.position.x = window.innerWidth / 2;
    this.levelMessage.position.y = window.innerHeight / 3;
    this.setup.stage.addChildAt(this.levelMessage, 7);
    setTimeout(() => {
      this.levelMessage.alpha = 0;
      this.addScoreBoard();
    }, this.setup.messageDuration);
  };

  startSpawnInterval = () => {
    this.spawnInterval = setInterval(() => {
      const target = new Bird(
        this.setup,
        this.config.targetTypes.getRandomValue(this.config.targetTypes)
      );
      this.setup.stage.addChildAt(
        target.pixiObj,
        this.config.initialTargetAmount
      );
      this.setup.spawnedTargets += 1;
      target._id = this.setup.spawnedTargets;
      this.setup.targets.push(target);
    }, 2000);
    this.setup.spawnInterval = this.spawnInterval;
  };

  stopSpawnInterval = () => {
    this.spawnInterval = clearInterval(this.spawnInterval);
    this.setup.spawnInterval = this.spawnInterval;
  };

  addScoreBoard = () => {
    let flying = new PIXI.Text(this.setup.targets.length, {
      fontFamily: this.setup.fontFamily,
      fontSize: 200,
      fill: 0xffffff,
      align: "center"
    });
    flying.anchor.set(0.5);
    flying.position.set(window.innerWidth / 2, window.innerHeight / 4);

    this.setup.stage.addChildAt(flying, 1);

    this.setup.scoreboard["flying"] = flying;
  };

  updateScoreBoard = () => {
    this.setup.scoreboard.flying.text = this.setup.targets.length;
    this.setup.scoreboard.flying.position.set(
      window.innerWidth / 2,
      window.innerHeight / 4
    );
    if (!this.setup.targets.length) {
      clearInterval(this.spawnInterval);
      this.setup.scoreboard.flying.text = "YOU WIN";
      this.setup.scoreboard.flying.style.fontSize = 150;
    }
  };
}

export default Level;
