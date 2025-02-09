{
    init: function(elevators, floors) {
        var max_floor = floors.length - 1;
        var mid_floor = Math.floor(max_floor / 2);
        let same_direction = function(elevator, floorNum) {
            if(
                (elevator.currentFloor < floorNum && elevator.destinationDirection() == "up") ||
                (elevator.currentFloor > floorNum && elevator.destinationDirection() == "down") ||
                elevator.destinationDirection() == "stopped"
            ) {
                // the floor is in the direction of travel
                return true;
            }
            // the floor is not in the direction of travel
            return false;
        }
        let queue_or_not = function(elevator, floorNum, unqueued_requests) {
            if (!elevator.destinationQueue.includes(floorNum)) {
                if (same_direction(elevator, floorNum)) {
                    console.log(floorNum + " added to the queue");
                    elevator.goToFloor(floorNum);
                    switch(elevator.destinationDirection()) {
                        case "up":
                            elevator.destinationQueue.sort((a, b) => a - b);
                            break;
                        case "down":
                            elevator.destinationQueue.sort((a, b) => b - a);
                            break;
                        case "stopped":
                            if (floorNum >= mid_floor) {
                                elevator.destinationQueue.sort((a, b) => b - a);
                            } else {
                                elevator.destinationQueue.sort((a, b) => a - b);
                            }
                    }
                    elevator.checkDestinationQueue();
                } else {
                    unqueued_requests.add(floorNum);
                }
            }
        }
        
        for (let i = 0; i < elevators.length; i++) {
            let elevator = elevators[i];
            elevator.unqueued_requests = { // requests not in the direction of travel, to be queued later
                'queue' : [],
                'add' : function(floorNum) {
                    if( !this.queue.includes(floorNum) ) {
                        this.queue.push(floorNum);
                    }
                },
                'get' : function(direction) {
                    let requests = [];
                    switch (direction) {
                        case "up":
                            requests = this.queue.sort((a, b) => a - b);
                            this.queue = [];
                            break;
                        case "down":
                            requests = this.queue.sort((a, b) => b - a);
                            this.queue = [];
                            break;
                    }
                    return requests;
                }
            }
    
            // Whenever the elevator is idle (has no more queued destinations) ...
            elevator.on("idle", function() {
                if(elevator.currentFloor >= mid_floor) {
                    elevator.destinationQueue = elevator.unqueued_requests.get("down");
                } else {
                    elevator.destinationQueue = elevator.unqueued_requests.get("up");
                }
                console.log("requeued destinations")
                elevator.checkDestinationQueue();
            });
    
            // Approaching a floor
            elevator.on("passing_floor", function(floorNum, direction){
                //
            })
    
            // Stopped at a floor
            elevator.on("stopped_at_floor", function(floorNum, direction){
                if (elevator.destinationQueue.length == 0) {
                    if(floorNum >= mid_floor) {
                        elevator.destinationQueue = elevator.unqueued_requests.get("down");
                    } else {
                        elevator.destinationQueue = elevator.unqueued_requests.get("up");
                    }
                    console.log("requeued destinations")
                    elevator.checkDestinationQueue();
                }
            })
    
            // Whenever a floor button is pressed inside the elevator
            elevator.on("floor_button_pressed", function(floorNum) {
                console.log(floorNum + " floor button presses");
                queue_or_not(elevator, floorNum, this.unqueued_requests);
            })
        }

        for (let i = 0; i < floors.length; i++) {
            floors[i].on("up_button_pressed", function() {
                // enqueue now if on direction of travel
                console.log("up button pressed at floor " + floors[i].floorNum());
                for (let i = 0; i < elevators.length; i++) {
                    let elevator = elevators[i];
                    if(elevator.destinationDirection == "stopped") {
                        elevator.goToFloor(floors[1].floorNum())
                        break;
                    }
                    if(elevator.loadFactor < 0.9) {
                        queue_or_not(elevator, floors[i].floorNum(), elevator.unqueued_requests);
                    } else {
                        elevator.unqueued_requests.add(floors[i].floorNum())
                    }
                }
            });
            floors[i].on("down_button_pressed", function() {
                // enqueue now if on direction of travel
                console.log("down button pressed at floor " + floors[i].floorNum());
                for (let i = 0; i < elevators.length; i++) {
                    let elevator = elevators[i];
                    if(elevator.destinationDirection == "stopped") {
                        elevator.goToFloor(floors[1].floorNum())
                        break;
                    }
                    if(elevator.loadFactor < 0.9) {
                        queue_or_not(elevator, floors[i].floorNum(), elevator.unqueued_requests);
                    } else {
                        elevator.unqueued_requests.add(floors[i].floorNum())
                    }
                }
            });
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}