(function() {
  var BaseRobot;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  BaseRobot = (function() {
    function BaseRobot(name) {
      this.name = name != null ? name : "base-robot";
      this.event_counter = 0;
      this.callbacks = {};
      self.onmessage = __bind(function(e) {
        return this.receive(e.data);
      }, this);
      this._run();
    }
    BaseRobot.prototype.move_forwards = function(distance, callback) {
      return this.send({
        "action": "move_forwards",
        "amount": distance
      }, callback);
    };
    BaseRobot.prototype.move_backwards = function(distance, callback) {
      return this.send({
        "action": "move_backwards",
        "amount": distance
      }, callback);
    };
    BaseRobot.prototype.turn_left = function(angle, callback) {
      return this.send({
        "action": "turn_left",
        "amount": angle
      }, callback);
    };
    BaseRobot.prototype.turn_right = function(angle, callback) {
      return this.send({
        "action": "turn_right",
        "amount": angle
      }, callback);
    };
    BaseRobot.prototype.receive = function(msg) {
      var msg_obj;
      msg_obj = JSON.parse(msg);
      switch (msg_obj["action"]) {
        case "callback":
          if (typeof this.callbacks[msg_obj["event_id"]] === "function") {
            return this.callbacks[msg_obj["event_id"]]();
          }
        case "update":
          return 1 + 1;
      }
    };
    BaseRobot.prototype._run = function() {
      return setTimeout(__bind(function() {
        return this.run();
      }, this), 0);
    };
    BaseRobot.prototype.run = function() {
      throw "You need to implement the run() method";
    };
    BaseRobot.prototype.update = function() {};
    BaseRobot.prototype.send = function(msg_obj, callback) {
      var event_id;
      event_id = this.event_counter++;
      this.callbacks[event_id] = callback;
      msg_obj["event_id"] = event_id;
      return postMessage(JSON.stringify(msg_obj));
    };
    return BaseRobot;
  })();
  this.BaseRobot = BaseRobot;
}).call(this);
