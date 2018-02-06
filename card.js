
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