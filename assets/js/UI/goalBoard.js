import Bird from "../characters/bird.js";

class GoalBoard {
  constructor(setup, config) {
    setup.debugLog("new GoalBoard");
    this.setup = setup;
    this.config = config;
    this.goals = [];
    this.birdTypes = [];
    this.goalsPixiObj = [];
    this.birdOffset = this.setup.BS * 70;
    this.mobileFactor = window.innerWidth <= 768 ? 2.5 : 1;
    this.frames = [
      new PIXI.Rectangle(0, 0, 233, 185),
      new PIXI.Rectangle(233, 0, 233, 185),
      new PIXI.Rectangle(466, 0, 233, 185),
      new PIXI.Rectangle(0, 185, 233, 185),
      new PIXI.Rectangle(233, 185, 233, 185),
      new PIXI.Rectangle(466, 185, 233, 185),
      new PIXI.Rectangle(0, 370, 233, 185),
      new PIXI.Rectangle(233, 370, 233, 185),
      new PIXI.Rectangle(466, 370, 233, 185)
    ];

    this.config.goals = this.config.goals ? this.config.goals : [];
    this.config.goals.map((goal, goalIndex) => {
      for (let index = 0; index < goal.amount; index++) {
        const bird = new Bird(this.setup, goal.type);
        this.addGoal(index, goalIndex, goal, bird);
        if (!this.birdTypes.includes(goal.type)) {
          this.birdTypes.push(goal.type);
        }
      }
    });

    this.bindEvents();
  }

  bindEvents = () => {
    window.addEventListener("resize", this.onWindowResize);
  };

  onWindowResize = () => {
    this.mobileFactor = window.innerWidth <= 768 ? 2.5 : 1;
    console.log(this.mobileFactor);
    this.birdOffset = this.setup.BS * 70;
    this.goalsPixiObj.map(goalPixiObj => {
      this.setup.bringToFront(goalPixiObj);
      this.setGoalPixiObjPosition(goalPixiObj);
    });
  };

  setGoalPixiObjPosition = pixiObj => {
    pixiObj.scale.set((window.innerWidth / 100) * 0.03 * this.mobileFactor);
    pixiObj.x = this.birdOffset + pixiObj.width;
    pixiObj.y = (window.innerHeight / 8) * 6.9;
    this.birdOffset = pixiObj.x;
  };

  addGoal = (index, goalIndex, goal, bird) => {
    this.goals.push(bird);
    this.texture = this.setup.loader.resources[goal.type].texture.clone();
    this.texture.frame = this.frames[0];
    this.texture.name = goal.type;
    const pixiObj = new PIXI.Sprite(this.texture);
    pixiObj.alpha = 0.3;
    pixiObj.anchor.x = 1;
    pixiObj.anchor.y = 0;

    this.setup.stage.addChildAt(pixiObj, 5);
    this.setup.bringToFront(pixiObj);
    this.goalsPixiObj.push(pixiObj);
    this.setGoalPixiObjPosition(pixiObj);
  };

  update = () => {
    this.setup.targetDown.map((target, indexTarget) => {
      if (this.birdTypes.includes(target.texture.name)) {
        const foundGoal = this.goalsPixiObj.find((goal, index) => {
          return target.texture.name == goal.texture.name && goal.alpha < 1;
        });
        if (foundGoal) {
          foundGoal.alpha = 1;
          this.setup.successfulShots += 1;
          this.setup.targetsDown.push(foundGoal);
          this.setup.targetDown.splice(indexTarget, 1);
        }
      }
    });
  };
}

export default GoalBoard;
