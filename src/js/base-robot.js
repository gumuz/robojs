BaseRobot = {
	_callback_counter: 0,
	_callback: {},
	_events: [],
	_progress: 0
	
	move_forward: function(distance, callback) {
		this._events.unshift(function() {
			this._send({
				"signal": "MOVE",
				"distance": distance
			});		
		});
	},
	turn_left: function(angle, callback) {
		this._events.unshift(function() {
			this._send({
			"signal": "ROTATE",
				"angle": -angle
			});		
		});
	},
	/*
	shoot: function() {
		this._send({
			"signal": "SHOOT"
		});
	},
	*/
	_receive: function(msg) {
		var msg_obj = JSON.parse(msg);
		
		switch(msg_obj["signal"]) {
			case "CALLBACK":
				var callbacks = this._callback_status[msg_obj["callback_id"]];				
				if(callbacks) {
					var callback = callbacks[msg_obj["status"]];
					if(callback) {
						callback();
						
					}
					delete this._callback_status[msg_obj["callback_id"]];
				}
				break;
			case "INFO":
				this.arena_width = msg_obj["arena_width"];
				this.arena_height = msg_obj["arena_height"];
				break;
			case "UPDATE":
				this.x = msg_obj["x"];
				this.y = msg_obj["y"];
				break;
			case "RUN":
				this._run();
				break;
		}
	},
	_send: function(msg_obj, callback) {		
		var callback_id = this._callback_counter++;
		msg_obj["callback_id"] = callback_id;
		var msg = JSON.stringify(msg_obj);
		
		this._callback_status[callback_id] = callback;
		
		postMessage(msg);
	},
	
	
	
	_run: function() {
		var base_robot = this;
		this.run();
		/*
		setTimeout(function() {
			base_robot._run();
		}, 1);
		*/
	},
	run: function() {},
}

onmessage = function(e) {
	BaseRobot._receive(e.data);
};

/*
BaseRobot = {
	_callback_counter: 0,
	_callback_status: {},,
	_events: [],
	
	move_forward: function(distance, callback) {
		this._send({
			"signal": "MOVE",
			"distance": distance
		});
	},
	turn_left: function(angle, callback) {
		this._send({
		"signal": "ROTATE",
			"angle": -angle
		});
	},
	move_backward: function(distance, callback) {
		this._send({
			"signal": "MOVE",
			"distance": -distance
		}, callback);
	},
	turn_right: function(angle, callback) {
		this._send({
			"signal": "ROTATE",
			"angle": angle
		}, callback);
	},
	turn_turret_left: function(angle, callback) {
		this._send({
			"signal": "ROTATE_TURRET",
			"angle": -angle
		}, callback);
	},
	turn_turret_right: function(angle, callback) {
		this._send({
			"signal": "ROTATE_TURRET",
			"angle": angle
		}, callback);
	},
	turn_radar_left: function(angle, callback) {
		this._send({
			"signal": "ROTATE_RADAR",
			"angle": -angle
		}, callback);
	},
	turn_radar_right: function(angle, callback) {
		this._send({
			"signal": "ROTATE_RADAR",
			"angle": angle
		}, callback);
	},
	shoot: function() {
		this._send({
			"signal": "SHOOT"
		});
	},
	_receive: function(msg) {
		var msg_obj = JSON.parse(msg);
		
		switch(msg_obj["signal"]) {
			case "CALLBACK":
				var callbacks = this._callback_status[msg_obj["callback_id"]];				
				if(callbacks) {
					var callback = callbacks[msg_obj["status"]];
					if(callback) {
						callback();
						
					}
					delete this._callback_status[msg_obj["callback_id"]];
				}
				break;
			case "INFO":
				this.arena_width = msg_obj["arena_width"];
				this.arena_height = msg_obj["arena_height"];
				break;
			case "UPDATE":
				this.x = msg_obj["x"];
				this.y = msg_obj["y"];
				break;
			case "RUN":
				this._run();
				break;
		}
	},
	_send: function(msg_obj, callback) {		
		var callback_id = this._callback_counter++;
		msg_obj["callback_id"] = callback_id;
		var msg = JSON.stringify(msg_obj);
		
		this._callback_status[callback_id] = callback;
		
		postMessage(msg);
	},
	
	
	
	_run: function() {
		var base_robot = this;
		this.run();
		/*
		setTimeout(function() {
			base_robot._run();
		}, 1);
		*/
	},
	run: function() {},
}

onmessage = function(e) {
	BaseRobot._receive(e.data);
};

*/
