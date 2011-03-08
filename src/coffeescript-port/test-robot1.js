(function() {
  var TestRobot1, tr;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  importScripts('base-robot.js');
  TestRobot1 = (function() {
    function TestRobot1() {
      TestRobot1.__super__.constructor.apply(this, arguments);
    }
    __extends(TestRobot1, BaseRobot);
    TestRobot1.prototype.run = function() {
      return this.move_forwards(10, __bind(function() {
        this.move_backwards(10);
        return this.turn_left(45, __bind(function() {
          return this._run();
        }, this));
      }, this));
    };
    return TestRobot1;
  })();
  tr = new TestRobot1("My first test robot");
}).call(this);
