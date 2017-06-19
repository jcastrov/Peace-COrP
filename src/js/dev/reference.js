/* eslint-disable */
function road() {
  /*
  states:
    0. speed=0
    1. speed 0-20
    2. speed 20-40
    3. speed 40-60
    4. speed >60

    actions:
    1. go straight
    2. stop
    3. overtake
    4. slow down
    5. speed up

    rewards should be as follows:
    1. speed 40-60 shoould get 100 points (ivana: was it not just 60? check)
    2. 0-20 and 20-40 should get 0 points
    3. speed 0 should get -100
    4. Crash is the quivalent of crashing (ivana: guess that's stopping, speed of 0)
    5. speed over 60 should get 0 points

    ivana
    6. being in right lane, if not overtaking, ie collision=0 at prev step should get -50
  */


  /*

  3 separate policies

  speed:

    0. speed=0
    1. speed 0-20
    2. speed 20-40
    3. speed 40-60
    4. speed >60


   crashing: - how will the reward for this work? maybe add anotehr state = collided!
    0. time to collision = 0
    1. time to collision = 1
    2. time to collision = 2

  lane:
    0. left (overtaking lane)
    1. right (should be here as standard)

  */

  //this.canvasId  = "canvas";
  this.mapDiv = "map";
  this.scoreId = "score";



  this.timeForFullDistance = 0.005; //in seconds
  this.speedIntervals = 5; //speeds which +/- when speeding up / slowing down


  this.canvasWidth = 100;
  this.canvasHeight = 200;

  this.width = 100;
  this.height = 4;

  this.board = [];
  this.empty = 0;
  this.agent = 1;
  this.carB = 2;
  this.bank = 3;



  this.otherCars = [];
  //this.otherSpeeds = [10,20,30,45];

  this.agentCar = {
    speed: 20,
    averageSpeed: 20, //ivana stats
    stepsOnSpeedLimit: 0, //ivana stats
    stepsWithWrongLane: 0, //ivana stats
    speedSum: 20,//ivana stats
    incoming: false, //is there an incoming car to overtake/crash

    overtaking: false,
    overtakingSteps: 0,
    collisionTime: 0,
    div: document.getElementById("agent"),
    position: {
      line: 1,
      column: 3
    }
  };

  this.actions = [1, 2, 3, 4, 5];

  this.density = 0.17;

  this.score = {};
  this.score[this.empty] = 0;
  this.score[this.carB] = 0;
  this.score[this.bank] = 0;
  this.score[4] = 0;

  this.userAction = undefined;
  this.exploration = 0.05;
  this.canvasContext = undefined;

  this.colorDictionary = {};
  this.colorDictionary[this.agent] = 'blue';
  this.colorDictionary[this.carB] = 'red';
  this.colorDictionary[this.bank] = 'grey';
  this.colorDictionary[this.empty] = 'white';

  this.rewardDictionary = {};
  this.rewardDictionary[this.carB] = -3;
  this.rewardDictionary[this.empty] = 1;
  this.rewardDictionary[this.bank] = -3;

  this.actionDictionary = {};
  this.actionDictionary[1] = "straight";
  this.actionDictionary[2] = "stop";
  this.actionDictionary[3] = "overtake";
  this.actionDictionary[4] = "slow down";
  this.actionDictionary[5] = "speed up";

  this.laneDictionary = {};
  this.laneDictionary[1] = "left";
  this.laneDictionary[2] = "right";

}
otherSpeeds = [20];
var colors = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "Darkorange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen"];
function carB() {
  this.id = Math.floor(Math.random() * (9999 - 999 + 1) + 999);
  this.speed = otherSpeeds[Math.floor(Math.random() * otherSpeeds.length)];
  this.position = 100;
  this.spawnTime = currentTime();
  this.color = colors[Math.floor(Math.random() * colors.length)];

}

road.prototype.currentStateSpeed = function () {
  var state = "";

  if (this.agentCar.speed === 0) {
    state = "speed=0";
  }
  else if (this.agentCar.speed > 0 && this.agentCar.speed < 20)
    state = "speed=0-20";
  else if (this.agentCar.speed >= 20 && this.agentCar.speed < 40)
    state = "speed=20-40";
  else if (this.agentCar.speed >= 40 && this.agentCar.speed < 60)
    state = "speed=40-60";
  else if (this.agentCar.speed == 60)
    state = "speed=60";
  else state = "speed=60+";

  return state;
};

road.prototype.currentStateLane = function () {
  var state = "";

  if (this.agentCar.position.line == 1)
    state = "left";
  else
    state = "right";
  return state;
};

road.prototype.currentStateCollision = function () {
  var state = "";

  for (var i = 0; i < this.otherCars.length; i++) {

    var car = this.otherCars[i];
    dx = Math.round((car.position - this.agentCar.position.column)) * this.timeForFullDistance;
    dv = (this.agentCar.speed - car.speed);

    if (dv !== 0) dt = (Math.round((dx / dv * 200) * 2) / 2);
    else dt = -100;
    traffic = true;

    if (dt > 20)
      dt = "20+";			//eliminate states over 20
    else if (dt > 8)
      dt = Math.round(dt); //reduce the amount of states above 8

  }

  if (!traffic || dt <= 0 || dt >= 3) {
    state = "TimeToCollision=0";
    this.agentCar.collisionTime = 0;
  } else if (dt > 0 && dt < 2) {
    state = "TimeToCollision=1";
    this.agentCar.collisionTime = 1;
  }		//it can still overtake
  else if (dt >= 2 && dt < 3) {
    state = "TimeToCollision=2";
    this.agentCar.collisionTime = 2; //it can still slow down
  } else {
    state = "TimeToCollision=0";
    this.agentCar.collisionTime = 0;
  }
  return state;
};

road.prototype.currentState = function () {
  var state = "";
  /*if(this.agentCar.position.line == 1)
    state+= "Lane=Left";
  else
    state+= "Lane=Right";
  */

  //state += "_Speed="+this.agentCar.speed + "_";

  //traffic lane

  if (this.agentCar.speed === 0) {
    state += "speed=0";
  }
  else if (this.agentCar.speed > 0 && this.agentCar.speed < 20)
    state += "speed=0-20";
  else if (this.agentCar.speed >= 20 && this.agentCar.speed < 40)
    state += "speed=20-40";
  else if (this.agentCar.speed >= 40 && this.agentCar.speed < 60)
    state += "speed=40-60";
  else if (this.agentCar.speed == 60)
    state += "speed=60";
  else state += "speed=60+";

  traffic = false;
  var dt, dx, dv;

  for (var i = 0; i < this.otherCars.length; i++) {

    var car = this.otherCars[i];
    dx = Math.round((car.position - this.agentCar.position.column)) * this.timeForFullDistance;
    dv = (this.agentCar.speed - car.speed);

    if (dv !== 0) dt = (Math.round((dx / dv * 200) * 2) / 2);
    else dt = -100;
    traffic = true;

    if (dt > 20)
      dt = "20+";			//eliminate states over 20
    else if (dt > 8)
      dt = Math.round(dt); //reduce the amount of states above 8
  }

  if (!traffic || dt <= 0 || dt >= 3) {
    state += "TimeToCollision=0";
    this.agentCar.collisionTime = 0;
  } else if (dt > 0 && dt < 2) {
    state += "TimeToCollision=1";
    this.agentCar.collisionTime = 1;
  }		//it can still overtake
  else if (dt >= 2 && dt < 3) {
    state += "TimeToCollision=2";
    this.agentCar.collisionTime = 2; //it can still slow down
  } else {
    state += "TimeToCollision=0";
    this.agentCar.collisionTime = 0;
  }
  //console.log(dx + " || " + dv + " || " + dt + " || " + state );
  return state;
};

road.prototype.randomAction = function () {
  return this.actions[~~(Math.random() * this.actions.length)];
  /* actions:
    1. go straight
    2. stop
    3. overtake
    4. slow down
    5. speed up
  */
};

road.prototype.applyAction = function (action) {
  //action =1 do nothing - go straight
  if (action == 2) {
    //stop
    this.agentCar.speed = 0;
  } else if (action == 3) {
    //overtake...somehow
    this.agentCar.overtaking = true;
    this.agentCar.overtakingSteps = 1;
    this.setPosition(2);
  } else if (action == 4) {
    //slow down
    this.agentCar.speed += -this.speedIntervals;
    if (this.agentCar.speed < 0)
      this.agentCar.speed = 0;
  } else if (action == 5) {
    //speed up
    this.agentCar.speed += this.speedIntervals;
  }

  if (action != 3) {
    this.setPosition(1); //if it's not overtaking move it into the left lane
    game.agentCar.overtaking = false;
  }
};

road.prototype.addMoreCars = function () {
  //only add them to the left lane
  //only add a new car if there isn't already a car on the lane
  if (Math.random() < this.density && this.otherCars.length < 1) {
    this.score[4]++;
    var newCar = new carB();
    document.getElementById(this.mapDiv).innerHTML += "<div class='carB' id='" + newCar.id + "'></div>";
    document.getElementById(newCar.id).style.backgroundColor = newCar.color;
    this.otherCars.push(newCar);
  }
  this.setPosition(this.agentCar.position.line);
};

road.prototype.setPosition = function (line) {
  //set agents position

  line2 = (line + this.height) % this.height; // circular world

  this.agentCar.position.line = line2;

  document.getElementById("agent").style.top = (line2 * (this.canvasHeight / this.height) + 5) + "px";
};

road.prototype.checkIfCrashed = function () {
  if (this.agentCar.position.line == 1) {
    //only if it is in the left lane will we check if it has crashed.
    //otherwise just do nothing

    //if it gets in here it means there is an incoming car??
    for (var i = 0; i < this.otherCars.length; i++) {
      this.agentCar.incoming = true;
      var car = this.otherCars[i];
      var dx = Math.abs(car.position - this.agentCar.position.column);
      if (dx < 8 && car.position >= 0) {
        this.score[this.carB]++;
        //set the speed of the car to 0
        this.agentCar.speed = 0;
        //remove it from the dom
        document.getElementById(this.mapDiv).removeChild(document.getElementById(car.id));
        //remove it from the array
        this.otherCars.splice(i, 1);
        return true;
      }
    }
    return false;
  }
  return false;
};

road.prototype.moveObjectsLeft = function () {
  for (var i = 0; i < this.otherCars.length; i++) {
    var car = this.otherCars[i];
    var dt = currentTime() - car.spawnTime;
    var d = -(((this.agentCar.speed - car.speed) * (dt / (this.timeForFullDistance * 1000)) / 100)) + car.position;

    document.getElementById(car.id).style.left = d + "%";
    car.spawnTime = currentTime();
    car.position = d;

    if (d < -3) { // if it's moved off the map
      //remove it from the HTML
      document.getElementById(this.mapDiv).removeChild(document.getElementById(car.id));
      //remove it from the array
      this.otherCars.splice(i, 1);
    }
  }
};

function currentTime() {
  var d = new Date();
  return d.getTime();
}

//wins the most often as gets reward at most steps - with 0, -50, -100, 200
//do 0, -20, -40, 100 - about even wins with lane, cars slow to generate as lane often wrong but looks promising
road.prototype.calcRewardSpeed = function () {
  var reward = 0;

  //this combination works to teach it to get to 60 and cars getting generated, when run byitself!
  //but keeps crashing/getting to 0, so need to add crash policy
  if (this.agentCar.speed >= 40 && this.agentCar.speed < 60)
    reward = 70;
  else if (this.agentCar.speed >= 20 && this.agentCar.speed < 40)
    reward = 50;
  else if (this.agentCar.speed > 0 && this.agentCar.speed < 20)
    reward = 20;
  else if (this.agentCar.speed > 60)
    reward = -100;
  else if (this.agentCar.speed === 0)
    reward = -100;
  else if (this.agentCar.speed == 60)
    reward = 200;

  /*

if(this.agentCar.speed >=40 && this.agentCar.speed < 60)
    return -20;
  else if(this.agentCar.speed > 20 && this.agentCar.speed < 40)
    return -40;
  else if( this.agentCar.speed > 60)
    return -20;
  else if(this.agentCar.speed == 0)
    return -100;
  else if(this.agentCar.speed == 60)
    return 100;
  else return -60;*/


  /*
  if(this.agentCar.speed >= 0 && this.agentCar.speed < 40)
    reward =0;
  else if(this.agentCar.speed >= 40 && this.agentCar.speed <= 60)
    reward = 0;
  else if( this.agentCar.speed > 60)
    reward = 0;
  else if(this.agentCar.speed == 60)
    return 100;*/

  return reward;
};

road.prototype.calcRewardLane = function (action) {
  var reward = 0;

  //if ((game.agentCar.collisionTime === 0)&&(game.agentCar.position.line == 1)&& (action == 3))
  if ((game.agentCar.position.line == 2) && (action != 3)) {
    reward = -50;
    this.agentCar.stepsWithWrongLane++;
  }
  //didnt have positive reward previously, only punishment, but guess need something to make it competitive with speed?
  else reward = 30;
  //with 100, always neds up winning, with 0 always stuck in the wrong lane, with 50, always wins and speed never does!
  //with 1-50, speed stuck at 5, collision keeps wnning, same as with 10 - stuck at action 5, reward -50, but winning ... - weird, car counter increasing but dont see cars? no crashes, but in correct lane
  //check that im counting correct/wrong lane correctly???
  //so only one that makes sense is 0 but need to adjust others???

  return reward;
};

//with -100 and 200 collision never wins
//with -100 and 400 wins a few times at the start but then no
//in original seams had -100 if speed 0, so if crashed, nothing if didnt crash

//is there a way to reward it for not crashing but only if collision 1 or 2, or not 0?
//how about only punish -100 if crash but 0 otherwise?  -most q values 0
//crash -100, not 200 - learns ok, but counter increasing even tho no cars seen, but speed 2000 so maybe too fast?
//learnt to select go straight action if there is incoming, and speed up if there isnt ... how is there no crashes then??


//use agentcar.incoming to give reward only if avoids incoming, not free reward if theres no incoming?
//with that and -100, 200, 0 learns to spped up and avoids crashes like that?? or spped stuck at 0. combine with speed??
//when combine spped which worked and this, neither works, never reaches speed limit and crash nearly 100% lol
//try combined but only -100

road.prototype.calcRewardCollision = function (crashed) {
  var reward = 0;
  if (crashed)
    reward = -200;
  else {
    if (game.agentCar.incoming)
      reward = 100; //well done for avoiding the car
    else
      reward = 0; //there was nothing to avoid so no reward

    //return 0; again, didnt have reward before, but guess need something to make it competitive with others?
    //todo: will need to play a lot with balancing different rewards based on relative priorities
  }
  return reward;
};



//3 calcreward functions, for 3 policies

road.prototype.calcReward = function () {
  /* original
  if(this.agentCar.speed >=40 && this.agentCar.speed < 60)
    return 0;
  else if(this.agentCar.speed > 20 && this.agentCar.speed < 40)
    return 0;
  else if( this.agentCar.speed > 60)
    return 0;
  else if(this.agentCar.speed == 0)
    return -100;
  else if(this.agentCar.speed == 60)
    return 100;
  else return 0;*/


  var reward = 0;

  if (this.agentCar.speed >= 40 && this.agentCar.speed < 60)
    return -20;
  else if (this.agentCar.speed > 20 && this.agentCar.speed < 40)
    return -40;
  else if (this.agentCar.speed > 60)
    return -20;
  else if (this.agentCar.speed == 0)
    return -100;
  else if (this.agentCar.speed == 60)
    return 100;
  else return -60;

  //ivana - punish for being in right lane if no danger of collision
  //this.agentCar.collisionTime == 0 //at previous time step
  //need lane for current time step!!! or just if action overtake!!! is action picked at this point yet??? should be
  //if in the wrong lane and not overtaking, get that from current state, is state calc here correctly already? check
  //if ((this.agentCar.collisionTime == 0) && (this.agentCar.action==3))//CANT SEE ACTION HERE!
  //reward=reward-50;

  return reward;

  //return 100;

  /*
  rewards should be as follows:
    1. speed 40-60 shoould get 100 points
    2. 0-20 and 20-40 should get 0 points
    3. speed 0 should get -100
    4. Crash is the quivalent of crashing
    5. speed over 60 should get 0 points
  */
};

var game = new road();
var learner = new QLearner(0.1, 0.1, game.actions);

var learnerSpeed = new QLearner(0.1, 0.1, game.actions);
var learnerLane = new QLearner(0.1, 0.1, game.actions);
var learnerCollision = new QLearner(0.1, 0.1, game.actions);

//learner only has actions, where does it get states from? states should be different per learner!!
//id gets them in "add" method, every time a new state is encountered?
//just need to partition states in 2, then 3 now
//states - speed, time to crash, lane . lane currently not so work with first 2 first, and test.  then build 3rd one?

//Meassure how many times are each of the policies used
var policies = [0, 0, 0];

//3 q learners for 3 policies, 3 w learners for 3 policies

//new wlearning learner - needed only if have multiple q learners
var wlearner = new WLearner(0.1, 0.1);

var wlearnerSpeed = new WLearner(0.1, 0.1);
var wlearnerLane = new WLearner(0.1, 0.1);
var wlearnerCollision = new WLearner(0.1, 0.1);

var log = "Current State, Next State, Reward, Action \n";

var curTime = currentTime();
document.getElementById('log2').value += "Time, Current State,Next State, Lane [L/R], Current Speed, Time To Collision, Action ,Action Key, Reward , QValue \n";
document.getElementById('log3').value += "Time, Step, Crashed Cars, Total Cars, Percentage, Steps on Speed Limit, Percentage Steps, Steps in OK lane <br /> \n";

var steps = 0;
function step() {
  steps++;

  //reset
  game.agentCar.incoming = false;

  //ivana update stats
  game.agentCar.averageSpeed = game.agentCar.speedSum / steps;
  if ((game.agentCar.speed == 60) || (game.agentCar.speed == 65))
    game.agentCar.stepsOnSpeedLimit++;

  if (game.agentCar.overtaking) {
    if (game.agentCar.overtakingSteps < 0) {
      //game.setPosition(1);
      game.agentCar.overtaking = false;
    }
    game.agentCar.overtakingSteps--;

  }

  var currentSpeed = game.agentCar.speed;
  var currentState = game.currentState();

  //3 different states

  var currentStateSpeed = game.currentStateSpeed();
  var currentStateLane = game.currentStateLane();
  var currentStateCollision = game.currentStateCollision();

  var randomAction = game.randomAction();

  //get 3 actions from 3 learners
  var action = learner.bestAction(currentState);

  var actionSpeed = learnerSpeed.bestAction(currentStateSpeed);
  var actionLane = learnerLane.bestAction(currentStateLane);
  var actionCollision = learnerCollision.bestAction(currentStateCollision);

  //testing individual ones
  var actions = [actionSpeed, actionLane, actionCollision];
  //get 3 w-values from 3 learners
  //var actions = [actionSpeed,]
  //var actions = [actionCollision];
  //var actions = [actionSpeed,actionCollision];


  //for each action suggested by each q learner, need to get corresponding w value for the current state in wlearner
  var stateWValue = wlearner.getWForState(currentState);
  //learn q-values before even starting with w-values, to get to explore wide range of states?
  //if steps < x, have policy steps mod 3 select action, if steps > x, do w-learning?
  var stateSpeedWValue;
  var stateLaneWValue;
  var stateCollisionWValue;
  var speedWinner = false;
  var laneWinner = false;
  var collisionWinner = false;
  var max = -1;
  var maxIndex = -1;

  if (steps > 500) {

    //if (steps > 1000) {

    stateSpeedWValue = wlearnerSpeed.getWForState(currentStateSpeed);
    stateLaneWValue = wlearnerLane.getWForState(currentStateLane);
    stateCollisionWValue = wlearnerCollision.getWForState(currentStateCollision);

    //TODO: SELECT WINNER, KEEP TRACK OF WINNER,
    //get highest value, get that action, assign it to action
    speedWinner = false;
    laneWinner = false;
    collisionWinner = false;

    var Wvalues = [stateSpeedWValue, stateLaneWValue, stateCollisionWValue];

    //testing only with 2 policies, speed and collision
    //var Wvalues = [stateSpeedWValue, stateCollisionWValue];

    //testing only with speed, so basically q-learning speed only??
    //var Wvalues = [stateSpeedWValue];

    //testing only with collision, so q-learning collision only
    //var Wvalues = [stateCollisionWValue];

    //find max w-values
    max = Wvalues[0];

    maxIndex = 0;

    for (var i = 1; i < Wvalues.length; i++) {
      if (Wvalues[i] >= max) {
        maxIndex = i;
        max = Wvalues[i];
      }
    }

    //get action with max w  value to execute
    action = actions[maxIndex];

    //TODO: if the above line in, cars dont get generated. maybe action null or non existent, so overriding it temporarily
    //TODO: REMOVE
    //action = learner.bestAction(currentState);
    if (maxIndex === 0) {
      speedWinner = true;
      console.log("WON SPEED");
      policies[0] += 1;
    } else if (maxIndex == 1) {
      laneWinner = true;
      console.log("WON LANE");
      policies[1] += 1;
    } else if (maxIndex == 2) {
      collisionWinner = true;
      console.log("WON COLLISION");
      policies[2] += 1;
    }

    if (action === null || action === undefined || (!learner.knowsAction(currentState, randomAction) && Math.random() < game.exploration)) {
      action = randomAction;
    }

    action = Number(action);

  }//end if steps > x, otherwise only learn q, let speed pick action, but all are updated...
  /*	else if (steps > 500) {//over 500 steps, learn w values, have winners take turns
  	
      stateSpeedWValue = wlearnerSpeed.getWForState(currentStateSpeed);
      stateLaneWValue = wlearnerLane.getWForState(currentStateLane);
      stateCollisionWValue = wlearnerCollision.getWForState(currentStateCollision);

      //TODO: SELECT WINNER, KEEP TRACK OF WINNER,
      //get highest value, get that action, assign it to action
      speedWinner=false;
      laneWinner=false;
      collisionWinner=false;

      var Wvalues = [stateSpeedWValue, stateLaneWValue, stateCollisionWValue];

      //testing only with 2 policies, speed and collision
      //var Wvalues = [stateSpeedWValue, stateCollisionWValue];

      //testing only with speed, so basically q-learning speed only??
      //var Wvalues = [stateSpeedWValue];

      //testing only with collision, so q-learning collision only
      //var Wvalues = [stateCollisionWValue];

      //find max w-values
      max = Wvalues[0];

      maxIndex = steps%3; //0, 1 or 2, take turns having the winner
    	
      //get action with max w  value to execute
      action = actions[maxIndex];

      //TODO: if the above line in, cars dont get generated. maybe action null or non existent, so overriding it temporarily
      //TODO: REMOVE
      //action = learner.bestAction(currentState);
      if (maxIndex === 0) {
          speedWinner=true;
          console.log("WON SPEED");
          policies[0] += 1;
      } else if (maxIndex == 1) {
          laneWinner=true;
          console.log("WON LANE");
          policies[1] += 1;
      } else if (maxIndex == 2) {
          collisionWinner=true;
          console.log("WON COLLISION");
          policies[2] += 1;
      }

      if(action === null || action === undefined || (!learner.knowsAction(currentState, randomAction) && Math.random() < game.exploration)){
        action = randomAction;
      }

      action = Number(action);
  	
  	
    }*/
  else { //under 500 steps, learn q values only, take turns picking actions

    if (steps % 2 === 0)
      action = actionSpeed; //if comment this out then using best action from generic learner ...
    else if (steps % 2 === 1)
      action = actionCollision;
    else
      sction = actionLane;

    if (action === null || action === undefined || (!learner.knowsAction(currentState, randomAction) && Math.random() < game.exploration)) {
      action = randomAction;
    }
    action = Number(action);
  }

  //check collision time and lane BEFORE applying action!
  var wrongOvertake = false;
  if ((game.agentCar.collisionTime === 0) && (game.agentCar.lane = "left"))
    wrongOvertake = true;

  game.applyAction(action);

  game.moveObjectsLeft();

  //check if it has crashed - shouldnt be called twice, as then updates crashes twice?? so save the value here!
  var crash = game.checkIfCrashed();

  //get all 3 of these to pass to add methods

  var nextState = game.currentState();
  var reward = game.calcReward();//both state and action picked here already, good

  var nextStateSpeed = game.currentStateSpeed();
  var rewardSpeed = game.calcRewardSpeed();//both state and action picked here already, good

  var nextStateLane = game.currentStateLane();
  var rewardLane = game.calcRewardLane();//both state and action picked here already, good

  var nextStateCollision = game.currentStateCollision();
  var rewardCollision = game.calcRewardCollision(crash);//both state and action picked here already, good
  //so should know if crashed already by above!

  //there should be 3 separate updates of these, well 3 of q, and 2 looser ones of w-values

  //when this changes to multiple policies, MAKE SURE ALL LEARNERS ARE UPDATING THE ACTUAL EXECTUTED ACTION, NOT SELECTED/NOMINATED ONE
  learner.add(currentState, nextState, reward, action);

  learnerSpeed.add(currentStateSpeed, nextStateSpeed, rewardSpeed, action);
  learnerLane.add(currentStateLane, nextStateLane, rewardLane, action);
  learnerCollision.add(currentStateCollision, nextStateCollision, rewardCollision, action);

  if (steps > 500) {

    //wlearning wlearner here needs to be "added" - this updates the w value for previous one but ONLY if lost competition!!!
    wlearner.add(currentState, nextState, reward, learner.optimalFutureValue(currentState), learner.optimalFutureValue(nextState));

    //TODO: allow ifs back to UPDATE ONLY LOSERS!
    wlearnerSpeed.add(currentStateSpeed, nextStateSpeed, rewardSpeed, learnerSpeed.optimalFutureValue(currentStateSpeed), learnerSpeed.optimalFutureValue(nextStateSpeed), !speedWinner);
    wlearnerLane.add(currentStateLane, nextStateLane, rewardLane, learnerLane.optimalFutureValue(currentStateLane), learnerLane.optimalFutureValue(nextStateLane), !laneWinner);
    wlearnerCollision.add(currentStateCollision, nextStateCollision, rewardCollision, learnerCollision.optimalFutureValue(currentStateCollision), learnerCollision.optimalFutureValue(nextStateCollision), !collisionWinner);
  }

  // parameters from q-learner that were needed to pass above:
  //1. what q value did its old suggestions have ie what it would have gotten if respected (so best q value it had in the old state??)
  //2, best q value in the next state
  //learner.optimalFutureValue(from);
  //learner.optimalFutureValue(to);

  //var logData = currentState + "," + nextState + "," + reward + "," + action
  //log+= logData + "\n";

  // move all 3 learners to next state

  //todo: remove main joint learner when everything done

  learner.runOnce(currentState);

  learnerSpeed.runOnce(currentStateSpeed);
  learnerLane.runOnce(currentStateLane);
  learnerCollision.runOnce(currentStateCollision);

  //wlearning - what does the above do? do i need wlearner equvivalent? moves the qlearning to next state, so guess not?

  game.addMoreCars();
  var stepsInCorrectLane = steps - game.agentCar.stepsWithWrongLane;
  //feedback
  var summary = "<br /> Lane: " + (((game.agentCar.position.line) == 1) ? "Left" : "Right");
  summary += "<br /> Speed: " + game.agentCar.speed;
  summary += "<br /> Steps: " + steps;
  summary += "<br /> Steps on speed limit: " + game.agentCar.stepsOnSpeedLimit;
  summary += "<br /> Steps in correct lane: " + stepsInCorrectLane;
  summary += "<br /> Average speed: " + game.agentCar.averageSpeed;
  summary += "<br /> Policy used [speed, lane, collision]: [" + policies[0] + ", " + policies[1] + ", " + policies[2] + "]";
  summary += "<br /> Action: " + action;
  summary += "<br /> Reward: " + reward;
  summary += "<br /> Incoming car: " + game.agentCar.incoming;

  summary += "<br /> carB: " + game.score[game.carB] + " / " + game.score[4] + " : " + Math.floor((game.score[game.carB] / game.score[4]) * 100) + "%";

  summary += "<br /> <br /> <br /> ";
  summary += "<br /> Current State Speed: " + currentStateSpeed;
  summary += "<br /> Current State Lane: " + currentStateLane;
  summary += "<br /> Current State Collision: " + currentStateCollision;
  summary += "<br />";
  summary += "<br /> Reward Speed: " + rewardSpeed;
  summary += "<br /> Reward Lane: " + rewardLane;
  summary += "<br /> Reward Collision: " + rewardCollision;
  summary += "<br />";
  summary += "<br /> Next State Speed: " + nextStateSpeed;
  summary += "<br /> Next State Lane: " + nextStateLane;
  summary += "<br /> Next State Collision: " + nextStateCollision;
  summary += "<br />";
  summary += "<br /> Suggested action Speed: " + actionSpeed;
  summary += "<br /> suggested action Lane: " + actionLane;
  summary += "<br /> suggected action Collision: " + actionCollision;
  summary += "<br />";
  summary += "<br /> W-value Speed: " + stateSpeedWValue;
  summary += "<br /> W-value Lane: " + stateLaneWValue;
  summary += "<br /> W-value Collision: " + stateCollisionWValue;
  summary += "<br />";
  summary += "<br /> W-value winner index: " + maxIndex;
  summary += "<br /> W-value winner value: " + max;
  summary += "<br /> <br /> <br /> ";

  //need to print rewards for previous state too to check if accurate

  document.getElementById(game.scoreId).innerHTML = summary;

  document.getElementById('log2').value += currentTime() - curTime + "," + currentState + "," + nextState + "," + game.laneDictionary[game.agentCar.position.line] + "," + currentSpeed + "," + game.agentCar.collisionTime + "," + game.actionDictionary[action] + "," + action + "," + reward + "," + learner.qvalues[currentState][action] + '<br /> \n ';
  document.getElementById('log3').value += currentTime() - curTime + "," + steps + "," + game.score[game.carB] + "," + game.score[4] + "," + Math.floor((game.score[game.carB] / game.score[4]) * 100) + "," + game.agentCar.stepsOnSpeedLimit + "," + Math.floor((game.agentCar.stepsOnSpeedLimit / steps) * 100) + stepsInCorrectLane + '<br /> \n ';
}


//---- RUNNING
var sid = setInterval(function () {
  if (steps > 2500) {
    clearInterval(sid);
    return;
  }
  step();
}, 300);
