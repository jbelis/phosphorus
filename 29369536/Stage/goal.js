P.script.define("goal", function(sprite) {

	sprite.on("message", function() {
		this.hide();
		this.moveTo(random(200), random(160));
		this.show();
	}.bind(sprite), 'move');

	function random(span) {
		return Math.round(Math.random() * 2 * span - span);
	}

});
