/* eslint-env browser */
/* eslint no-invalid-this: "off" */
/* global Phaser cop Trait */

// =============================================================================
// Table object
// -----------------------------------------------------------------------------
const divLog = document.getElementById("divLog");
const tableLog = document.getElementById("table-log");
tableLog.totalRows = 0;

class Row {
  constructor(table) {
    this.row = table.insertRow(tableLog.totalRows);
    tableLog.totalRows += 1;
    this.cells = 0;
  }
  insertCell(innerHTML = "") {
    const cell = this.row.insertCell(this.cells);
    this.cells += 1;
    cell.innerHTML = innerHTML;

    return cell;
  }
}

const insertRow = (learner, action, reward, state) => {
  const row = new Row(tableLog.getElementsByTagName("tbody")[0]);
  row.insertCell(learner);
  row.insertCell(action);
  row.insertCell(reward);
  row.insertCell(state);
};

// =============================================================================
// Logic local variables
// -----------------------------------------------------------------------------
let road = {};
let cars = {};
let explosions = {};
let mainCar = {};
let game = {};
const settings = {
  set() {
    // Game speed
    game.time.desiredFps = 60;

    // Add arcade Physics system
    game.physics.enable(road, Phaser.Physics.ARCADE);

    // Remove pause when the page lost focus
    game.stage.disableVisibilityChange = true;

    // By default the canvas starts paused
    // game.paused = true;
  },

  pauseScreen: {
    text: {},
    sprite: {},
    onShow() {
      const x = mainCar.sprite.x + game.width / 2 - mainCar.width;
      const y = game.world.centerY - 10;
      this.text = game.add.bitmapText(x, y, "carrier_command", "Paused", 24);
      this.sprite.reset(mainCar.sprite.x - 30, 0);
      this.sprite.visible = true;
    },
    onHide() {
      this.sprite.visible = false;
      this.text.visible = false;
    }
  }
};
const data = {
  currentState: "",
  currentLearner: "",
  currentAction: "",
  states: 0
};

// =============================================================================
// States and rewards
// -----------------------------------------------------------------------------
const getSpeedReward = (speed) => {
  let reward = 0;
  if (speed <= 0 || speed > 60) {
    reward = -100;
  } else if (speed === 60) {
    reward = 200;
  } else if (speed > 0 && speed < 20) {
    reward = 20;
  } else if (speed >= 20 && speed < 40) {
    reward = 50;
  } else {
    reward = 70;
  }

  return reward;
};
const addState = (theLearner) => {
  const isSpeedLearner = mainCar.learners.speed === theLearner;
  const isLaneLearner = mainCar.learners.lane === theLearner;
  const isSameCurrentSpeed = data.currentState !== `s${mainCar.currentSpeed}`;
  const isSameAction = data.currentAction === mainCar.currentAction;
  //const currentLearnerIsSame = data.currentLearner === theLearner;
  // console.log(currentLearnerIsSame);
  if ((isSpeedLearner && isSameCurrentSpeed) || (isLaneLearner && !isSameAction)) {
    if (mainCar.currentSpeed % 5 === 0) {
      const action = mainCar.currentAction;
      const learner = theLearner;
      const reward = getSpeedReward(mainCar.currentSpeed);
      const state = `s${mainCar.currentSpeed}`;
      insertRow(learner, action, reward, state);

      divLog.scrollTop = divLog.scrollHeight;

      data.currentState = `s${mainCar.currentSpeed}`;
      data.currentLearner = theLearner;
      data.currentAction = mainCar.currentAction;
      spans.statesGenerated.innerHTML = Number(spans.statesGenerated.innerHTML) + 1;
    }
  }

};

class Car {
  constructor(color, speed) {
    this.color = color;
    this.speed = speed;
  }
}

class MainCar {
  constructor() {
    this.sprite = {};
    this.speed = 600;
    this.width = 109;
    this.height = 50;
    this.currentAction = "";
    this.currentLane = 2;
    this.actions = {
      goStraight: "Go straight",
      stop: "Stop",
      overtake: "Overtake",
      slowDown: "Slow down",
      speedUp: "Speed up"
    };
    this.learners = {
      speed: "LS",
      lane: "LL",
      collision: "LC"
    };
  }

  get currentSpeed() {
    return ~~(this.sprite.body.velocity.x / 10);
  }

  onValuesUpdated() { }

  createSprite() {
    // Main car
    this.sprite = game.add.sprite(road.laneX, road.lane2Y, "car1");
    game.physics.arcade.enable(this.sprite);
    // this.sprite.body.immovable = true;
    // this.sprite.body.velocity.x = 0;

    // // Fixes the camera for main car
    // game.camera.follow(this.sprite);
    // game.camera.focusOnXY(0, this.sprite.y);
  }

  // If the main car collides with any car, triggers this event
  onCollide(pMainCar, pCar2) {
    const explosion = explosions.getFirstExists(false);

    // Show the effect stopped
    explosion.reset(pCar2.x, pCar2.y + 25);

    // Play the effect
    explosion.play("kaboom", 60, false, true);

    // Remove near car sprite
    pCar2.kill();

    cars.totalCrashed += 1;
    cars.onTotalCrashed();

    // Stops the main car
    mainCar.stop();
  }
  accelerate(speed) {
    mainCar.sprite.body.velocity.x += speed;
    mainCar.onValuesUpdated();
  }
  decelerate(speed) {
    mainCar.sprite.body.velocity.x -= speed;
    if (mainCar.sprite.body.velocity.x < 20) {
      mainCar.sprite.body.velocity.x = 20;
    }
    mainCar.onValuesUpdated();
  }
  stop() {
    mainCar.sprite.body.velocity.x = 0;
  }
  turning(y, onComplete) {
    const tween = game.add.tween(mainCar.sprite);
    tween.frameBased = true;
    tween.to({ y }, 1250, "Quart.easeOut");
    tween.onComplete.add(onComplete, this);
    tween.start();
  }
  turnLeft() {
    mainCar.currentLane = 1;
    mainCar.onValuesUpdated();
    const onComplete = () => { };
    this.turning(road.lane1Y, onComplete);
  }
  turnRight() {
    mainCar.currentLane = 2;
    mainCar.currentAction = mainCar.actions.goStraight;
    mainCar.onValuesUpdated();

    const onComplete = () => { };
    this.turning(road.lane2Y, onComplete);
  }
}
mainCar = new MainCar();

road = {
  sprites: [],
  width: 223,
  height: 133,
  laneX: 20,
  lane1Y: 7,
  lane2Y: 72,
  counter: 0,
  createSprites() {
    // The quantity of iterations is how many times
    // the picture fits in the world
    const picIterations = Math.ceil(game.world.width / this.width + 1);

    // In a for add the sprites in an array
    for (let i = 0; i < picIterations; i += 1) {
      const sprite = game.add.sprite(i * this.width, 0, "road");
      this.sprites.push(sprite);
    }
  },
  addSprite() {
    if (mainCar.sprite.x - 30 > this.width * (this.counter + 1)) {
      const totalSprites = this.sprites.length;

      // If the length of the array is reached, restart to 0
      const i = this.counter % totalSprites;

      // Remove passed sprite
      this.sprites[i].kill();

      // Add the removed sprite to the road
      this.sprites[i].reset((this.counter + totalSprites) * this.width, 0);

      this.counter += 1;
    }
  }
};

cars = {
  group: {},
  types: [
    new Car("red", 0),
    new Car("orange", 20),
    new Car("yellow", 25),
    new Car("green", 30),
    new Car("cyan", 35),
    new Car("blue", 40),
    new Car("indigo", 45),
    new Car("magenta", 50)],
  accelerateLoop: {},

  totalGenerated: 0,
  onTotalGenerated() { },

  totalCrashed: 0,
  onTotalCrashed() { },

  // Events
  onOutOfBounds(car) {
    if (mainCar.sprite.x > car.x) {
      car.kill();

      // mainCar.decelerate();
      mainCar.turnRight();

      cars.add();
    }
  },
  // Actions
  createSprites() {
    // Create cars group
    const group = game.add.group();
    group.enableBody = true;
    group.physicsBodyType = Phaser.Physics.ARCADE;
    for (let i = 2; i <= this.types.length; i += 1) {
      const newCar = group.create(0, 0, `car${i}`, [0], false);
      const car = this.types[i - 1];
      newCar.color = car.color;
      newCar.checkWorldBounds = true;
      newCar.events.onOutOfBounds.add(this.onOutOfBounds, newCar);
      newCar.speed = car.speed * 10;
    }
    this.group = group;
  },
  add() {
    const x = game.world.width + mainCar.sprite.x;
    const y = road.lane2Y;

    const newCar = this.group.children[~~(Math.random() * 7)];
    if (newCar) {
      newCar.reset(x, y);
      newCar.body.velocity.x = newCar.speed;
    }

    this.totalGenerated += 1;
    cars.onTotalGenerated(this.totalGenerated);

    // Create a random car. There are 7 differt other cars.
    // Plus 2 because car1 exists as the main car
    // const carId = ~~(Math.random() * 7) + 2;
  },
  addAsLoop(time) {
    game.time.events.loop(time, cars.add, cars);
  },
  remove() {
    // If the car is still accelerating, remove the event
    game.time.events.remove(this.accelerateLoop);

    // slow the main car
    mainCar.speed = 100;

    // Each 250ms the main car accelerates until 60km/h
    this.accelerateLoop = game.time.events.loop(250, () => {
      if (mainCar.speed < 600) {
        mainCar.speed += 100;
      }
    }, this);
  }
};

const mainState = {
  // Get assets url
  preload() {
    // =========================================================================
    // Images
    // =========================================================================
    game.load.image("blackbg", "blackbg.jpg");
    game.load.image("road", "street1.jpg");
    for (let i = 1; i <= cars.types.length; i += 1) {
      game.load.image(`car${i}`, `car${i}.png`);
    }

    // =========================================================================
    // Spritesheets
    // =========================================================================
    game.load.spritesheet("kaboom", "explode.png", 128, 128);

    // =========================================================================
    // Fonts
    // =========================================================================
    const fontName = "carrier_command";
    game.load.bitmapFont(fontName, `${fontName}.png`, `${fontName}.xml`);
  },

  // Create initial objects
  create() {
    settings.set();
    // =========================================================================
    // Sprites creation
    // =========================================================================

    // Create road
    road.createSprites();

    // Create cars group
    cars.createSprites();

    // Create main car sprite
    mainCar.createSprite();

    mainCar.currentAction = mainCar.actions.speedUp;
    mainCar.currentLane = 2;
    mainCar.onValuesUpdated();

    // Create collide effect
    explosions = game.add.group();
    const explosion = explosions.create(0, 0, "kaboom", [0], false);
    explosion.anchor.setTo(0.5, 0.5);
    explosion.animations.add("kaboom");

    settings.pauseScreen.sprite = game.add.sprite(0, 0, "blackbg");
    settings.pauseScreen.sprite.alpha = 0.75;
    settings.pauseScreen.sprite.visible = false;

    game.onPause.add(settings.pauseScreen.onShow, settings.pauseScreen);
    game.onResume.add(settings.pauseScreen.onHide, settings.pauseScreen);
  },

  // This function is executed all time and repeats many times in a second
  update() {
    // Add a road sprite at the end of the road
    road.addSprite();

    // Adding a state
    // if (mainCar.currentSpeed % 5 === 0) {
    //   // Dont add repeated previous state
    //   if (data.currentState !== `s${mainCar.currentSpeed}`) {
    //     let action = mainCar.actions.speedUp;
    //     if (mainCar.currentSpeed === 0) {
    //       action = mainCar.actions.stop;
    //     } else if (mainCar.currentSpeed === 60) {
    //       action = mainCar.actions.goStraight;
    //     }
    //     const learner = mainCar.learners.speed;
    //     const reward = getSpeedReward(mainCar.currentSpeed);
    //     const state = `s${mainCar.currentSpeed}`;
    //     insertRow(learner, action, reward, state);

    //     divLog.scrollTop = divLog.scrollHeight;

    //     data.currentState = `s${mainCar.currentSpeed}`;
    //     spans.statesGenerated.innerHTML =
    //        Number(spans.statesGenerated.innerHTML) + 1;
    //   }
    // }


    // Adjust the size of the world according to the position of the main car
    game.world.setBounds(mainCar.sprite.x, 0, game.width, game.height);

    // All cars must collide
    const { arcade } = game.physics;
    arcade.collide(mainCar.sprite, cars.group, mainCar.onCollide);
    arcade.collide(cars.group, cars.group);

    const accelerate = () => {
      // Only add a new state when speed is divisible by 5
      addState(mainCar.learners.speed);

      mainCar.currentAction = mainCar.actions.speedUp;
      mainCar.accelerate(2);
    };

    if (mainCar.currentSpeed === 0) {
      mainCar.currentAction = mainCar.actions.stop;
      addState(mainCar.learners.speed);
      mainCar.onValuesUpdated();
      const timer = game.time.create(false);
      timer.add(1000, () => mainCar.accelerate(2), this);
      timer.start();
    }
    else if (mainCar.currentLane === 2) {
      // Get NPC Car
      const nextCar = cars.group.getFirstAlive();

      // If NPC car exists
      if (nextCar) {
        let distance = arcade.distanceBetween(mainCar.sprite, nextCar);
        distance -= mainCar.width;
        if (distance < 300) {
          mainCar.currentAction = mainCar.actions.slowDown;
          mainCar.decelerate(2);
          if (mainCar.currentSpeed % 5 === 0) {
            addState(mainCar.learners.speed);
          }
          mainCar.onValuesUpdated();
        }
        else if (distance < 500) {
          mainCar.currentAction = mainCar.actions.overtake;
          addState(mainCar.learners.lane);
          mainCar.onValuesUpdated();
          mainCar.turnLeft();
        }
        else if (mainCar.currentSpeed > 0 && mainCar.currentSpeed < 60) {
          accelerate();
        }
      }
      // If not exists and the main car speed is under 60 km/h, accelerate
      else if (mainCar.currentSpeed > 0 && mainCar.currentSpeed < 60) {
        accelerate();
      }
      // If not exists and the main car is 60 km/h
      else {
        // Add a new car
        cars.add();

        mainCar.currentAction = mainCar.actions.goStraight;
        addState(mainCar.learners.speed);
        mainCar.onValuesUpdated();
      }
    }
  },

  render() {
    // const zone = game.camera.deadzone;

    // game.debug.cameraInfo(game.camera, 32, 32);
    // game.debug.spriteCoords(mainCar.sprite, 500, 32);
  }
};

window.onload = () => {
  const width = 980;
  const { height } = road;
  const id = "mainCanvas";
  game = new Phaser.Game(width, height, Phaser.AUTO, id);
  game.state.add("main", mainState);
  game.state.start("main");
};





// Buttons
const btnPlay = document.getElementById("btnPlay");
const btnPause = document.getElementById("btnPause");

// Spans
const spans = {
  currentAction: document.getElementById("spanCurrentAction"),
  currentLane: document.getElementById("spanCurrentLane"),
  currentSpeed: document.getElementById("spanCurrentSpeed"),
  nextCarColor: document.getElementById("spanNextCarColor"),
  statesGenerated: document.getElementById("spanStatesGenerated"),
  carsGenerated: document.getElementById("spanCarsGenerated"),
  carsCrashed: document.getElementById("spanCarsCrashed")
};


// Events
cars.onTotalGenerated = (total) => {
  spans.carsGenerated.innerHTML = total;
};
cars.onTotalCrashed = () => {
  spans.carsCrashed.innerHTML = cars.totalCrashed;
};
mainCar.onValuesUpdated = () => {
  spans.currentAction.innerHTML = mainCar.currentAction;
  spans.currentLane.innerHTML = mainCar.currentLane;

  const speed = mainCar.currentSpeed;
  spans.currentSpeed.innerHTML = `${speed} km/h`;
};


btnPlay.onclick = () => {
  // Visual buttons behavior
  btnPlay.style.display = "none";
  // btnDebug.setAttribute("disabled", "");
  btnPause.style.display = "inline-block";

  // Unpause canvas
  game.paused = false;
};

btnPause.onclick = () => {
  // Visual buttons behavior
  btnPlay.style.display = "inline-block";
  // btnDebug.removeAttribute("disabled");
  btnPause.style.display = "none";

  game.paused = true;
};




// TO DO











const contexts = false;
if (contexts) {
  const lane1 = new cop.Context({ name: "RightLane" });
  const lane1Behavior = new Trait({
    applyAction(action) {
      if (action !== 3) {
        // if it's not overtaking move it into the right lane
        this.setPosition(1);
        game.agentCar.overtaking = false;
      }
    }
  });
  lane1.adapt(game, lane1Behavior);

  const speed020 = new cop.Context({ name: "0-20Speed" });
  const speed2040 = new cop.Context({ name: "20-40Speed" });
  const speed4060 = new cop.Context({ name: "40-60Speed" });
  const speedUpBehavior = new Trait({
    applyAction(action) {
      //speedUp
      this.agentCar.speed += this.speedIntervals;
    }
  });
  speed020.adapt(game, speedUpBehavior);
  speed2040.adapt(game, speedUpBehavior);
  speed4060.adapt(game, speedUpBehavior);

  const overSpeed = new cop.Context({ name: "OverSpeed" });
  const SlowDownBehavior = new Trait({
    applyAction(action) {
      // slowDown
      this.agentCar.speed += -this.speedIntervals;
      if (this.agentCar.speed < 0) {
        this.agentCar.speed = 0;
      }
    }
  });
  overSpeed.adapt(game, SlowDownBehavior);

  const Overtake = new cop.Context({ name: "Overtake" });
  const OvertakeBehavior = new Trait({
    applyAction(action) {
      //overtake
      this.agentCar.overtaking = true;
      this.agentCar.overtakingSteps = 1;
      this.setPosition(2);
    }
  });
  Overtake.adapt(game, OvertakeBehavior);

  const Stop = new cop.Context({ name: "Stop" });
  const StopBehavior = new Trait({
    applyAction(action) {
      //stop
      this.agentCar.speed = 0;
    }
  });
  Stop.adapt(game, StopBehavior);

  // Mini tests
  game.setPosition(2);

  // sppedUp
  game.applyAction(5);
  lane1.activate();

  // sppedUp / should change lanes
  game.applyAction(5);
  lane1.deactivate();

  // var policyCounts = [0, 0, 0];

  /* RUN
  var sid = setInterval(function() {
    //clearInterval(sid);
    //return;
    step();
  }, 300);
  */
}

// document.getElementById("increaseSpeed").onclick = () => {
//   const jaja = ~~(Math.random() * 7) + 2;
//   document.getElementById("roadSpeed").innerHTML = jaja;
// };
