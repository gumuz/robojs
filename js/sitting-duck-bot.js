importScripts('base-robot.js');


SittingDuckBot = BaseRobot;

SittingDuckBot.run = function() {
	var robot = this;

	robot.turn_left(20, function() {
		robot._run();
	});
}
