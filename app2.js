const rootElement = document.getElementById('root');
const CARD_TYPES = ["jabba", "obi", "c3po", "chewbacca", "leia", "luke", "vader", "yoda"];

function shuffleArray(array) {
  for(var j, x, i = array.length; i; j = parseInt(Math.random() * i),
      x = array[--i], array[i] = array[j], array[j] = x);

  return array;
}

class Game {
  static getInitialParams() {
    return {
      clicks: 48,
      numberOfCards: 16,
      numberOfCardTypes: 4
    }
  }

  constructor(container, cardTypes) {
    this.container = container;

    this.level = 1;
    this.hearts = 0;

    this.cardTypes = cardTypes;
    this.levelParams = Game.getInitialParams();

    this.container.addEventListener('click', this.handleClick.bind(this));
  }

  start() {
    this.clicksRemain = this.levelParams.clicks;

    this.container.innerHTML = '';
    this.fillGameState();
    this.fillGameArea();
  }

  fillGameState() {
    const header = document.createElement('header');
    header.innerHTML = `
      <p><span class="level">${ this.level }</span> level</p>
      <p class="hearts">${ this.hearts }</p>
      <p><span class="clicks">${ this.clicksRemain }</span> clicks</p> `;

    this.container.appendChild(header);
  }

  fillGameArea() {
    const gameArea = document.createElement('div');
    gameArea.className = 'game-area';

    const cards = this.shuffleCardTypes();

    cards.forEach(function addCard(cardType) {
      gameArea.innerHTML += `
          <div class="card ${ cardType }">
            <div class="front"></div>
            <div class="back"></div>
          </div> `;
    });

    this.container.appendChild(gameArea);
  }

  get openedCards() {
    return document.querySelectorAll('.opened');
  }

  get closedCards() {
    return document.querySelectorAll('.closed');
  }

  open(card) {
    card.classList.add('opened');

    this.hasClicked();
  }

  close(cards) {
    if (this.clicksRemain === this.levelParams.clicks - 2) { // means success with first couple of cards
      this.getHeart();
    }

    setTimeout(function() {
      cards.forEach(function(card) {
        card.classList.add('closed');
        card.classList.remove('opened');
      });

      this.checkVictory();
    }.bind(this), 300);
  }

  hide(cards) {
    cards.forEach(function(card) {
      card.classList.remove('opened');
    })
  }

  shuffleCardTypes() {
    const { numberOfCards, numberOfCardTypes } = this.levelParams;
    const randomTypes = shuffleArray(this.cardTypes).slice(0, numberOfCardTypes);
    let result = [];

    for (let i = 1; i <= numberOfCards / numberOfCardTypes; i++) {
      result = result.concat(randomTypes);
    }

    return shuffleArray(result);
  }

  handleClick(event) {
    const card = event.target.closest('.card');

    if (card && !this.isCardOpened(card)) {
      if (this.openedCards.length === 2) {
        this.hide(this.openedCards);
      }

      this.open(card);
    }

    if (this.openedCards.length === 2) {
      this.compareOpenCards();
    }
  }

  isCardOpened(card) {
    return card.classList.contains('opened');
  }

  compareOpenCards() {
    if (this.openedCards[0].className === this.openedCards[1].className) {
      this.close(this.openedCards);
    }
  }

  hasClicked() {
    this.clicksRemain--;

    if (this.clicksRemain === 0) {
      return this.restart();
    }

    document.querySelector('.clicks').textContent = this.clicksRemain;
  }

  restart() {
    if (this.hearts === 0) {
      this.level = 1;
      this.levelParams = Game.getInitialParams();
    } else {
      this.hearts--;
    }

    this.start();
  }

  checkVictory() {
    if (this.closedCards.length === this.levelParams.numberOfCards) {
      this.updateLevel();
    }
  }

  updateLevel() {
    if (this.level < 10) {
      this.level++;
      this.levelParams.clicks -= 4;

      if (this.level === 5) {
        this.levelParams.numberOfCardTypes = 8;
      }

      this.start();
    } else {
      // FINISH WHOLE GAME
    }
  }

  getHeart() {
    this.hearts++;
    document.querySelector('.hearts').textContent = this.hearts;
  }
}

const game = new Game(rootElement, CARD_TYPES);
game.start();
