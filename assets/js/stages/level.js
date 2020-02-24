import Bird from "../characters/bird.js";
import Bomb from "../characters/bomb.js";
import Button from "../UI/button.js";

class Level {
  constructor(setup, config) {
    this.config = config;
    this.setup = setup;
    this.levelEnded = false;
    setup.debugLog("---");
    setup.debugLog("new Level");
    setup.debugLog(setup.currentStageId);

    for (let i = 0; i < config.initialTargetAmount; i++) {
      setup.targets.push(
        new Bird(setup, config.targetTypes.getRandomValue(config.targetTypes))
      );
    }

    if (config.bombs) {
      for (let index = 0; index < config.bombs; index++) {
        setup.bombs.push(new Bomb(setup));
      }
    }

    setup.targets.map(target => {
      setup.spawnedTargets += 1;
      target._id = setup.spawnedTargets;
      setup.stage.addChildAt(target.pixiObj, 1);
    });

    setup.bombs.map(target => {
      setup.stage.addChildAt(target.pixiObj, 1);
    });

    this.showLevelMessage();
    this.showLevelInstructions();
    this.addScoreBoard();

    this.spawnInterval = null;
    if (config.spawnNew) {
      this.startSpawnInterval();
    }
  }

  showLevelInstructions = () => {
    this.levelInstructions = new PIXI.Text(this.config.instructionsText, {
      fontFamily: this.setup.fontFamily,
      fontSize: 80 * this.setup.BS,
      fill: 0x000000
    });
    this.levelInstructions.anchor.x = 0.5;
    this.levelInstructions.anchor.y = 1;
    this.levelInstructions.position.x = window.innerWidth / 2;
    this.levelInstructions.position.y = (window.innerHeight / 8) * 7.5;
    this.setup.stage.addChildAt(this.levelInstructions, 1);
    this.setup.bringToFront(this.levelInstructions);
  };

  showLevelMessage = () => {
    this.setup.debugLog("showLevelMessage");
    this.levelMessage = new PIXI.Text(this.setup.currentStageId, {
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
      this.setup.debugLog("hide LevelMessage");
    }, this.setup.messageDuration);
  };

  showLevelEndMessage = () => {
    this.hideScoreboard();
    this.levelInstructions.alpha = 0;
    this.setup.debugLog("showLevelEndMessage");
    const $congratsStrings = ["NICE!", "GOOD JOB!", "WELL DONE!"];
    this.levelMessage = new PIXI.Text(
      $congratsStrings.getRandomValue($congratsStrings),
      {
        fontFamily: this.setup.fontFamily,
        fontSize: 150 * this.setup.BS,
        fill: 0x000000,
        alpha: 1
      }
    );
    this.levelMessage.anchor.set(0.5);
    this.levelMessage.position.x = window.innerWidth / 2;
    this.levelMessage.position.y = window.innerHeight / 3;
    this.setup.stage.addChildAt(this.levelMessage, 7);
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

  hideScoreboard = () => {
    this.setup.scoreboard["flying"].alpha = 0;
  };

  updateLevel = () => {
    this.setup.targets.map(target => {
      target.update();
    });
    this.setup.bombs.map(bomb => {
      bomb.update();
    });

    if (!this.levelEnded) {
      this.setup.scoreboard.flying.text = this.setup.targets.length;
      if (!this.setup.targets.length) {
        clearInterval(this.spawnInterval);
        const button = new Button(this.setup, {
          text: "next",
          getX: () => {
            return window.innerWidth / 2;
          },
          getY: () => {
            return window.innerHeight / 2;
          },
          onClick: e => {
            const currentStageKey = this.setup.stages.indexOf(
              this.setup.currentStageId
            );
            const nextStageKey = currentStageKey + 1;
            const stagesCount = this.setup.stages.length - 1;

            if (nextStageKey <= stagesCount) {
              this.setup.currentStageId = this.setup.stages[nextStageKey];
            } else {
              this.setup.currentStageId = this.setup.stages[0];
            }
            this.setup.currentStageChanged = true;
          }
        });
        this.setup.bombs = this.setup.bombs.map(bomb => {
          bomb.pixiObj.alpha = 0;
          return bomb;
        });
        this.showLevelEndMessage();
        this.levelEnded = true;
        this.setup.debugLog("level end");
        this.setup.debugLog("---");
      }
    } else {
      this.setup.bombs = [];
      this.hideScoreboard();
    }
  };
}

export default Level;
