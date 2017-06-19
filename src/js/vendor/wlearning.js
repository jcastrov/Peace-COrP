function WState(name,wvalue){
    this.name = name;
	this.wvalue=wvalue;

}

function WLearner(gamma,alpha){
    this.alpha = alpha || 0.8;
    this.gamma = gamma || 0.8;
    this.rewards = {};
    this.wvalues = {};
    this.states = {};
    this.statesList = [];
    this.currentState = null;
}

WLearner.prototype.getWForState = function(state){
	return this.wvalues[state];
};

//what, if any, other params do i need?
WLearner.prototype.add = function (from, to, reward, qForLoosingAction, maxQFfromHere, update) {
  if (!this.states[from]) {
	  this.addState(from);
	  this.wvalues[from] = 0;
  }
  if (!this.states[to]) {
	  this.addState(to);
	   this.wvalues[to] = 0;
  }

	var wval = this.wvalues[from] || 0;

  if (update) {
	  var wv = wval + this.alpha * (qForLoosingAction - reward - (this.gamma * maxQFfromHere) - wval);
		this.wvalues[from] = wv;
  }



	/* wlearning formula based on ivana's and adam's code:

	 wTable.find(previousStateName)->second += (alpha * (qForCurrentStateLoosingAction - reward - (gamma * maxQForCurrentState) - wTable.find(previousStateName)->second

	 qForCurrentStateLoosingAction=what q would have gotten if respected
	 reward = reward it actually got
	 maxQForCurrentState - whats the best q i can get from here (regardless of acton)
	 NEED TO PASS qForCurrentStateLoosingAction (well, old state), and maxQForCurrentState(next state)
	 this.optimalFutureValue(to) is actually max for current state, but dont have access to q vlues here anymore

	*/
};


WLearner.prototype.addState = function (name){
	//adding 0s for default wvalues
    var state = new WState(name,0);
    this.states[name] = state;
    this.statesList.push(state);
    return state;
};

WLearner.prototype.setState = function (name){
    this.currentState = this.states[name];
    return this.currentState;
};

WLearner.prototype.getState = function (){
    return this.currentState && this.currentState.name;
};

WLearner.prototype.randomState = function(){

    return this.statesList[~~(this.statesList.length * Math.random())];
};


WLearner.prototype.printDump = function(){
    var dump = JSON.stringify(this.qvalues);
    console.log(dump);
    document.getElementById('log').value = dump;

};

/*
//action name in qlearner version - is it the action that won/was just taken? yes


    (*it).second.second = (*it).second.second + alpha * (reward + gamma * (this->getBestAction(currentStateName).second) - (*it).second.second);

	//ivana thesis formula max_value is the highet q value for the next state
	current_s_a_wvalue[0]->second += (alpha * (current_s_a_qvalue[0]->second - r - (gamma*max_Qvalue) - current_s_a_wvalue[0]->second));
	//	cout << "formula is alpha * what would have gotten if respected" << current_s_a_qvalue[0]->second << " minus reward " << r << " minus gamma times max q value which is " << max_Qvalue << "minus what currently got "<< current_s_a_wvalue[0]->second << endl;

//adam formula
  wTable->wLearningUpdate(previousState, this->reward->getReward(), qTable->getBestAction(currentState).second, qTable->getQValue(currentState, currentAction)); //update w value	//TODO what q value to use
  void WTable::wLearningUpdate(std::string previousStateName, double reward, double maxQForCurrentState, double qForCurrentStateLoosingAction)

  wTable.find(previousStateName)->second += (alpha * (qForCurrentStateLoosingAction - reward - (gamma * maxQForCurrentState) - wTable.find(previousStateName)->second

to double check:
what is current state - the next one we just transitioned to?
what is find-previous state? the one we're updating?
what is qForCurrentStateLoosingAction? is it actually executed acton at prev step? is highest q in the current(next) state, ie how well can we do from here - do we have that in q formula too?
= the above cant be true? where is the "q/reward that it would have gotten" value then?
have to get it from q learning library as dont have it here, how can it be passed? as a parameter from outside somewhere


*/
