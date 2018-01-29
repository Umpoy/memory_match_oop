
function Card(frontImage, parentObject) {
	var self = this
	this.frontImage = frontImage;
	this.parent = parentObject;
	this.revealed = false;
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
		back.append($('<img>').attr('src', 'images/card-back.jpg'))
		card.append(front, back);
		this.renderElement = card;
		return card;
	}

	this.clicked = function () {
		if (this.revealed) {
			console.log('already clicked')
			return
		} else {
			console.log('before click', this.revealed)
			this.revealed = true
			console.log('after click', this.revealed)
		}
	}

}