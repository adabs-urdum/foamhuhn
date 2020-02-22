"use strict";

import "babel-polyfill";
import WebFont from "webfontloader";
import * as PIXI from "pixi.js";
import Bird from "./characters/bird.js";
import StartScreen from "./stages/startScreen.js";
window.PIXI = PIXI;

Array.prototype.getRandomValue = inputArray => {
  return inputArray[Math.floor(Math.random() * inputArray.length)];
};

document.addEventListener("DOMContentLoaded", function() {
  const setup = {
    designWidth: 1920,
    BS: window.innerWidth / 1920,
    renderer: null,
    stage: null,
    loader: null,
    spawnedTargets: 0,
    successfulShots: 0,
    targets: [],
    isRunning: true,
    scoreboard: {},
    gravity: 20,
    currentStage: null,
    currentStageId: null,
    currentStageChanged: true,
    stages: ["start", "level-1"]
  };

  class Game {
    constructor() {
      this.canvas = document.getElementById("canvas");
      setup.renderer = new PIXI.Renderer({
        view: this.canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio,
        autoDensity: true,
        transparent: true
      });
      setup.stage = new PIXI.Container();

      setup.currentStageId = setup.currentStageId
        ? setup.currentStageId
        : setup.stages[0];

      this.sprites = {};
      setup.loader = PIXI.Loader.shared;
      setup.loader = new PIXI.Loader();
      this.preloadAssets();
      this.bindEvents();
    }

    bindEvents = () => {
      window.addEventListener("resize", this.onResize);
    };

    onResize = () => {
      setup.renderer.resize(window.innerWidth, window.innerHeight);
      setup.BS = window.innerWidth / setup.designWidth;

      this.landscape.height = window.innerHeight;
      this.landscape.width = window.innerHeight * this.landscape.sideRatio;
      this.landscape.position.x = window.innerWidth / 2;
      this.landscape.position.y = window.innerHeight / 2;
    };

    addBackground = () => {
      const landscape = PIXI.Sprite.from("./dist/img/background.jpg");
      landscape.sideRatio = 1920 / 1080;
      landscape.anchor.x = 0.5;
      landscape.anchor.y = 0.5;
      landscape.zOrder = 1;
      landscape.zIndex = 1;
      landscape.height = window.innerHeight;
      landscape.width = window.innerHeight * landscape.sideRatio;
      landscape.position.x = window.innerWidth / 2;
      landscape.position.y = window.innerHeight / 2;
      this.landscape = landscape;
      setup.stage.addChildAt(this.landscape, 0);
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
      for (let i = 1; i <= 10; i++) {
        setup.stage.addChildAt(new PIXI.Graphics(), i);
      }
      setup.stage.addChildAt(landscapeFront, 11);
      this.landscapeFront = landscapeFront;
    };

    preloadReady = () => {
      this.addBackground();

      // setup.targets.push(
      //   new Bird(setup),
      //   new Bird(setup),
      //   new Bird(setup),
      //   new Bird(setup),
      //   new Bird(setup),
      //   new Bird(setup)
      // );
      // setup.targets.map(target => {
      //   setup.spawnedTargets += 1;
      //   target._id = setup.spawnedTargets;
      //   setup.stage.addChildAt(target.pixiObj, 1);
      // });

      // this.addBackgroundFront();
      // this.addScoreBoard();

      // this.spawnInterval = setInterval(() => {
      //   const target = new Bird(setup);
      //   setup.stage.addChildAt(target.pixiObj, 2);
      //   setup.spawnedTargets += 1;
      //   target._id = setup.spawnedTargets;
      //   setup.targets.push(target);
      // }, 2000);

      this.ticker = new PIXI.Ticker();
      this.ticker.add(this.animate);
      this.ticker.start();
    };

    addScoreBoard = () => {
      let flying = new PIXI.Text(setup.targets.length, {
        fontFamily: "Arial Black",
        fontSize: 200,
        fill: 0xe9e9e9,
        align: "center"
      });
      flying.anchor.set(0.5);
      flying.position.set(window.innerWidth / 2, window.innerHeight / 4);
      setup.stage.addChildAt(flying, 1);

      let total = new PIXI.Text("/" + setup.spawnedTargets, {
        fontFamily: "Arial Black",
        fontSize: 100,
        fill: 0x374754,
        align: "center"
      });
      setup.stage.addChildAt(total, 7);
      total.anchor.set(0, 0.5);
      total.position.set(
        window.innerWidth - total.width - 80,
        window.innerHeight - total.height
      );
      setup.stage.addChildAt(total, 7);

      let dead = new PIXI.Text(setup.successfulShots, {
        fontFamily: "Arial Black",
        fontSize: 100,
        fill: 0x1a2127,
        align: "center"
      });
      setup.stage.addChildAt(dead, 7);
      dead.anchor.set(0, 0.5);
      dead.position.set(
        window.innerWidth - total.width - dead.width - 80,
        window.innerHeight - dead.height
      );
      setup.stage.addChildAt(dead, 7);

      setup.scoreboard["total"] = total;
      setup.scoreboard["dead"] = dead;
      setup.scoreboard["flying"] = flying;
    };

    preloadAssets = () => {
      const sprites = this.sprites;
      setup.loader
        .add("moorhuhn", "./dist/img/moorhuhn.png")
        .add("background", "./dist/img/background.jpg")
        .add("backgroundFront", "./dist/img/background_1.png")
        .add("birdRedHat", "./dist/img/birds/spreadFly1.png")
        .add("birdYellow", "./dist/img/birds/spreadFly2.png")
        .add("birdPink", "./dist/img/birds/spreadFly3.png")
        .add("birdGreenBlack", "./dist/img/birds/spreadFly4.png")
        .add("birdWhiteChick", "./dist/img/birds/spreadFly5.png")
        .load();

      // throughout the process multiple signals can be dispatched.
      setup.loader.onProgress.add(() => {}); // called once per loaded/errored file
      setup.loader.onError.add(() => {}); // called once per errored file
      setup.loader.onLoad.add(() => {}); // called once per loaded file
      setup.loader.onComplete.add(this.preloadReady); // called once when the queued resources all load.
    };

    animate = () => {
      if (setup.currentStageChanged) {
        if (setup.currentStageId == "start") {
          setup.currentStage = new StartScreen(setup);
        } else if (setup.currentStageId == "level-1") {
          console.log("level-1");
        } else {
          setup.targets.map(target => {
            target.fly();
          });

          // setup.scoreboard.flying.text = setup.targets.length;
          // setup.scoreboard.dead.text = setup.successfulShots;
          // setup.scoreboard.total.text = "/" + setup.spawnedTargets;
          // setup.scoreboard.flying.position.set(
          //   window.innerWidth / 2,
          //   window.innerHeight / 4
          // );
          // setup.scoreboard.total.position.x =
          //   window.innerWidth - setup.scoreboard.total.width - 80;
          // setup.scoreboard.dead.position.x =
          //   setup.scoreboard.total.x - setup.scoreboard.dead.width;

          // if (!setup.targets.length) {
          //   clearInterval(this.spawnInterval);
          //   setup.scoreboard.flying.text = "YOU WIN";
          //   setup.scoreboard.flying.style.fontSize = 150;
          // }
        }
        setup.currentStageChanged = false;
      }

      setup.renderer.render(setup.stage);
    };
  }

  WebFont.load({
    // this event is triggered when the fonts have been rendered, see https://github.com/typekit/webfontloader
    active: function() {
      new Game();
    },

    // when font is loaded do some magic, so font can be correctly rendered immediately after PIXI is initialized
    // fontloading: doMagic,

    // multiple fonts can be passed here
    google: {
      families: ["Sedgwick Ave Display"]
    }
  });
});
