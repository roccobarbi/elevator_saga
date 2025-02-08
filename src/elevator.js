{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // Let's use the first elevator
        var max_floor = floors.length - 1;
        var mid_floor = Math.floor(max_floor / 2);
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

        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", function() {
            // let's go to the middle floor to minimise the distance to the next call
            elevator.goToFloor(mid_floor);
        });
        elevator.on("floor_button_pressed", function(floorNum) {
            console.log(floorNum + " floor button presses");
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
                }
            } else {
                elevator.unqueued_requests.add(floorNum);
            }
        })

        for (let i = 0; i < floors.length; i++) {
            floors[i].on("up_button_pressed", function() {
                // enqueue now if on direction of travel
                console.log("up button pressed at floor " + floors[i].floorNum());
                if (!elevator.destinationQueue.includes(floors[i].floorNum())) {
                    if (same_direction(elevator, floors[i].floorNum())) {
                        console.log(floors[i].floorNum() + " added to the queue");
                        elevator.goToFloor(floors[i].floorNum());
                        switch(elevator.destinationDirection()) {
                            case "up":
                                elevator.destinationQueue.sort((a, b) => a - b);
                                break;
                            case "down":
                                elevator.destinationQueue.sort((a, b) => b - a);
                                break;
                            case "stopped":
                                if (floors[i].floorNum() >= mid_floor) {
                                    elevator.destinationQueue.sort((a, b) => b - a);
                                } else {
                                    elevator.destinationQueue.sort((a, b) => a - b);
                                }
                        }
                        elevator.checkDestinationQueue();
                    }
                } else {
                    elevator.unqueued_requests.add(floors[i].floorNum());
                }
                elevators[0].goToFloor(floors[i].floorNum());
            });
            floors[i].on("down_button_pressed", function() {
                // enqueue now if on direction of travel
                console.log("down button pressed at floor " + floors[i].floorNum());
                if (!elevator.destinationQueue.includes(floors[i].floorNum())) {
                    if (same_direction(elevator, floors[i].floorNum())) {
                        console.log(floors[i].floorNum() + " added to the queue");
                        elevator.goToFloor(floors[i].floorNum());
                        switch(elevator.destinationDirection()) {
                            case "up":
                                elevator.destinationQueue.sort((a, b) => a - b);
                                break;
                            case "down":
                                elevator.destinationQueue.sort((a, b) => b - a);
                                break;
                            case "stopped":
                                if (floors[i].floorNum() >= mid_floor) {
                                    elevator.destinationQueue.sort((a, b) => b - a);
                                } else {
                                    elevator.destinationQueue.sort((a, b) => a - b);
                                }
                        }
                        elevator.checkDestinationQueue();
                    }
                } else {
                    elevator.unqueued_requests.add(floors[i].floorNum());
                }
            });
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}