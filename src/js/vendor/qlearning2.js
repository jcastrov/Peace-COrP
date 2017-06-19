/* jshint browser: true */

function State(name){
    this.name = name;
    this.actions = {};
    this.actionsList = [];
}

State.prototype.addAction = function (nextState, reward, actionName,qValue){
    let action =  {
        name: actionName === undefined ? nextState : actionName,
        nextState: nextState,
        reward: reward,
        qvalue: qValue
    };
    this.actionsList.push(action);
    this.actions[action.name] = action;
};

State.prototype.randomAction = function(){
     return this.actionsList[~~(this.actionsList.length * Math.random())];
};

function QLearner(gamma,alpha, actions){
    this.alpha = alpha || 0.8;
    this.gamma = gamma || 0.8;
    this.rewards = {};
    this.qvalues = {};
    this.states = {};
    this.statesList = [];
    this.currentState = null;
    this.actions = actions || [];
}


QLearner.prototype.add = function (from, to, reward, actionName) {
    if (!this.states[from]) this.addState(from);
    if (!this.states[to]) this.addState(to);

    this.rewards[from] || (this.rewards[from] = {});
    this.rewards[from][actionName] = reward;

    let blank = {};
    for(let i = 0; i< this.actions.length; i++){
        blank[this.actions[i]] = 0;
    }

    this.qvalues[from] ||  (this.qvalues[from] = blank);
    this.qvalues[to] ||  (this.qvalues[to] = blank);
    let qval = this.qvalues[from][actionName] || 0;

    let qv = ( qval + this.alpha * (reward + this.gamma * (this.optimalFutureValue(to)) - qval));
    //console.log( from  + " || " + to  + " |+| " + qval + " || " + reward + " || "  + this.optimalFutureValue(to) + " || " + qv );
    this.qvalues[from][actionName] = qv;
    this.states[from].addAction(to, reward, actionName,qv);
};

QLearner.prototype.addState = function (name){
    let state = new State(name);
    this.states[name] = state;
    this.statesList.push(state);
    return state;
};

QLearner.prototype.setState = function (name){
    this.currentState = this.states[name];
    return this.currentState;
};

QLearner.prototype.getState = function (){
    return this.currentState && this.currentState.name;
};

QLearner.prototype.randomState = function(){
    return this.statesList[~~(this.statesList.length * Math.random())];
};

QLearner.prototype.optimalFutureValue = function(state){
   let max;
   let i = 0;
  for(let action in this.qvalues[state]) {
        if(i === 0) {
            max = this.qvalues[state][action];
        } else {
            max =  Math.max(max, this.qvalues[state][action]);
        }
       i++;
   }
    return max ;
};

QLearner.prototype.printDump = function(){
    let dump = JSON.stringify(this.qvalues);
    console.log(dump);
    document.getElementById('log').value = dump;

};

QLearner.prototype.learn = function(steps){
    steps = Math.max(1, steps || 0);
    while (steps--){
        this.currentState = this.randomState();
        this.step();
    }
};

QLearner.prototype.bestAction = function(state){

    let stateQvalues = this.qvalues[state] || {};

    let bestAction = null;
    for (let action in stateQvalues){
        if (stateQvalues.hasOwnProperty(action)){
            if (!bestAction){
                bestAction = action;
            } else if ((stateQvalues[action] == stateQvalues[bestAction]) && (Math.random()>0.5)){
                bestAction = action;
            } else if (stateQvalues[action] > stateQvalues[bestAction]){
                bestAction = action;
            }
        }
    }
    return bestAction;
};

QLearner.prototype.knowsAction = function(state, action){
    return (this.qvalues[state] || {}).hasOwnProperty(action);
};

QLearner.prototype.applyAction = function(actionName){
    let actionObject = this.states[this.currentState.name].actions[actionName];
    if (actionObject){
        this.currentState = this.states[actionObject.nextState];
    }
    return actionObject && this.currentState;
};

QLearner.prototype.runOnce = function(state){
    let best = this.bestAction(state);
    let action = this.states[state].actions[best];
    if (action){
        this.currentState = this.states[action.nextState];
    }
    return action && this.currentState;
};


// module.exports = QLearner;
