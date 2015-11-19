/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

var $Promise = function(){
  this.state = "pending";
  this.value = null;
  this.handlerGroups = [];

  this.catch = function(errorFn){
	this.then(null, errorFn);
  }

  this.then = function(successCb, errorCb){
    var idx = this.handlerGroups.length;

    var handler = {
      successCb: null,
      errorCb: null
    };

    if(typeof successCb === 'function'){
      handler.successCb = successCb;
    };

    if(typeof errorCb === 'function'){
      handler.errorCb = errorCb;
    };

    this.handlerGroups[idx] = handler;

    if(this.state === "resolved" && this.handlerGroups[idx].successCb !== null){
      this.handlerGroups[idx].successCb(this.value)
    };
    if (this.state === "rejected" && this.handlerGroups[idx].errorCb !== null){
   	  this.handlerGroups[idx].errorCb(this.value)
   	};
  };
};

var Deferral = function(){
  this.$promise = new $Promise();
  var promise = this.$promise;

  this.resolve = function(data){
    if (promise.state === "pending"){
      promise.value = data;
      promise.state = "resolved";
    };
    if(promise.state === "resolved" && promise.handlerGroups.length > 0){
      promise.handlerGroups.forEach(function(handler){
        handler.successCb(promise.value);
      });
    };
  };

  this.reject = function(data){
    if (this.$promise.state == "pending"){
      this.$promise.value = data;
      this.$promise.state = "rejected";
      // this.$promise.handlerGroups[this.handlerGroups.length].errorCb(data);
    };
    if (promise.state === "rejected"){
    	promise.handlerGroups.forEach(function(handler){
    		handler.errorCb(promise.value);
    	});
    };
  };

};

var defer = function(){
  return new Deferral();
};


/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
