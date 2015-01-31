(function() {
  var AssetsLoader, Battle, Robot, degrees_to_radians, euclid_distance, in_rect;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  AssetsLoader = (function() {
    function AssetsLoader(assets, callback) {
      var name, uri;
      this.assets = assets;
      this.callback = callback;
      this._resources = 0;
      this._resources_loaded = 0;
      for (name in assets) {
        uri = assets[name];
        this._resources++;
        this.assets[name] = new Image();
        this.assets[name].src = uri;
      }
      for (name in assets) {
        uri = assets[name];
        this.assets[name].onload = __bind(function() {
          this._resources_loaded++;
          if (this._resources_loaded === this._resources && typeof this.callback === 'function') {
            return this.callback();
          }
        }, this);
      }
    }
    AssetsLoader.prototype.is_done_loading = function() {
      return this._resources_loaded === this._resources;
    };
    AssetsLoader.prototype.get = function(asset_name) {
      return this.assets[asset_name];
    };
    return AssetsLoader;
  })();
  degrees_to_radians = function(degrees) {
    return degrees * (Math.PI / 180);
  };
  euclid_distance = function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  };
  in_rect = function(x1, y1, x2, y2, width, height) {
    return ((x2 + width) > x1 && x1 > x2) && ((y2 + height) > y1 && y1 > y2);
  };
  Robot = (function() {
    function Robot(x, y, source) {
      this.x = x;
      this.y = y;
      this.source = source;
      this.health = 100;
      this.angle = Math.random() * 360;
      this.turret_angle = Math.random() * 360;
      this.radar_angle = Math.random() * 360;
      this.bullet = null;
      this.events = {};
      this.worker = new Worker(source);
      this.worker.onmessage = __bind(function(e) {
        return this.receive(e.data);
      }, this);
    }
    Robot.prototype.move = function(distance) {
      this.x += distance * Math.cos(degrees_to_radians(this.angle));
      return this.y += distance * Math.sin(degrees_to_radians(this.angle));
    };
    Robot.prototype.turn = function(degrees) {
      return this.angle += degrees;
    };
    Robot.prototype.receive = function(msg) {
      var event;
      event = JSON.parse(msg);
      event["progress"] = 0;
      return this.events["event_id"] = event;
    };
    Robot.prototype.send = function(msg_obj) {
      return this.worker.postMessage(JSON.stringify(msg_obj));
    };
    Robot.prototype.update = function() {
      var event, event_id, _ref;
      _ref = this.events;
      for (event_id in _ref) {
        event = _ref[event_id];
        if (event["amount"] === event["progress"]) {
          this.send({
            "action": "callback",
            "event_id": event["event_id"]
          });
          delete this.events[event_id];
        } else {
          switch (event["action"]) {
            case "move_forwards":
              event["progress"]++;
              this.move(1);
              break;
            case "move_backwards":
              event["progress"]++;
              this.move(-1);
              break;
            case "turn_left":
              event["progress"]++;
              this.turn(-1);
              break;
            case "turn_right":
              event["progress"]++;
              this.turn(1);
          }
        }
      }
      return this.send({
        "action": "update",
        "x": this.x,
        "y": this.y
      });
    };
    return Robot;
  })();
  Battle = (function() {
    function Battle(ctx, width, height, sources) {
      var source;
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.explosions = [];
      this.robots = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = sources.length; _i < _len; _i++) {
          source = sources[_i];
          _results.push(new Robot(Math.random() * this.width, Math.random() * this.height, source));
        }
        return _results;
      }).call(this);
      this.assets = new AssetsLoader({
        "body": 'img/body.png',
        "turret": 'img/turret.png',
        "radar": 'img/radar.png',
        'explosion1-1': 'img/explosion/explosion1-1.png',
        'explosion1-2': 'img/explosion/explosion1-2.png',
        'explosion1-3': 'img/explosion/explosion1-3.png',
        'explosion1-4': 'img/explosion/explosion1-4.png',
        'explosion1-5': 'img/explosion/explosion1-5.png',
        'explosion1-6': 'img/explosion/explosion1-6.png',
        'explosion1-7': 'img/explosion/explosion1-7.png',
        'explosion1-8': 'img/explosion/explosion1-8.png',
        'explosion1-9': 'img/explosion/explosion1-9.png',
        'explosion1-10': 'img/explosion/explosion1-10.png',
        'explosion1-11': 'img/explosion/explosion1-11.png',
        'explosion1-12': 'img/explosion/explosion1-12.png',
        'explosion1-13': 'img/explosion/explosion1-13.png',
        'explosion1-14': 'img/explosion/explosion1-14.png',
        'explosion1-15': 'img/explosion/explosion1-15.png',
        'explosion1-16': 'img/explosion/explosion1-16.png',
        'explosion1-17': 'img/explosion/explosion1-17.png'
      });
    }
    Battle.prototype.run = function() {
      this.send_all({
        "action": "run"
      });
      return this._run();
    };
    Battle.prototype._run = function() {
      this._update();
      this._draw();
      return setTimeout(__bind(function() {
        return this._run();
      }, this), 10);
    };
    Battle.prototype.send_all = function(msg_obj) {
      var robot, _i, _len, _ref, _results;
      _ref = this.robots;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        robot = _ref[_i];
        _results.push(robot.send(msg_obj));
      }
      return _results;
    };
    Battle.prototype._update = function() {
      var robot, _i, _len, _ref, _results;
      _ref = this.robots;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        robot = _ref[_i];
        _results.push(robot.update());
      }
      return _results;
    };
    Battle.prototype._draw = function() {
      var robot, _i, _len, _ref, _results;
      this.ctx.clearRect(0, 0, this.width, this.height);
      _ref = this.robots;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        robot = _ref[_i];
        this.ctx.save();
        this.ctx.translate(robot.x, robot.y);
        this.ctx.rotate(degrees_to_radians(robot.angle));
        this.ctx.drawImage(this.assets.get("body"), -(38 / 2), -(36 / 2), 38, 36);
        this.ctx.rotate(degrees_to_radians(robot.turret_angle));
        this.ctx.drawImage(this.assets.get("turret"), -(54 / 2), -(20 / 2), 54, 20);
        this.ctx.rotate(degrees_to_radians(robot.radar_angle));
        this.ctx.drawImage(this.assets.get("radar"), -(16 / 2), -(22 / 2), 16, 22);
        _results.push(this.ctx.restore());
      }
      return _results;
    };
    return Battle;
  })();
  window.Battle = Battle;
}).call(this);
