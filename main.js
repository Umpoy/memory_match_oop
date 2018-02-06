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
}



function View() {
	this.initialize_game = function () { // starts the game
		$('.card').remove()
		model.life_points = 8000;
		model.times_played += 1;
		$('.life_points').html(this.life_points);
		$('.times_played').html(this.times_played)
		var images = model.images.concat(model.images);
		var randomizedArray = [];
		while (images.length !== 0) {
			var randomIndex = Math.floor(Math.random() * images.length);
			randomizedArray.push(images[randomIndex]);
			images.splice(randomIndex, 1);
		}
		this.createCards(randomizedArray);
	}
	this.createCards = function (randomizedArray) { //Creates and appends cards to game board
		var cardList = [];
		for (var i = 0; i < randomizedArray.length; i++) {
			var newCard = new Card(randomizedArray[i], this);
			var cardDomElement = newCard.render();
			$('#gameArea').append(cardDomElement)
			cardList.push(newCard)
		}
		setTimeout(function () {
			$('.card').addClass('reveal')
			setTimeout(function () {
				$('.card').removeClass('reveal')
			}, 2000);
			setTimeout(function () {
				$('.card').on('click', controller.handleCardClick);
			}, 0)
		}, 1000)
	}
} //End of View

function Controller() {
	let self = this;
	this.cards_clicked_array = [];

	this.handleCardClick = function () {
		if ($(this).hasClass('reveal') || $(this).hasClass('match') || self.cards_clicked_array.length == 2 || model.life_points == 0) {
			return
		}
		model.sounds.card_flip.play();
		$(this).addClass('reveal');
		var image_url = $(this).find('img').attr('src');
		var card_click = new Card(image_url);
		self.cards_clicked_array.push(card_click);
		if (self.cards_clicked_array.length == 2) {
			self.check();
		}
	}

	this.check = function () {
		if (this.cards_clicked_array[0].frontImage == this.cards_clicked_array[1].frontImage) {
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
			alert()
		}
	}

	this.no_match = function () {
		model.life_points -= 500;
		model.times_clicked++;
		setTimeout(function () {
			$('.reveal').removeClass('reveal')
			self.cards_clicked_array = []
		}, 1000)
		$('.life_points').html(model.life_points);
		this.check_accuracy()
		if (!model.life_points) {
			alert('you lost')
		}
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
	this.frontImage = frontImage;
	this.renderElement = null;
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
		this.renderElement = card;
		return card;
	}
}
