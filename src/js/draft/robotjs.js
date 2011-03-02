$(document).ready(function(){
	var canvas = $("#canvas");
	var ctx = canvas[0].getContext("2d");
	
	var robots = [
		{
			"name": "robot1",
			"x": 100,
			"y": 100,
			"events": [],
			"direction": 0
		}
	];
	
	var bullets = [];
	
	var robot_speed = 1;
	var bullet_speed = 3;
	
	function degree2radian(a) {
    	return a * 0.017453292519;
    }
	
	function draw() {
		ctx.clearRect(0,0,800,600);
		
		for(var i=0; i<bullets.length; i++) {
			var bullet = bullets[i];
			
			ctx.save();
			ctx.translate(bullet["x"],bullet["y"]);
			ctx.fillRect(-3,-3,6,6);
			ctx.restore();
			
			bullet["x"] += bullet_speed * Math.cos(degree2radian(bullet["direction"]));
			bullet["y"] += bullet_speed * Math.sin(degree2radian(bullet["direction"]));
			
		}
		
		for(var i=0; i<robots.length; i++) {
			var robot = robots[i];
			ctx.save();
			ctx.translate(robot["x"],robot["y"]);
			ctx.rotate(degree2radian(robot["direction"]));
			ctx.fillRect(-10,-10,20,20);
			ctx.fillStyle = "#FF0000";
			ctx.fillRect(8,-10,2,20);
			ctx.restore();
			
			var event = robot["events"].pop();
			if (event === undefined) continue;
			
			switch(event["EVENT"]["CMD"]) {
				case "SHOOT":
					var bullet = {
						"x": robot["x"],
						"y": robot["y"],
						"direction": robot["direction"]
					};
					bullets.unshift(bullet);
					break;
				case "ROTATE":
					if(event["PROGRESS"]<Math.abs(event["EVENT"]["ANGLE"])){
						robot["direction"] += (event["EVENT"]["ANGLE"]>0?1:-1);
						event["PROGRESS"]++;
						robot["events"].unshift(event);
					} else {
						var worker = $.Hive.get(event["WORKER_ID"]);
						worker[0].send({"STATUS": "DONE", "CALLBACK_ID": event["EVENT"]["CALLBACK_ID"]});
					}
					break;
				case "MOVE_BACKWARD":
					if(event["PROGRESS"]<event["EVENT"]["DISTANCE"]){
						robot["x"] += (robot_speed*-1) * Math.cos(degree2radian(robot["direction"]));
						robot["y"] += (robot_speed*-1) * Math.sin(degree2radian(robot["direction"]));
						event["PROGRESS"]++;
						robot["events"].unshift(event);
					} else {
						var worker = $.Hive.get(event["WORKER_ID"]);
						worker[0].send({"STATUS": "DONE", "CALLBACK_ID": event["EVENT"]["CALLBACK_ID"]});
					}
					break;
				case "MOVE_FORWARD":
					if(event["PROGRESS"]<event["EVENT"]["DISTANCE"]){
						robot["x"] += robot_speed * Math.cos(degree2radian(robot["direction"]));
						robot["y"] += robot_speed * Math.sin(degree2radian(robot["direction"]));
						event["PROGRESS"]++;
						robot["events"].unshift(event);
					} else {
						var worker = $.Hive.get(event["WORKER_ID"]);
						worker[0].send({"STATUS": "DONE", "CALLBACK_ID": event["EVENT"]["CALLBACK_ID"]});
					}
					break;
			}
		}
	}
	
	setInterval(draw, 5);
	
	$.Hive.create({
		worker: ['js/testrobot.js'],
		receive: function (data) {
			console.group('RECEIVED MESSAGE - WORKER: #' + data._from_);
			console.log( data );  
			console.groupEnd();   
			
			robots[0]["events"].push({"PROGRESS":0, "EVENT": data});
		},
		created: function (hive) {
			console.log("hive created");
		}
	});
});
