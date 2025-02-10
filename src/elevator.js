
{
    init: function(elevators, floors) {
        var max_floor = floors.length - 1;
        var mid_floor = Math.floor(max_floor / 2);
        
        for (let i = 0; i < elevators.length; i++) {
            let elevator = elevators[i];
    
            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", function() {
                if (elevator.currentFloor == 0) {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                    elevator.goToFloor(max_floor)
                } else {
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(true);
                    elevator.goToFloor(0)
                }
            });
    
            // Approaching a floor
            elevator.on("passing_floor", function(floorNum, direction){
                if(elevator.getPressedFloors().includes(floorNum)) {
                    elevator.goToFloor(floorNum, true);
                } else {
                    switch(direction){
                        case "up":
                            if (floors[floorNum].buttonStates["up"] == "activated" && elevator.loadFactor() < 1) {
                                elevator.goToFloor(floorNum, true);
                            }
                            break;
                        case "down":
                            if (floors[floorNum].buttonStates["down"] == "activated" && elevator.loadFactor() < 1) {
                                elevator.goToFloor(floorNum, true);
                            }
                            break;
                    }
                }
            })
    
            // Stopped at a floor
            elevator.on("stopped_at_floor", function(floorNum, direction){
                if (floorNum == 0) {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                    elevator.goToFloor(max_floor)
                } else if (floorNum == max_floor) {
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(true);
                    elevator.goToFloor(0)
                }
            })
    
            // Whenever a floor button is pressed inside the elevator
            elevator.on("floor_button_pressed", function(floorNum) {
                //
            })
        }

        for (let i = 0; i < floors.length; i++) {
            //
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
