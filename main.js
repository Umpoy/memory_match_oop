$(document).ready(initializeApplication);
var game = null;

function initializeApplication() {
	game = new Game();
	game.initializeGame();
	assignClickHandlers();
}

function assignClickHandlers() {
	$('.reset').on('click', function () {
		game.initializeGame();
	})
}

