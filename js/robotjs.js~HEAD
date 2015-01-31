$(document).ready(function() {
	var canvas = $("#canvas"), ctx = canvas[0].getContext("2d"); 
	var robots = [], bullets = [];
	
	console.log = function(){};
	
	// utility functions
	var Utils = {
		degree2radian: function(a) {
			return a * (Math.PI/180); 
		},
		distance: function(x1, y1, x2, y2) {
			return Math.sqrt(Math.pow(x1-x2, 2)+Math.pow(y1-y2, 2));
		},
		is_point_in_square: function(x1,y1, x2, y2, width, height) {
			if(
				(x1>=x2) &&
				(x1<=(x2+width)) &&
				(y1>=y2) &&
				(y1<=(y2+height))
			) {
				return true;
			} else {
				return false;
			}
		}, 
	};
	
	
	var ARENA_WIDTH = 800;
	var ARENA_HEIGHT = 400;
	var ROBOT_SPEED = 1;
	var BULLET_SPEED = 3;
	
	var BattleManager = {
		_robots: {},
		_explosions: [],
		_ctx: null,
		
		init: function(ctx, workers) {
			var battle_manager = this;
			battle_manager._ctx = ctx;
			
			for(var w=0; w<workers.length; w++) {
				var robot_id = "robot-" + w;
				var robot = {
					"id": robot_id,
					"x": parseInt((ARENA_WIDTH-150)*Math.random()),
					"y": parseInt((ARENA_HEIGHT-150)*Math.random()),
					"health": 50,
					"direction": 40,
					"turret_direction": 0,
					"radar_direction": 0,
					"bullet": null,
					"events": [],
					"worker": new Worker(workers[w])
				}
				robot["worker"].onmessage = (function(robot_id) {
					return function(e) {
						battle_manager._receive(robot_id, e.data);
					}
				})(robot_id);
				
				battle_manager._robots[robot_id] = robot;
				
				battle_manager._send(robot_id, {
					"signal": "INFO",
					"arena_height": ARENA_HEIGHT,
					"arena_width": ARENA_WIDTH
				});
			}
		},
		
		_receive: function(robot_id, msg) {
			var msg_obj = JSON.parse(msg);
			var battle_manager = this;
			var robot = battle_manager._robots[robot_id];
			
			console.log(robot_id, msg);
			
			switch(msg_obj["signal"]) {
				default:
					msg_obj["progress"] = 0;
					robot.events.unshift(msg_obj);
					break;
			}
		},
		_send: function(robot_id, msg_obj) {
			var battle_manager = this;
			var msg = JSON.stringify(msg_obj);
			battle_manager._robots[robot_id]["worker"].postMessage(msg);
		},
		_send_all: function(msg_obj) {
			var battle_manager = this;
			for(var r in battle_manager._robots) {
				battle_manager._send(r, msg_obj);
			}
		},		
		
		run: function() {
			var battle_manager = this;
			
			setInterval(function() {
				battle_manager._run();
			}, 5);
			battle_manager._send_all({
				"signal": "RUN"
			});
		},
		_run: function() {
			var battle_manager = this;
			
			battle_manager._update();
			battle_manager._draw()
		},
		
		_update: function () {
			var battle_manager = this;
			
			for(var r in battle_manager._robots) {
				if(battle_manager._robots[r]["health"]<=0) {
					delete battle_manager._robots[r];
					battle_manager._explosions.push({
							"x": robot["x"],
							"y": robot["y"],
							"progress": 1
						});
				}
			}
					
			for(var r in battle_manager._robots) {
				var robot = battle_manager._robots[r];
				
				if(robot["bullet"]) {
					robot["bullet"]["x"] += BULLET_SPEED * Math.cos(Utils.degree2radian(robot["bullet"]["direction"]));
					robot["bullet"]["y"] += BULLET_SPEED * Math.sin(Utils.degree2radian(robot["bullet"]["direction"]));
					
					var wall_collide = !Utils.is_point_in_square(
						robot["bullet"]["x"], robot["bullet"]["y"], 
						2, 2, 
						ARENA_WIDTH-2, ARENA_HEIGHT-2
					);
					
					if(wall_collide) {
						robot["bullet"] = null;
					} else {
						for(var r2 in battle_manager._robots) {
							var enemy_robot = battle_manager._robots[r2];
							
							if(robot["id"]==enemy_robot["id"]) continue;
						
							var robot_hit = Utils.distance(
								robot["bullet"]["x"], robot["bullet"]["y"],
								enemy_robot["x"], enemy_robot["y"]
							) < 20;
							
							/*
							var robot_collide = Utils.is_point_in_square(
								robot["bullet"]["x"], robot["bullet"]["y"], 
								enemy_robot["x"]-15, enemy_robot["y"]-15, 
								30, 30
							);
							*/
							
							if(robot_hit) {
								console.log("HIT!");
								enemy_robot["health"] -= 3;
								battle_manager._explosions.push({
									"x": enemy_robot["x"],
									"y": enemy_robot["y"],
									"progress": 1
								});
								robot["bullet"] = null;
								// throw robot["id"] + " HIT " + enemy_robot["id"];
								break;
							}
						}
					}
				}
					
				for(var e=0; e<robot["events"].length; e++) {
					var event = robot["events"].pop();
					if (event === undefined) continue;
					
				
					switch(event["signal"]) {
						case "SHOOT":
							if(!robot["bullet"]) (
								robot["bullet"] = {
									"x": robot["x"],
									"y": robot["y"],
									"direction": robot["direction"]+robot["turret_direction"]
								}
							)
							break;
						case "MOVE":
							event["progress"]++;
						
							var new_x = robot["x"] + (event["distance"]>0?1:-1) * Math.cos(Utils.degree2radian(robot["direction"]));
							var new_y = robot["y"] + (event["distance"]>0?1:-1) * Math.sin(Utils.degree2radian(robot["direction"]));
							/*
							var new_x = Math.round(robot["x"] + (event["distance"]>0?1:-1) * Math.cos(Utils.degree2radian(robot["direction"])));
							var new_y = Math.round(robot["y"] + (event["distance"]>0?1:-1) * Math.sin(Utils.degree2radian(robot["direction"])));
							*/
							
							var wall_collide = !Utils.is_point_in_square(
								new_x, new_y, 
								2, 2, 
								ARENA_WIDTH-2, ARENA_HEIGHT-2
							);
						
							if(wall_collide) {
								console.log("wall " + robot["direction"] + " " + robot["x"] + " " + new_x + " " + wall_collide);
								robot["health"] -= 1;
								this._send(r, {
									"signal": "CALLBACK",
									"callback_id": event["callback_id"],
									"status": "WALL_COLLIDE"
								});
								break;
							}
							
							for(var r2 in battle_manager._robots) {
								var enemy_robot = battle_manager._robots[r2];
							
								if(robot["id"]==enemy_robot["id"]) continue;
						
								var robot_hit = Utils.distance(
									new_x, new_y,
									enemy_robot["x"], enemy_robot["y"]
								) < 25;
															
								if(robot_hit) {
									enemy_robot["health"]--;
									robot["health"]--;
									this._send(r, {
										"signal": "CALLBACK",
										"callback_id": event["callback_id"],
										"status": "ENEMY_COLLIDE"
									});
									break;
								}
							}	
							if(robot_hit) break;
						
						
							if(event["progress"]>Math.abs(event["distance"])) {
								console.log("move-over " + robot["id"]);
								this._send(r, {
									"signal": "CALLBACK",
									"callback_id": event["callback_id"],
									"status": "DONE"
								});
								break;
							} 	
							
							robot["x"] = new_x;
							robot["y"] = new_y;
							robot["events"].unshift(event);
							
							break;
						case "ROTATE":
							if(event["progress"]==Math.abs(parseInt(event["angle"]))) {
								this._send(r, {
									"signal": "CALLBACK",
									"callback_id": event["callback_id"],
									"status": "DONE"
								});
								break;
								
							}
							robot["direction"] += (event["angle"]>0?1:-1);
							event["progress"]++;
							robot["events"].unshift(event);

							break;
						case "ROTATE_TURRET":
							if(event["progress"]==Math.abs(event["angle"])) {
								this._send(r, {
									"signal": "CALLBACK",
									"callback_id": event["callback_id"]
								});
								break;
								
							}
							robot["turret_direction"] += (event["angle"]>0?1:-1);
							event["progress"]++;
							robot["events"].unshift(event);

							break;
					}
					this._send(r, {
						"signal": "UPDATE",
						"x": robot["x"],
						"y": robot["y"]
					});
				}
			}
		},
		_draw: function () {
			var battle_manager = this;
			
			battle_manager._ctx.clearRect(0, 0, 800, 400);
			
			
			function draw_robot(ctx, robot) {
				var body = new Image(), turret = new Image(), radar = new Image();
				body.src = "img/body.png";
				turret.src = "img/turret.png";
				radar.src = "img/radar.png";
				
				ctx.drawImage(body, -18, -18, 36, 36);
				ctx.rotate(Utils.degree2radian(robot["turret_direction"]));
				ctx.drawImage(turret, -25, -10, 54, 20);
				robot["radar_direction"]++;
				ctx.rotate(Utils.degree2radian(robot["radar_direction"]));
				ctx.drawImage(radar, -8, -11, 16, 22);
			}
			
			// draw robots
			for(var r in battle_manager._robots) {
				var robot = battle_manager._robots[r];
				
				// draw robot
				battle_manager._ctx.save();
				battle_manager._ctx.translate(robot["x"],robot["y"]);
				battle_manager._ctx.rotate(Utils.degree2radian(robot["direction"]));
				draw_robot(battle_manager._ctx, robot);
				battle_manager._ctx.restore();
				
				// draw bullet
				if(robot["bullet"]) {
					battle_manager._ctx.save();
					battle_manager._ctx.translate(robot["bullet"]["x"],robot["bullet"]["y"]);
					battle_manager._ctx.rotate(Utils.degree2radian(robot["bullet"]["direction"]));
					ctx.fillRect(-3,-3,6,6);
					battle_manager._ctx.restore();
				}
				
				battle_manager._ctx.beginPath();
				battle_manager._ctx.strokeStyle = "red";
				battle_manager._ctx.moveTo(robot["x"]-40,robot["y"]);
				battle_manager._ctx.lineTo(robot["x"]+40,robot["y"]);
				battle_manager._ctx.moveTo(robot["x"],robot["y"]-40);
				battle_manager._ctx.lineTo(robot["x"],robot["y"]+40);
				battle_manager._ctx.stroke();
				battle_manager._ctx.closePath();
				
				battle_manager._ctx.strokeText(robot["id"] + " (" + robot["health"] + ")", robot["x"]-20,robot["y"]+35);
//				/*
				battle_manager._ctx.fillStyle = "green";
				battle_manager._ctx.fillRect(robot["x"]-20,robot["y"]+35, robot["health"], 5);
				battle_manager._ctx.fillStyle = "red";
				battle_manager._ctx.fillRect(robot["x"]-20+robot["health"],robot["y"]+35, 25-robot["health"], 5);
				battle_manager._ctx.fillStyle = "black";
//				*/
			}
			for(var e=0; e<battle_manager._explosions.length; e++) {
				var explosion = battle_manager._explosions.pop();
				
				if(explosion["progress"]<=17) {
					var explosion_img = new Image();
					explosion_img.src = "img/explosion/explosion1-" + parseInt(explosion["progress"])+'.png';
					battle_manager._ctx.drawImage(explosion_img, explosion["x"]-64, explosion["y"]-64, 128, 128);
					explosion["progress"]+= .1;
					battle_manager._explosions.unshift(explosion);
				}
			}
		},
	};
	
//	BattleManager.init(ctx, ["js/scan-bot.js"]);
//	BattleManager.init(ctx, ["js/test-robot1.js", "js/test-robot2.js", "js/test-robot1.js", "js/test-robot2.js","js/test-robot1.js", "js/test-robot2.js", "js/test-robot1.js", "js/test-robot2.js"]);
	BattleManager.init(ctx, ["js/scan-bot.js", "js/scan-bot.js", "js/scan-bot.js", "js/scan-bot.js"]);
	BattleManager.run();
	
});
