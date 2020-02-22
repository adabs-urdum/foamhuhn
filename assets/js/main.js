"use strict";

import "babel-polyfill";
import WebFont from "webfontloader";
import * as PIXI from "pixi.js";
import Bird from "./characters/bird.js";
import Level from "./stages/level.js";
import StartScreen from "./stages/startScreen.js";
window.PIXI = PIXI;

Array.prototype.getRandomValue = inputArray => {
  return inputArray[Math.floor(Math.random() * inputArray.length)];
};

document.addEventListener("DOMContentLoaded", function() {
  const setup = {
    fontFamily: "Sedgwick Ave Display",
    messageDuration: 2000,
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
    gravity: 17,
    displayTextDuration: 2000,
    currentStage: null,
    currentStageChanged: true,
    stages: ["start", "level-1"],
    currentStageId: "level-1"
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

    resetStage = () => {
      for (var i = setup.stage.children.length - 1; i >= 0; i--) {
        setup.stage.removeChild(setup.stage.children[i]);
      }
      this.addBackground();
      this.addBackgroundFront();
    };

    preloadReady = () => {
      this.addBackground();

      this.ticker = new PIXI.Ticker();
      this.ticker.add(this.animate);
      this.ticker.start();
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
          this.resetStage();
          setup.currentStage = new StartScreen(setup);
        } else if (setup.currentStageId == "level-1") {
          this.resetStage();
          setup.currentStage = new Level(setup, {
            targetTypes: ["birdYellow"],
            initialTargetAmount: 10,
            spawnNew: false,
            instructionsText: "shoot all birds"
          });
        } else {
          setup.targets.map(target => {
            target.fly();
          });
        }
        setup.currentStageChanged = false;
      }

      if (setup.currentStageId.indexOf("level") >= 0) {
        if (Object.keys(setup.scoreboard).length) {
          setup.currentStage.updateScoreBoard();
        }
        setup.targets.map(target => {
          target.fly();
        });
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