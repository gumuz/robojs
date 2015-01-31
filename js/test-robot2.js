importScripts('base-robot.js');


TestBot2 = BaseRobot;

TestBot2.run = function() {
	var robot = this;
	robot.turn_turret_right(90);
	robot.move_forward(parseInt(Math.random()*robot.arena_width), function() {
		robot.shoot();
		robot.turn_turret_left(90);
		robot.turn_right(90, function() {
			robot._run();
		});		
	});
}
