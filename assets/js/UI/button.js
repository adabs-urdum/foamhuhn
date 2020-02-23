class button {
  constructor(setup, buttonTextSetup) {
    this.setup = setup;
    this.buttonTextSetup = buttonTextSetup;
    const container = new PIXI.Container();
    this.buttonText = new PIXI.Text(buttonTextSetup.text.toUpperCase(), {
      fontFamily: setup.fontFamily,
      fontSize: 40 * setup.BS,
      fill: 0xf0f1f3
    });
    this.buttonText.anchor.set(0.5);
    this.setSizeAndPositionText();

    container.interactive = true;
    container.click = buttonTextSetup.onClick;
    container.mouseover = this.onMouseOver;
    container.mouseout = this.onMouseOut;

    const box = PIXI.Sprite.from(PIXI.Texture.WHITE);
    box.tint = 0x3d5061;
    this.box = box;
    this.setSizeAndPositionBox();

    container.addChild(box);
    container.addChild(this.buttonText);
    this.container = container;
    setup.stage.addChildAt(container, 2);

    this.bindEvents();
  }

  setSizeAndPositionBox = () => {
    const padding = this.setup.BS * 40;
    this.box.position.x =
      this.buttonText.position.x - this.buttonText.width / 2 - padding / 2;
    this.box.position.y =
      this.buttonText.position.y - this.buttonText.height / 2 - padding / 2;
    this.box.width = this.buttonText.width + padding;
    this.box.height = this.buttonText.height - this.setup.BS * 15 + padding;
  };

  setSizeAndPositionText = () => {
    this.buttonText.position.x = this.buttonTextSetup.getX();
    this.buttonText.position.y = this.buttonTextSetup.getY();
    this.buttonText.style.fontSize = 40 * this.setup.BS;
  };

  bindEvents = () => {
    window.addEventListener("resize", this.onWindowResize);
  };

  onWindowResize = () => {
    this.setSizeAndPositionText();
    this.setSizeAndPositionBox();
  };

  onMouseOver = () => {
    this.box.tint = 0x93a8bd;
  };

  onMouseOut = () => {
    this.box.tint = 0x3d5061;
  };
}

export default button;
