class button {
  constructor(setup, buttonTextSetup) {
    this.setup = setup;
    if (window.innerWidth <= 768) {
      this.initFontsize = 140;
    } else {
      this.initFontsize = 40;
    }
    this.buttonTextSetup = buttonTextSetup;
    const container = new PIXI.Container();
    this.buttonText = new PIXI.Text(buttonTextSetup.text.toUpperCase(), {
      fontFamily: setup.fontFamily,
      fontSize: this.initFontsize * setup.BS,
      fill: 0xf0f1f3
    });
    this.buttonText.anchor.x = 0.5;
    this.buttonText.anchor.y = 0.5;
    this.setSizeAndPositionText();

    const box = PIXI.Sprite.from(PIXI.Texture.WHITE);
    box.tint = 0x3d5061;
    this.box = box;
    this.setSizeAndPositionBox();
    box.interactive = true;
    box.click = buttonTextSetup.onClick;
    box.tap = buttonTextSetup.onClick;
    box.mouseover = this.onMouseOver;
    box.mouseout = this.onMouseOut;

    container.addChild(box);
    container.addChild(this.buttonText);
    this.container = container;
    setup.stage.addChildAt(container, 2);

    this.bindEvents();
    setup.bringToFront(container);
  }

  bindEvents = () => {
    window.addEventListener("resize", this.onWindowResize);
  };

  onWindowResize = () => {
    if (window.innerWidth <= 768) {
      this.initFontsize = 140;
    } else {
      this.initFontsize = 40;
    }
    this.setSizeAndPositionText();
    this.setSizeAndPositionBox();
  };

  setSizeAndPositionBox = () => {
    const padding = this.setup.BS * this.initFontsize;

    this.box.position.x =
      this.buttonText.position.x - this.buttonText.width / 2 - padding / 2;

    if (window.innerWidth <= 768) {
      this.box.position.y =
        this.buttonText.position.y - this.buttonText.height / 2 - padding / 2;
    } else {
      this.box.position.y =
        this.buttonText.position.y - this.buttonText.height / 2 - padding / 3;
    }

    this.box.width = this.buttonText.width + padding;
    this.box.height = this.buttonText.height - this.setup.BS * 15 + padding;
  };

  setSizeAndPositionText = () => {
    this.buttonText.position.x = this.buttonTextSetup.getX();
    this.buttonText.position.y = this.buttonTextSetup.getY();
    this.buttonText.style.fontSize = this.initFontsize * this.setup.BS;
  };

  onMouseOver = () => {
    this.box.tint = 0x93a8bd;
  };

  onMouseOut = () => {
    this.box.tint = 0x3d5061;
  };
}

export default button;
