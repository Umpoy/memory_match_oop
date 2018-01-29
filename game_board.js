
function Game() {
    var self = this
    this.matchCounter = 0;
    this.life_points = null;
    this.times_played = -1;
    this.accuracy = null;
    this.times_clicked = 0;
    this.imageList = [
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
    this.clickCardsList = [];
    this.testArray = []
    this.initializeGame = function () {
        $('.card').remove()
        console.log(this)
        this.life_points = 8000;
        this.times_played += 1;
        $('.life_points').html(this.life_points);
        $('.times_played').html(this.times_played)
        var images = this.imageList.concat(this.imageList);
        var randomizedArray = [];
        while (images.length !== 0) {
            var randomIndex = Math.floor(Math.random() * images.length);
            randomizedArray.push(images[randomIndex]);
            images.splice(randomIndex, 1);
        }
        this.createCards(randomizedArray);
    }

    this.createCards = function (randomizedArray) {
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
            }, 2000)
        }, 1000)
        $('.card').on('click', this.handleCardClick)
    }

    this.reveal = function (card_info) {
        $(card_info).addClass('reveal')
        var image_url = $(card_info).find('img').attr('src');
        console.log(image_url)
        var card_click = new Card(image_url, card_info)
        this.clickCardsList.push(card_click)
        if (this.clickCardsList.length == 2) {
            this.check()

        }
    }

    this.check = function () {
        if (this.clickCardsList[0].frontImage == this.clickCardsList[1].frontImage) {
            this.match()
        } else {
            this.no_match()
        }
    }

    this.match = function () {
        $('.reveal').addClass('matched')
        this.clickCardsList = []
        this.matchCounter++;
        self.times_clicked++;
        this.check_accuracy();
        if (this.matchCounter == 9) {
            alert()
        }
    }

    this.no_match = function () {
        this.life_points -= 500;
        self.times_clicked++;
        setTimeout(function () {
            $('.reveal').removeClass('reveal')
            self.clickCardsList = []
        }, 1000)
        $('.life_points').html(this.life_points);
        this.check_accuracy()
        if (!this.life_points) {
            alert('you lost')
        }

    }

    this.handleCardClick = function () {
        if ($(this).hasClass('reveal') || $(this).hasClass('match') || self.clickCardsList.length == 2 || this.life_points == 0) {
            return
        }
        self.reveal(this)

    }

    this.check_accuracy = function () {
        this.accuracy = Math.ceil(100 * (this.matchCounter / this.times_clicked))
        console.log(this.accuracy)
        $('.accuracy').html(this.accuracy + '%')
    }

}