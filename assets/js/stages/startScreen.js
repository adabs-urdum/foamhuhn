import Button from "./../UI/button.js";

class startScreen {
  constructor(setup) {
    setup.debugLog("constructing startScreen");
    this.setup = setup;
    this.welcomeText = this.addWelcome();
    this.setup.lifes = this.setup.totalLifes;
    this.startButton = this.addStartButton();
    this.bindEvents();
  }

  bindEvents = () => {
    window.addEventListener("resize", this.onWindowResize);
  };

  onWindowResize = () => {
    this.welcomeText.style.fontSize = 200 * this.setup.BS;
    this.welcomeText.position.set(
      window.innerWidth / 2,
      window.innerHeight / 4
    );
  };

  addWelcome = () => {
    const text = this.setup.lifes ? "SHOOT THE BIRDS" : "GAME OVER";
    let welcomeText = new PIXI.Text(text, {
      fontFamily: "Sedgwick Ave Display",
      fontSize: 200 * this.setup.BS,
      fill: 0x3d5061
    });
    welcomeText.anchor.set(0.5);
    welcomeText.position.set(window.innerWidth / 2, window.innerHeight / 4);
    this.setup.stage.addChildAt(welcomeText, 1);

    return welcomeText;
  };

  addStartButton = () => {
    const button = new Button(this.setup, {
      text: "start",
      getX: () => {
        return window.innerWidth / 2;
      },
      getY: () => {
        return (
          this.welcomeText.position.y +
          this.welcomeText.height / 2 +
          this.setup.BS * 100
        );
      },
      onClick: e => {
        const currentStageIndex = this.setup.stages.indexOf("start");
        this.setup.currentStageId = this.setup.stages[currentStageIndex + 1];
        this.setup.currentStageChanged = true;
      }
    });
    return button;
  };
}

export default startScreen;
