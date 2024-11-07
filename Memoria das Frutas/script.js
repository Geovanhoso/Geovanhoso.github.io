// Variáveis Globais
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let isGameActive = false;

// Arrays e Elementos do DOM
const cardsArray = [
    'maca', 'maca', 'banana', 'banana', 'morango', 'morango', 'uva', 'uva', 
    'abacaxi', 'abacaxi', 'pera', 'pera'
];

const cardElements = [];

// Funções do Jogo
function startGame() {
    isGameActive = true;
    matches = 0;
    const congratulationsScreen = document.getElementById('congratulationsScreen');
    congratulationsScreen.style.display = 'none'; // Esconde a tela de parabenização
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
        frontFace.style.backgroundImage = `url('images/${type}.png')`;
        
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
                setTimeout(endGame, 300); // Adiciona um atraso de 3 segundos antes de mostrar a tela final
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
    const congratulationsScreen = document.getElementById('congratulationsScreen');
    congratulationsScreen.style.display = 'flex'; // Exibe a tela de parabenização
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

//TELA DE SIM OU NAO
// Função para exibir a tela de confirmação
function showConfirmation() {
    const confirmationScreen = document.getElementById('confirmationScreen');
    confirmationScreen.style.display = 'flex';
}

// Função para sair do jogo
function exitGame() {
    window.location.href = 'inicial.html';
}

// Eventos para os botões de confirmação
document.getElementById('confirmYes').addEventListener('click', exitGame);
document.getElementById('confirmNo').addEventListener('click', () => {
    document.getElementById('confirmationScreen').style.display = 'none'; // Fecha a tela de confirmação
});

// Atualize o onclick do botão de voltar
document.querySelector('.back-button').onclick = showConfirmation;

// Inicializa o jogo quando a página carrega
window.addEventListener('load', startGame);
