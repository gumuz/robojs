# RoboJS - Robocode in Javascript

## About
This is a fork of [Robojs](https://github.com/gumuz/robojs), which is a clone of Robocode. Built using Javascript & CoffeeScript using HTML5 Canvas and Web workers.

## Demo
You can check out how it works on http://murilopolese.github.io/robojs/

## Build your own bot
Create a folder called `bots` on the root of this repo and create your custom bots there. You can check some examples of bots like the [Scan Bot](https://github.com/murilopolese/robojs/blob/gh-pages/js/scan-bot.js).

After that, open the `index.html` and search for this part of the code:

```javascript
BattleManager.init(ctx, [
	"js/scan-bot.js",
	"js/scan-bot.js",
	"js/scan-bot.js",
	"js/scan-bot.js"
]);
BattleManager.run();
```

Add, change or remove the lines where it says `js/scan-bot.js` for `bots/yourbot.js`.

## How does it work?
Every Robot runs in it's own Web Worker thread. A robot sub-classes a base robot which handles the worker/event-loop communication and event propagation. The new robot just has to implement behaviour using call-backs, reacting on possible events:

```javascript
importScripts('base-robot.js');

ScanBot = BaseRobot;

ScanBot.run = function() {
	var robot = this;
	robot.shoot();

	robot.turn_turret_right(45);
	robot.move_forward(Math.random()*400, {
		DONE: function() {
			robot.shoot();
			robot.turn_right(Math.random()*90, {
				DONE: function() {
					robot.shoot();
					robot._run();
				}
			});
		},
		ENEMY_COLLIDE: function() {
			robot.shoot();
			robot.move_backward(100, {
				DONE: function() {
					robot._run();
				},
				WALL_COLLIDE: function() {
					robot._run();
				}
			});
		},
		WALL_COLLIDE: function() {
			robot.turn_left(180, {
				DONE: function() {
					robot.shoot();
					robot._run();
				}
			});
		}
	});
}
```