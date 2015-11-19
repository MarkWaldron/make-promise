/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

var $Promise = function(){
  this.state = "pending";
  this.value = null;
  this.handlerGroups = [];
};

$Promise.prototype.catch = function(errorFn){
  return this.then(null, errorFn);
};

function Handler(successCb, errorCb){
  this.successCb = null;
  this.errorCb = null;
  this.forwarder = new Deferral();
}

$Promise.prototype.then = function(successCb, errorCb){
    var idx = this.handlerGroups.length;

    this.handler = new Handler();

    if(typeof successCb === 'function'){
      this.handler.successCb = successCb;
    };

    if(typeof errorCb === 'function'){
      this.handler.errorCb = errorCb;
    };

    this.handlerGroups[idx] = this.handler;

    if(this.state === "resolved" && this.handlerGroups[idx].successCb !== null){
      this.handlerGroups[idx].successCb(this.value)
    };
    if (this.state === "rejected" && this.handlerGroups[idx].errorCb !== null){
       this.handlerGroups[idx].errorCb(this.value)
     };
     return this.handler.forwarder.$promise;
  };

var Deferral = function(){
  this.$promise = new $Promise();
  var promise = this.$promise;

  this.resolve = function(data){
    if (promise.state === "pending"){
      if(data instanceof $Promise) {
        data.then(function(x){
          promise.value = x;
          promise.state = "resolved";
        })
      } else {
        promise.value = data;
        promise.state = "resolved";
      }
    };
    if(promise.state === "resolved" && promise.handlerGroups.length > 0){
      promise.handlerGroups.forEach(function(handler){
        if (handler.successCb === null) {
          promise.handler.forwarder.resolve(promise.value);
        }
        else {
          try {
            promise.handler.forwarder.resolve(handler.successCb(promise.value));
          }
          catch(error) {
            promise.handler.forwarder.reject(error);
          }
      };
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
        if (handler.errorCb === null) {
            promise.handler.forwarder.reject(promise.value);
          }
          else {
            try {
              promise.handler.forwarder.resolve(handler.errorCb(promise.value));
            }
            catch(error) {
              promise.handler.forwarder.reject(error);
            }
        };
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
