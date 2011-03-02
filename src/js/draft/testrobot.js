importScripts('jquery-hive/jquery.hive.pollen.js');

var callbacks = {};
var callback_id_counter = 0;

function send(msg, callback) {
	var callback_id = callback_id_counter++;
	callbacks[callback_id] = callback;
	
	msg["CALLBACK_ID"] = callback_id;
	$.send(msg);
}

$.receive(function(message) {
	var callback_id = message["CALLBACK_ID"];
	var callback = callbacks[callback_id];
	if(callback!==undefined) {
		callback();
		delete callbacks[callback_id]
	};
});

(function run() {
	send({
		"CMD": "MOVE_FORWARD",
		"DISTANCE": 20
	}, function() {
		send({
			"CMD": "SHOOT"
		});
		send({
			"CMD": "MOVE_FORWARD",
			"DISTANCE": 40
		});
		send({
			"CMD": "ROTATE",
			"ANGLE": 45
		}, function() {
			send({
				"CMD": "MOVE_FORWARD",
				"DISTANCE": 20
			}, function() {
				send({
					"CMD": "ROTATE",
					"ANGLE": -90
				}, run);	
			});
		});
	});
	
})();
	
// });
