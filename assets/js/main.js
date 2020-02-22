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
  let spawnedTargets = 0;
  let successfulShots = 0;
  let targets = [];
  let isRunning = true;
  const scoreboard = {};
  const gravity = 20;

  class Target {
    constructor() {
      let resources = loader.resources;

      const run = [];
      const textures = ["bird1", "bird2", "bird3", "bird4", "bird5"];
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
          targets = targets.filter(target => {
            if (target._id != this._id) {
              return target;
            }
          });
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
      successfulShots += 1;
      this.texture.frame = this.run[8];
      this.flipVertical();
      this.pixiObj.off("pointerdown", this.onClick);

      if (Math.round(Math.random())) {
        const target = new Target();
        stage.addChildAt(target.pixiObj, 2);
        targets.push(target);
        spawnedTargets += 1;
        target._id = spawnedTargets;
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
      this.stage.addChildAt(landscapeFront, 5);
      this.landscapeFront = landscapeFront;
    };

    preloadReady = () => {
      this.addBackground();

      targets.push(
        new Target(),
        new Target(),
        new Target(),
        new Target(),
        new Target(),
        new Target()
      );
      targets.map(target => {
        spawnedTargets += 1;
        target._id = spawnedTargets;
        this.stage.addChildAt(target.pixiObj, 1);
      });

      this.addBackgroundFront();
      this.addScoreBoard();

      this.spawnInterval = setInterval(() => {
        const target = new Target();
        this.stage.addChildAt(target.pixiObj, 2);
        spawnedTargets += 1;
        target._id = spawnedTargets;
        targets.push(target);
      }, 2000);

      this.ticker = new PIXI.Ticker();
      this.ticker.add(this.animate);
      this.ticker.start();
    };

    addScoreBoard = () => {
      let flying = new PIXI.Text(targets.length, {
        fontFamily: "Arial Black",
        fontSize: 200,
        fill: 0xe9e9e9,
        align: "center"
      });
      flying.anchor.set(0.5);
      flying.position.set(window.innerWidth / 2, window.innerHeight / 4);
      this.stage.addChildAt(flying, 1);

      let total = new PIXI.Text("/" + spawnedTargets, {
        fontFamily: "Arial Black",
        fontSize: 100,
        fill: 0x374754,
        align: "center"
      });
      this.stage.addChildAt(total, 7);
      total.anchor.set(0, 0.5);
      total.position.set(
        window.innerWidth - total.width - 80,
        window.innerHeight - total.height
      );
      this.stage.addChildAt(total, 7);

      let dead = new PIXI.Text(successfulShots, {
        fontFamily: "Arial Black",
        fontSize: 100,
        fill: 0x1a2127,
        align: "center"
      });
      this.stage.addChildAt(dead, 7);
      dead.anchor.set(0, 0.5);
      dead.position.set(
        window.innerWidth - total.width - dead.width - 80,
        window.innerHeight - dead.height
      );
      this.stage.addChildAt(dead, 7);

      scoreboard["total"] = total;
      scoreboard["dead"] = dead;
      scoreboard["flying"] = flying;
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
      loader.add("bird5", "./dist/img/birds/spreadFly5.png");

      loader.load();

      // throughout the process multiple signals can be dispatched.
      loader.onProgress.add(() => {}); // called once per loaded/errored file
      loader.onError.add(() => {}); // called once per errored file
      loader.onLoad.add(() => {}); // called once per loaded file
      loader.onComplete.add(this.preloadReady); // called once when the queued resources all load.
    };

    animate = () => {
      targets.map(target => {
        target.fly();
      });

      scoreboard.flying.text = targets.length;
      scoreboard.dead.text = successfulShots;
      scoreboard.total.text = "/" + spawnedTargets;
      scoreboard.flying.position.set(
        window.innerWidth / 2,
        window.innerHeight / 4
      );
      scoreboard.total.position.x =
        window.innerWidth - scoreboard.total.width - 80;
      scoreboard.dead.position.x = scoreboard.total.x - scoreboard.dead.width;

      if (!targets.length) {
        clearInterval(this.spawnInterval);
        scoreboard.flying.text = "YOU WIN";
        scoreboard.flying.style.fontSize = 150;
      }

      this.renderer.render(this.stage);
    };
  }

  new Game();
});
