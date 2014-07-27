angular.module("robojs", ["ui.bootstrap"]);

function RoboJSCtrl($scope) {
    // for the tabs
    $scope.tabArenaActive = false;
    $scope.tabWorkshipActive = false;
    
    $scope.robotOptions = [
        {
            name: "Scan Bot",
            sourcePath: "js/scan-bot.js"
        },
        {
            name: "Sitting Duck Bot",
            sourcePath: "js/sitting-duck-bot.js"
        },
        {
            name: "Test Robot1",
            sourcePath: "js/test-robot1.js"
        },
        {
            name: "Test Robot2",
            sourcePath: "js/test-robot2.js"
        }
    ];
    $scope.robots = [];
    
    $scope.addRobot = function() {
        var robot = {};
        robot.type = $scope.robotType;
        robot.packageRobot = $scope.packageRobot;
        robot.name = $scope.packageRobot.name;
        
        $scope.robots.push(robot);
        $scope.addingRobot= false;
    }
    
    $scope.startGame = function() {
        // build the list of robots
        var robots = [];
        $.each($scope.robots, function(index, robot) {
            robots.push(robot.packageRobot.sourcePath);
        });
        var ctx = $("#canvas")[0].getContext("2d")
        $scope.BattleManager.init(ctx, robots);
        $scope.BattleManager.run();
        
        $scope.tabArenaActive = true;
    }
}