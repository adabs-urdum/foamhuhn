"use strict";

import "babel-polyfill";
import WebFont from "webfontloader";
import * as PIXI from "pixi.js";
import Bird from "./characters/bird.js";
import LifeBar from "./UI/lifeBar.js";
import Level from "./stages/level.js";
import StartScreen from "./stages/startScreen.js";
import levels from "./levels.js";
window.PIXI = PIXI;

Array.prototype.getRandomValue = inputArray => {
  return inputArray[Math.floor(Math.random() * inputArray.length)];
};

document.addEventListener("DOMContentLoaded", function() {
  const infoOverlay = document.getElementById("infoOverlay");
  const infoOverlayTrigger = document.getElementById("infoOverlayTrigger");
  infoOverlayTrigger.addEventListener("click", () => {
    infoOverlay.classList.toggle("infoOverlay--active");
  });

  const debug = true;
  const setup = {
    fontFamily: "Sedgwick Ave Display",
    gameStarted: false,
    messageDuration: 1000,
    windowRatio: window.innerWidth / window.innerHeight,
    designWidth: 1920,
    BS: window.innerWidth / 1920,
    renderer: null,
    stage: null,
    loader: null,
    spawnedTargets: 0,
    successfulShots: 0,
    targets: [],
    targetDown: [],
    targetsDown: [],
    bombs: [],
    isRunning: true,
    scoreboard: {},
    gravity: 20,
    displayTextDuration: 2000,
    currentStage: null,
    totalLifes: 3,
    lifes: 3,
    currentStageChanged: true,
    stages: [
      "start",
      "level-1",
      "level-2",
      "level-3",
      "level-4",
      "level-5",
      "level-6"
    ],
    currentStageId: "start",
    bringToFront: obj => {
      if (obj) {
        const parent = obj.parent;
        if (parent) {
          parent.removeChild(obj);
          parent.addChild(obj);
        }
      }
    },
    debugLog: str => {
      if (debug) {
        console.log(str);
      }
    }
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
      window.addEventListener("mousemove", this.setCrossHairPosition);
    };

    onResize = () => {
      setup.renderer.resize(window.innerWidth, window.innerHeight);
      setup.BS = window.innerWidth / setup.designWidth;
      setup.windowRatio = window.innerWidth / window.innerHeight;

      this.setBackgroundPosition();
      this.setBackgroundFrontPosition();
    };

    setBackgroundPosition = () => {
      if (setup.windowRatio >= this.landscape.sideRatio) {
        this.landscape.width = window.innerWidth;
        this.landscape.height = window.innerWidth / this.landscape.sideRatio;
      } else {
        this.landscape.height = window.innerHeight;
        this.landscape.width = window.innerHeight * this.landscape.sideRatio;
      }
      this.landscape.position.x = window.innerWidth / 2;
      this.landscape.position.y = window.innerHeight / 2;
    };

    addBackground = () => {
      const texture = setup.loader.resources["background"].texture.clone();
      const landscape = new PIXI.Sprite(texture);
      landscape.sideRatio = 1920 / 1080;

      landscape.anchor.x = 0.5;
      landscape.anchor.y = 0.5;

      this.landscape = landscape;
      this.setBackgroundPosition();
      setup.stage.addChildAt(this.landscape, 0);
    };

    setBackgroundFrontPosition = () => {
      if (setup.windowRatio >= this.landscape.sideRatio) {
        this.landscapeFront.width = window.innerWidth;
        this.landscapeFront.height =
          window.innerWidth / this.landscape.sideRatio;
      } else {
        this.landscapeFront.height = window.innerHeight;
        this.landscapeFront.width =
          window.innerHeight * this.landscape.sideRatio;
      }
      this.landscapeFront.position.x = window.innerWidth / 2;
      this.landscapeFront.position.y = window.innerHeight / 2;
      setup.bringToFront(this.landscapeFront);
    };

    addBackgroundFront = () => {
      const texture = setup.loader.resources["backgroundFront"].texture.clone();
      const landscapeFront = new PIXI.Sprite(texture);
      landscapeFront.anchor.x = 0.5;
      landscapeFront.anchor.y = 0.5;
      setup.stage.addChildAt(landscapeFront, 0);
      setup.bringToFront(landscapeFront);
      this.landscapeFront = landscapeFront;
      this.setBackgroundFrontPosition();
    };

    resetStage = () => {
      for (var i = setup.stage.children.length - 1; i >= 0; i--) {
        setup.stage.removeChild(setup.stage.children[i]);
      }
      setup.targets = [];
      setup.targetDown = [];
      setup.targetsDown = [];
      setup.successfulShots = 0;
      setup.bombs = [];
      this.addBackground();
      this.addBackgroundFront();
      this.addCrossHair();
      this.lifeBar.reDrawHearts();
    };

    preloadReady = () => {
      this.addBackground();

      this.addCrossHair();

      this.ticker = new PIXI.Ticker();
      this.ticker.add(this.animate);
      this.ticker.start();
    };

    addCrossHair = () => {
      const texture = setup.loader.resources["crossHair"].texture.clone();

      const crossHair = new PIXI.Sprite(texture);
      crossHair.anchor.x = 0.5;
      crossHair.anchor.y = 0.5;
      crossHair.x = crossHair.width * -1;
      crossHair.y = crossHair.height * -1;
      this.crossHair = crossHair;
      setup.stage.addChildAt(this.crossHair, 1);
    };

    setCrossHairPosition = e => {
      if (this.crossHair) {
        this.crossHair.scale.x = (window.innerWidth / 10000) * 0.5;
        this.crossHair.scale.y = (window.innerWidth / 10000) * 0.5;
        this.crossHair.x = e.clientX;
        this.crossHair.y = e.clientY;
        setup.bringToFront(this.crossHair);
      }
    };

    preloadAssets = () => {
      const sprites = this.sprites;
      setup.loader
        .add("heart", "./dist/img/heart.png")
        .add("background", "./dist/img/background.jpg")
        .add("backgroundFront", "./dist/img/background_1.png")
        .add("birdRedHat", "./dist/img/birds/spreadFly1.png")
        .add("birdYellow", "./dist/img/birds/spreadFly2.png")
        .add("birdPink", "./dist/img/birds/spreadFly3.png")
        .add("birdGreenBlack", "./dist/img/birds/spreadFly4.png")
        .add("birdWhiteChick", "./dist/img/birds/spreadFly5.png")
        .add("bomb", "./dist/img/traps/bomb.png")
        .add("crossHair", "./dist/img/crossHair.png")
        .load();

      this.targetTypes = [
        "birdRedHat",
        "birdYellow",
        "birdPink",
        "birdGreenBlack",
        "birdWhiteChick"
      ];

      // throughout the process multiple signals can be dispatched.
      setup.loader.onProgress.add(() => {}); // called once per loaded/errored file
      setup.loader.onError.add(() => {}); // called once per errored file
      setup.loader.onLoad.add(() => {}); // called once per loaded file
      setup.loader.onComplete.add(this.preloadReady); // called once when the queued resources all load.
    };

    animate = () => {
      if (!this.lifeBar) {
        this.lifeBar = new LifeBar(setup);
      }

      if (setup.currentStageChanged) {
        if (setup.currentStageId == "start") {
          this.resetStage();
          setup.currentStage = new StartScreen(setup);
          setup.gameStarted = true;
        } else if (setup.currentStageId == "level-1") {
          this.resetStage();
          setup.currentStage = new Level(setup, levels[0]);
        } else if (setup.currentStageId == "level-2") {
          this.resetStage();
          setup.currentStage = new Level(setup, levels[1]);
        } else if (setup.currentStageId == "level-3") {
          this.resetStage();
          setup.currentStage = new Level(setup, levels[2]);
        } else if (setup.currentStageId == "level-4") {
          this.resetStage();
          setup.currentStage = new Level(setup, levels[3]);
        } else if (setup.currentStageId == "level-5") {
          this.resetStage();
          setup.currentStage = new Level(setup, levels[4]);
        } else if (setup.currentStageId == "level-6") {
          this.resetStage();
          setup.currentStage = new Level(setup, levels[5]);
        }

        setup.currentStageChanged = false;
      } else {
        if (setup.currentStageId.indexOf("level") >= 0) {
          this.lifeBar.update();
          if (!setup.currentStage.levelEnded) {
            setup.currentStage.updateLevel();
          }
        }
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
