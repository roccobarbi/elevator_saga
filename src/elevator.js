{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // Let's use the first elevator
        var max_floor = floors.length - 1;
        var mid_floor = Math.floor(max_floor / 2);

        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", function() {
            // let's go to the middle floor to minimise the distance to the next call
            elevator.goToFloor(mid_floor);
        });
        elevator.on("floor_button_pressed", function(floorNum) {
            console.log(floorNum + " floor button presses");
            elevator.goToFloor(floorNum);
        })

        for (let i = 0; i < floors.length; i++) {
            floors[i].on("up_button_pressed", function() {
                // will improve it later by checking the direction of travel to optimise
                console.log("up button pressed at floor " + floors[i].floorNum());
                elevators[0].goToFloor(floors[i].floorNum());
            });
            floors[i].on("down_button_pressed", function() {
                // will improve it later by checking the direction of travel to optimise
                console.log("down button pressed at floor " + floors[i].floorNum());
                elevators[0].goToFloor(floors[i].floorNum());
            });
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}