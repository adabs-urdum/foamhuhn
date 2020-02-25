const levels = [
  {
    targetTypes: ["birdRedHat"],
    goals: [
      {
        type: "birdYellow",
        amount: 2
      }
    ],
    initialTargetAmount: 5,
    spawnNew: false,
    instructionsText: "Find these birds:",
    bombs: 0
  },
  {
    targetTypes: ["birdPink"],
    goals: [
      {
        type: "birdYellow",
        amount: 2
      },
      {
        type: "birdRedHat",
        amount: 2
      }
    ],
    initialTargetAmount: 10,
    spawnNew: false,
    instructionsText: "Find these birds:",
    bombs: 0
  },
  {
    targetTypes: [],
    goals: [
      {
        type: "birdGreenBlack",
        amount: 1
      }
    ],
    initialTargetAmount: 1,
    spawnNew: false,
    instructionsText: "Find these birds:",
    bombs: 10
  },
  {
    targetTypes: ["birdYellow", "birdRedHat", "birdPink", "birdWhiteChick"],
    goals: [
      {
        type: "birdGreenBlack",
        amount: 5
      }
    ],
    initialTargetAmount: 20,
    spawnNew: false,
    instructionsText: "Find these birds:",
    bombs: 5
  },
  {
    targetTypes: [
      "birdYellow",
      "birdRedHat",
      "birdPink",
      "birdWhiteChick",
      "birdGreenBlack"
    ],
    initialTargetAmount: 10,
    spawnNew: true,
    instructionsText: "Shoot all birds!",
    bombs: 5
  },
  {
    targetTypes: ["birdYellow", "birdRedHat", "birdPink", "birdWhiteChick"],
    goals: [
      {
        type: "birdGreenBlack",
        amount: 1
      }
    ],
    initialTargetAmount: 50,
    spawnNew: false,
    instructionsText: "Find these birds:",
    bombs: 20
  }
];

export default levels;
