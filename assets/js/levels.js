const levels = [
  {
    id: "Level 1",
    targetTypes: ["birdRedHat"],
    goals: [
      {
        type: "birdYellow",
        amount: 2
      }
    ],
    initialTargetAmount: 6,
    spawnNew: false,
    instructionsText: "Find these birds:",
    bombs: 0
  },
  {
    id: "Level 2",
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
    id: "Level 3",
    targetTypes: ["birdGreenBlack"],
    goals: [
      {
        type: "birdGreenBlack",
        amount: 4
      }
    ],
    initialTargetAmount: 10,
    spawnNew: false,
    instructionsText: "Find these birds:",
    bombs: 10
  },
  {
    id: "Level 4",
    targetTypes: ["birdYellow", "birdPinkStripes", "birdRedHat", "birdBlue"],
    goals: [
      {
        type: "birdWhiteChick",
        amount: 5
      }
    ],
    initialTargetAmount: 20,
    spawnNew: false,
    instructionsText: "Find these birds:",
    bombs: 5
  },
  {
    id: "Level 5",
    targetTypes: [
      "birdRedHat",
      "birdYellow",
      "birdPink",
      "birdGreenBlack",
      "birdWhiteChick",
      "birdPunk",
      "birdPinkStripes",
      "birdBlueHat",
      "birdBlue"
    ],
    initialTargetAmount: 7,
    spawnNew: true,
    instructionsText: "Shoot all birds!",
    bombs: 5
  },
  {
    id: "Level 6",
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
  },
  {
    id: "Level 7",
    targetTypes: [
      "birdRedHat",
      "birdYellow",
      "birdPink",
      "birdGreenBlack",
      "birdWhiteChick",
      "birdPunk",
      "birdPinkStripes",
      "birdBlueHat",
      "birdBlue"
    ],
    goals: [
      {
        type: "birdRedHat",
        amount: 1
      },
      {
        type: "birdYellow",
        amount: 1
      },
      {
        type: "birdPink",
        amount: 1
      },
      {
        type: "birdGreenBlack",
        amount: 1
      },
      {
        type: "birdWhiteChick",
        amount: 1
      },
      {
        type: "birdPunk",
        amount: 1
      },
      {
        type: "birdPinkStripes",
        amount: 1
      },
      {
        type: "birdBlueHat",
        amount: 1
      },
      {
        type: "birdBlue",
        amount: 1
      }
    ],
    initialTargetAmount: 90,
    spawnNew: true,
    instructionsText: "Find these birds:",
    bombs: 10
  },
  {
    id: "Level 8",
    targetTypes: [
      "birdRedHat",
      "birdYellow",
      "birdPink",
      "birdGreenBlack",
      "birdWhiteChick",
      "birdPunk",
      "birdPinkStripes",
      "birdBlueHat",
      "birdBlue"
    ],
    goals: [
      {
        type: "birdPinkStripes",
        amount: 3
      }
    ],
    initialTargetAmount: 120,
    spawnNew: false,
    instructionsText: "Find these birds:",
    bombs: 30
  },
  {
    id: "Level 9",
    targetTypes: ["birdPinkStripes", "birdGreenBlack"],
    goals: [
      {
        type: "birdPink",
        amount: 3
      }
    ],
    initialTargetAmount: 30,
    spawnNew: false,
    instructionsText: "Find these birds:",
    bombs: 10
  },
  {
    id: "Level 10",
    targetTypes: [
      "birdRedHat",
      "birdYellow",
      "birdPink",
      "birdGreenBlack",
      "birdWhiteChick",
      "birdPunk",
      "birdPinkStripes",
      "birdBlueHat",
      "birdBlue"
    ],
    initialTargetAmount: 10,
    spawnNew: true,
    instructionsText: "Shoot all birds!",
    bombs: 100
  }
];

export default levels;
