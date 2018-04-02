$(document).ready(initializeApplication);
let view = null;
let model = null;

function initializeApplication() {
	// images for the front of the card
	const image_array = [
		'assets/images/dark.jpg',
		'assets/images/head.jpg',
		'assets/images/leftarm.jpg',
		'assets/images/leftleg.jpg',
		'assets/images/obelisk.jpg',
		'assets/images/rightarm.jpg',
		'assets/images/rightleg.jpg',
		'assets/images/slifer.jpg',
		'assets/images/wingra.jpg',
	];
	//sounds object
	const sounds = {
		card_flip: new Audio("assets/sounds/card-flip.mp3"),
		damage: new Audio("assets/sounds/damage.mp3")
	}
	model = new Model(image_array, sounds);
	view = new View();
	controller = new Controller();
	view.initialize_game();
	setTimeout(function () {
		$('.reset').on('click', reset_board)
		$('.reset').removeClass('disable')
	}, 3500)
	$(window).on('resize', view.change_card_size) // changes .card height and width
	function reset_board() {
		view.initialize_game();
		$(this).off('click');
		$(this).addClass('disable')
		setTimeout(() => {
			$(this).on('click', reset_board);
			$(this).removeClass('disable')
		}, 3500);
	}
}



function View() {
	this.initialize_game = function () { // starts the game
		$('.card').remove();
		model.life_points = 8000;
		model.match_counter = 0;
		model.times_played += 1;
		controller.render_life_points();
		controller.cards_clicked_array = []
		$('.life_points').html(model.life_points);
		$('.accuracy').html('0%');
		$('.times_played').html(model.times_played);
		var images = model.images.concat(model.images);
		let randomized_array = [];
		while (images.length !== 0) {
			var random_index = Math.floor(Math.random() * images.length);
			randomized_array.push(images[random_index]);
			images.splice(random_index, 1);
		}
		this.createCards(randomized_array);
	}
	this.createCards = function (randomized_array) { //Creates and appends cards to game board
		const card_list = [];
		for (let i = 0; i < randomized_array.length; i++) {
			let new_card = new Card(randomized_array[i], this);
			let card_dom_element = new_card.render();
			$('#gameArea').append(card_dom_element)
			card_list.push(new_card)
		}
		setTimeout(function () {
			view.change_card_size();
			$('.card').addClass('reveal')
			model.sounds.card_flip.play();
			setTimeout(function () {
				$('.card').removeClass('reveal')
			}, 2000);
			setTimeout(function () {
				$('.card').on('click', controller.handle_card_click);
			}, 0)
		}, 1000);
	}
	this.change_card_size = function () {
		$(".card").css({
			"width": $('.back img').width(),
			"height": $('.back img').height()
		})
	}
} //End of View

function Controller() {
	let self = this;
	this.cards_clicked_array = [];

	this.handle_card_click = function () {
		if ($(this).hasClass('reveal') || $(this).hasClass('match') || self.cards_clicked_array.length == 2 || model.life_points == 0) {
			return
		}
		model.sounds.card_flip.play();
		$(this).addClass('reveal');
		self.cards_clicked_array.push(this);
		if (self.cards_clicked_array.length == 2) {
			self.check();
		}
	}

	this.check = function () {
		if ($(controller.cards_clicked_array[0]).find('.front').children('img').attr('src') == $(controller.cards_clicked_array[1]).find('.front').children('img').attr('src')) {
			this.match();
		} else {
			model.sounds.damage.play()
			this.no_match();
		}
	}

	this.match = function () {
		$('.reveal').addClass('matched')
		this.cards_clicked_array = []
		model.match_counter++;
		model.times_clicked++;
		this.check_accuracy();
		if (model.match_counter == 9) {
			setTimeout(function () {
				controller.display_win();
			}, 500)
		}
	}

	this.display_win = function () {
		var modal = document.getElementById('modal_victory');
		modal.style.display = "block";
		var span = document.getElementsByClassName("close")[0];
		modal.onclick = function () {
			modal.style.display = "none";
		}

	}
	this.display_defeat = function () {
		var modal = document.getElementById('modal_defeat');
		modal.style.display = "block";
		var span = document.getElementsByClassName("close")[0];
		modal.onclick = function () {
			modal.style.display = "none";
		}

	}

	this.no_match = function () {
		model.life_points -= 500;
		model.times_clicked++;
		if (model.life_points > 0) {
			setTimeout(function () {
				$(controller.cards_clicked_array[0]).removeClass('reveal')
				$(controller.cards_clicked_array[1]).removeClass('reveal')
				self.cards_clicked_array = []
			}, 1000)
		}
		this.render_life_points();
		this.check_accuracy()
		if (!model.life_points) {
			setTimeout(function () {
				controller.display_defeat();
			}, 1000)
		}
	}

	this.render_life_points = function () {
		$('.life_points').html(model.life_points);
	}

	this.check_accuracy = function () {
		model.accuracy = Math.ceil(100 * (model.match_counter / model.times_clicked))
		$('.accuracy').html(model.accuracy + '%')
	}
} //End of Controller

function Model(images, sounds) {
	this.match_counter = 0;
	this.life_points = null;
	this.times_played = -1;
	this.accuracy = null;
	this.times_clicked = 0;
	this.images = images;
	this.sounds = sounds;
} //End of Model

function Card(frontImage) {
	this.self = this
	this.render = function () {
		var card = $('<div>', {
			class: 'card'
		});
		var front = $('<div>', {
			class: 'front',
		});
		var back = $('<div>', {
			class: 'back'
		});
		var img = $('<img>').attr('src', frontImage);
		front.append(img);
		back.append($('<img>').attr('src', 'assets/images/card-back.jpg'))
		card.append(front, back);

		return card;
	}
}
