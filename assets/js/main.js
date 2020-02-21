"use strict";

import "babel-polyfill";
import * as PIXI from "pixi.js";
window.PIXI = PIXI;

Array.prototype.getRandomValue = inputArray => {
  return inputArray[Math.floor(Math.random() * inputArray.length)];
};

document.addEventListener("DOMContentLoaded", function() {
  let renderer;
  let stage;
  let loader;
  const targets = [];
  const gravity = 20;

  class Target {
    constructor() {
      let resources = loader.resources;

      const run = [];
      const textures = ["bird1", "bird2", "bird3", "bird4"];
      const texture = loader.resources[
        textures.getRandomValue(textures)
      ].texture.clone();
      run.push(
        new PIXI.Rectangle(0, 0, 233, 185),
        new PIXI.Rectangle(233, 0, 233, 185),
        new PIXI.Rectangle(466, 0, 233, 185),
        new PIXI.Rectangle(0, 185, 233, 185),
        new PIXI.Rectangle(233, 185, 233, 185),
        new PIXI.Rectangle(466, 185, 233, 185),
        new PIXI.Rectangle(0, 370, 233, 185),
        new PIXI.Rectangle(233, 370, 233, 185),
        new PIXI.Rectangle(466, 370, 233, 185)
      );
      texture.frame = run[0];
      this.run = run;
      const pixiObj = new PIXI.Sprite(texture);
      this.texture = texture;
      pixiObj.scale.set(Math.random() * 0.4 + 0.4);

      this.pixiObj = pixiObj;
      this.maxFramesFly = 4;
      this.af = 0;
      this.df = this.maxFramesFly; // images per seconds
      pixiObj.zOrder = 2;
      pixiObj.zIndex = 2;

      this.dead = false;
      this.directions = {
        x: 1,
        y: 1
      };
      this.speed = Math.random() * 3 + 2;
      pixiObj.anchor.x = 0.5;
      pixiObj.anchor.y = 0.5;

      this.setInitialPositionY();
      this.setInitialPositionX();
      pixiObj.interactive = true;
      pixiObj.buttonMode = true;
      pixiObj.on("pointerdown", this.onClick);
    }

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

    fly = () => {
      if (this.dead == false) {
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

        if (this.af >= this.maxFramesFly) {
          this.af = 0;
        } else {
          this.af += 1 / this.df;
        }
        this.texture.frame = this.run[Math.floor(this.af)];
      } else {
        if (this.pixiObj.y <= window.innerHeight) {
          this.pixiObj.y += gravity;
        } else {
          stage.removeChild(this.pixiObj);
        }
      }
    };

    flipHorizontal = () => {
      this.pixiObj.scale.x *= -1;
    };

    flipVertical = () => {
      this.pixiObj.scale.y *= -1;
    };

    onClick = e => {
      this.dead = true;
      this.texture.frame = this.run[8];
      this.flipVertical();
      this.pixiObj.off("pointerdown", this.onClick);

      if (Math.round(Math.random())) {
        const target = new Target();
        stage.addChildAt(target.pixiObj, 1);
        targets.push(target);
      }
    };
  }

  class Game {
    constructor() {
      this.canvas = document.getElementById("canvas");
      renderer = new PIXI.Renderer({
        view: this.canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio,
        autoDensity: true,
        transparent: true
      });
      this.renderer = renderer;
      stage = new PIXI.Container();
      this.stage = stage;

      this.sprites = {};
      loader = PIXI.Loader.shared;
      loader = new PIXI.Loader();
      this.loader = loader;
      this.preloadAssets();
      this.bindEvents();
    }

    bindEvents = () => {
      window.addEventListener("resize", this.onResize);
    };

    onResize = () => {
      this.renderer.resize(window.innerWidth, window.innerHeight);
      this.landscape.width = window.innerWidth;
      this.landscape.height = window.innerHeight;
      this.landscapeFront.width = window.innerWidth;
    };

    addBackground = () => {
      const landscape = PIXI.Sprite.from("./dist/img/background.jpg");
      landscape.anchor.x = 0;
      landscape.anchor.y = 0;
      landscape.zOrder = 1;
      landscape.zIndex = 1;
      landscape.width = window.innerWidth;
      landscape.height = window.innerHeight;
      landscape.position.x = 0;
      landscape.position.y = 0;
      this.stage.addChildAt(landscape, 0);
      this.landscape = landscape;
    };

    addBackgroundFront = () => {
      const landscapeFront = PIXI.Sprite.from("./dist/img/background_1.png");
      landscapeFront.anchor.x = 0;
      landscapeFront.anchor.y = 0;
      landscapeFront.zOrder = 1;
      landscapeFront.zIndex = 1;
      landscapeFront.width = window.innerWidth;
      landscapeFront.height = window.innerHeight;
      landscapeFront.position.x = window.innerHeight - landscapeFront.height;
      landscapeFront.position.y = 0;
      this.stage.addChildAt(landscapeFront, 7);
      this.landscapeFront = landscapeFront;
    };

    preloadReady = () => {
      this.addBackground();

      this.targets = targets;
      this.targets.push(
        new Target(),
        new Target(),
        new Target(),
        new Target(),
        new Target(),
        new Target()
      );
      this.targets.map(target => {
        this.stage.addChildAt(target.pixiObj, 1);
      });

      this.addBackgroundFront();

      setInterval(() => {
        const target = new Target();
        this.stage.addChildAt(target.pixiObj, 1);
        this.targets.push(target);
      }, 2000);

      this.ticker = new PIXI.Ticker();
      this.ticker.add(this.animate);
      this.ticker.start();
    };

    preloadAssets = () => {
      loader = this.loader;
      const sprites = this.sprites;
      loader.add("moorhuhn", "./dist/img/moorhuhn.png");
      loader.add("background", "./dist/img/background.jpg");
      loader.add("backgroundFront", "./dist/img/background_1.png");
      loader.add("bird1", "./dist/img/birds/spreadFly1.png");
      loader.add("bird2", "./dist/img/birds/spreadFly2.png");
      loader.add("bird3", "./dist/img/birds/spreadFly3.png");
      loader.add("bird4", "./dist/img/birds/spreadFly4.png");

      loader.load();

      // throughout the process multiple signals can be dispatched.
      loader.onProgress.add(() => {}); // called once per loaded/errored file
      loader.onError.add(() => {}); // called once per errored file
      loader.onLoad.add(() => {}); // called once per loaded file
      loader.onComplete.add(this.preloadReady); // called once when the queued resources all load.
    };

    animate = () => {
      this.targets.map(target => {
        target.fly();
      });
      this.renderer.render(this.stage);
    };
  }

  new Game();
});
