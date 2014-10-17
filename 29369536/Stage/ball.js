
P.script.define("ball", function(sprite) {

	sprite.on("greenflag", function() {
		this.repeatForever(function() {
			this.forward(10);
			this.bounceOffEdge();
			if (this.touching("goal")) {
				//this.playSound("pop");
				this.changeVar("points", 1);
				this.stage.broadcast("move");
			};
			if (this.touchingColor(-65536)) {
				this.changeVar("points", -1);
			};
		});
	}.bind(sprite));

	sprite.on("keypress", function() {
		this.setDirection(0);
	}.bind(sprite), 'up arrow');

	sprite.on("keypress", function() {
		this.setDirection(180);
	}.bind(sprite), 'down arrow');

	sprite.on("keypress", function() {
		this.setDirection(-90);
	}.bind(sprite), 'left arrow');

	sprite.on("keypress", function() {
		this.setDirection(90);
	}.bind(sprite), 'right arrow');


});
