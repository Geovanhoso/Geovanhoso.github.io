let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let isGameActive = false;

const cardsArray = [
    'pera', 'pera', 
    'abacaxi', 'abacaxi', 
    'banana', 'banana', 
    'melao', 'melao', 
    'lima', 'lima', 
    'maracuja', 'maracuja'
];

const cardElements = [];

function startGame() {
    isGameActive = true;
    matches = 0;
    document.getElementById('congratulationsScreen').style.display = 'none';
    setupBoard();
}

function setupBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    const shuffledCards = shuffle(cardsArray);

    shuffledCards.forEach(type => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        
        const frontFace = document.createElement('div');
        frontFace.classList.add('front');
        frontFace.style.backgroundImage = `url('images/amarelas/${type}.png')`;
        
        const backFace = document.createElement('div');
        backFace.classList.add('back');

        cardElement.appendChild(frontFace);
        cardElement.appendChild(backFace);
        
        cardElement.addEventListener('click', () => flipCard(cardElement, type));
        gameBoard.appendChild(cardElement);
        cardElements.push(cardElement);
    });
}

function flipCard(card, type) {
    if (lockBoard || !isGameActive || card === firstCard || card.classList.contains('flipped')) return;

    card.classList.add('flipped');
    
    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        lockBoard = true;

        const firstType = getCardType(firstCard);
        const secondType = getCardType(secondCard);

        if (firstType === secondType) {
            matches++;
            if (matches === cardsArray.length / 2) {
                setTimeout(endGame, 300); 
            }
            resetBoard();
        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                resetBoard();
            }, 1000);
        }
    }
}

function endGame() {
    isGameActive = false;
    document.getElementById('congratulationsScreen').style.display = 'flex';
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

function getCardType(card) {
    return card.querySelector('.front').style.backgroundImage.split('/').pop().split('.')[0];
}

// Confirmar saída
document.getElementById('confirmYes').addEventListener('click', () => {
    window.location.href = 'inicial.html';
});

document.getElementById('confirmNo').addEventListener('click', () => {
    document.getElementById('confirmationScreen').style.display = 'none';
});

window.addEventListener('load', startGame);
