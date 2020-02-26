import Bird from "../characters/bird.js";
import Bomb from "../characters/bomb.js";
import Button from "../UI/button.js";
import GoalBoard from "../UI/goalBoard.js";

class Level {
  constructor(setup, config) {
    this.config = config;
    this.setup = setup;
    this.levelEnded = false;
    this.goalBoard = null;
    this.mobileFactor = window.innerWidth <= 768 ? 2 : 1;

    setup.debugLog("---");
    setup.debugLog("new Level");
    setup.debugLog(setup.currentStageId);

    this.config.goalTotalTargets = 0;
    if (this.config.goals && this.config.goals.length) {
      this.config.goalTotalTargets = config.goals.reduce((total, goal) => {
        return total + goal.amount;
      }, 0);
      this.config.goals.map(goal => {
        for (let index = 0; index < goal.amount; index++) {
          this.setup.targets.push(new Bird(this.setup, goal.type));
        }
      });
    }
    this.goalBoard = new GoalBoard(setup, config);

    this.randomTargetsAmount =
      this.config.initialTargetAmount - this.config.goalTotalTargets;

    for (let i = 0; i < this.randomTargetsAmount; i++) {
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

    this.spawnInterval = null;
    if (config.spawnNew) {
      this.startSpawnInterval();
    }

    this.bindEvents();
  }

  bindEvents = () => {
    window.addEventListener("resize", this.onWindowResize);
  };

  onWindowResize = () => {
    this.mobileFactor = window.innerWidth <= 768 ? 2 : 1;
    this.setLevelInstructionsPosition();
    this.setLevelMessagePosition();
    this.setLevelEndMessagePosition();
  };

  setLevelInstructionsPosition = () => {
    this.levelInstructions.anchor.x = 0;
    this.levelInstructions.position.x = this.setup.BS * 80;
    this.levelInstructions.position.y = (window.innerHeight / 8) * 6.9;
    this.levelInstructions.style.fontSize =
      50 * this.setup.BS * this.mobileFactor;
    this.setup.bringToFront(this.levelInstructions);
  };

  showLevelInstructions = () => {
    this.levelInstructions = new PIXI.Text(this.config.instructionsText, {
      fontFamily: this.setup.fontFamily,
      fill: 0x000000
    });
    this.levelInstructions.anchor.x = this.config.goalTotalTargets ? 1 : 0;
    this.levelInstructions.anchor.y = 1;
    this.setup.stage.addChildAt(this.levelInstructions, 1);
    this.setLevelInstructionsPosition();
  };

  setLevelMessagePosition = () => {
    this.levelMessage.position.x = window.innerWidth / 2;
    this.levelMessage.position.y = window.innerHeight / 3;
    this.levelMessage.style.fontSize = 150 * this.setup.BS * this.mobileFactor;
  };

  showLevelMessage = () => {
    this.setup.debugLog("showLevelMessage");
    this.levelMessage = new PIXI.Text(this.config.id.toUpperCase(), {
      fontFamily: this.setup.fontFamily,
      fontSize: 150 * this.setup.BS * this.mobileFactor,
      fill: 0x000000
    });
    this.levelMessage.anchor.set(0.5);
    this.setup.stage.addChildAt(this.levelMessage, 0);
    this.setup.bringToFront(this.levelMessage);
    this.setLevelMessagePosition();
    setTimeout(() => {
      this.levelMessage.alpha = 0;
      this.setup.debugLog("hide LevelMessage");
    }, this.setup.messageDuration);
  };

  setLevelEndMessagePosition = () => {
    if (this.levelEndMessage) {
      this.levelEndMessage.position.x = window.innerWidth / 2;
      this.levelEndMessage.position.y = window.innerHeight / 3;
      this.levelEndMessage.style.fontSize =
        150 * this.setup.BS * this.mobileFactor;
    }
  };

  showLevelEndMessage = () => {
    this.setup.debugLog("showLevelEndMessage");
    const $congratsStrings = ["NICE!", "GOOD JOB!", "WELL DONE!"];
    this.levelEndMessage = new PIXI.Text(
      $congratsStrings.getRandomValue($congratsStrings),
      {
        fontFamily: this.setup.fontFamily,
        fontSize: 150 * this.setup.BS * this.mobileFactor,
        fill: 0x000000,
        alpha: 1
      }
    );
    this.levelEndMessage.anchor.set(0.5);
    this.levelEndMessage.position.x = window.innerWidth / 2;
    this.levelEndMessage.position.y = window.innerHeight / 3;
    this.setLevelEndMessagePosition();
    this.setup.stage.addChildAt(this.levelEndMessage, 0);
    this.setup.bringToFront(this.levelEndMessage);
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

  updateLevel = () => {
    this.setup.targets.map(target => {
      target.update();
    });
    this.setup.bombs.map(bomb => {
      bomb.update();
    });
    this.goalBoard.update();

    if (!this.levelEnded) {
      if (
        !this.setup.targets.length ||
        (this.config.goals.length &&
          this.setup.successfulShots >= this.config.goalTotalTargets)
      ) {
        clearInterval(this.spawnInterval);

        const button = new Button(this.setup, {
          text: "next",
          getX: () => {
            return window.innerWidth / 2;
          },
          getY: () => {
            return this.levelMessage.position.y + this.levelMessage.height;
          },
          onClick: e => {
            this.setup.debugLog("clicked button");

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
        this.setup.targets.map(target => {
          target.pixiObj.alpha = 0;
        });
        this.showLevelEndMessage();
        this.levelEnded = true;
        this.setup.debugLog("level end");
        this.setup.debugLog("---");
      }
    } else {
      this.setup.targets = [];
      this.setup.bombs = [];
    }
  };
}

export default Level;
