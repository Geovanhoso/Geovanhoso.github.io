let score = 0;
let isDragging = false;
let dragFruitElement = null;
let originalX, originalY;
let dragPath = [];
let fruitsRemaining = 0; // Contador para rastrear o número de frutas restantes

const clown = document.getElementById('clown');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const particlesContainer = document.getElementById('particles');
const fruitsContainer = document.getElementById('fruits-container');
const throwSound = new Audio('throw.mp3');
const hitSound = new Audio('hit.mp3');

function handleButtonClick(level) {
    if (level === 'easy') {
        window.location.href = 'facil.html';
    } else if (level === 'medium') {
        window.location.href = 'medio.html';
    } else if (level === 'hard') {
        window.location.href = 'index.html';
    }
}

const fruitSounds = {
    'batata.png': new Audio('audios/batata.mp3'),
    'milho.png': new Audio('audios/milho.mp3'),
    'berinjela.png': new Audio('audios/berinjela.mp3'),
    'brocolis.png': new Audio('audios/brocolis.mp3'),
    'cenoura.png': new Audio('audios/cenoura.mp3'),
    'batatadoce.png': new Audio('audios/batatadoce.mp3'),
    'abobora.png': new Audio('audios/abobora.mp3'),
    'beterraba.png': new Audio('audios/beterraba.mp3')

};

const fruits = [
    'batata.png', 'milho.png', 'berinjela.png', 
    'brocolis.png', 'cenoura.png', 'batatadoce.png',
     'abobora.png', 'beterraba.png'
];

function endGame() {
    // Exibir a tela de parabenização
    document.getElementById('end-screen').classList.remove('hidden');
    
    // Chame a função de confetes aqui
    celebrateWithConfetti();
}

// Configurações para o nível "difícil"
const FRUIT_COUNT = 5;
const MIN_CLOWN_MOVE_DISTANCE = 100;
const FRUIT_SIZE = 80; // Tamanho das frutas
const PROHIBITED_AREAS = [
    { x: 0, y: 0, width: canvas.clientWidth / 3, height: canvas.clientHeight / 3 }, // Canto superior esquerdo
    { x: canvas.clientWidth * 2 / 3, y: 0, width: canvas.clientWidth / 3, height: canvas.clientHeight / 3 }, // Canto superior direito
    { x: 0, y: 60, width: 100, height: 80 }, // Área ao redor do placar
    { x: 0, y: 0, width: 60, height: 60 } // Área ao redor do botão de retorno
];

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

function createFruits(count) {
    fruitsRemaining = count; // Inicializa o contador de frutas restantes
    fruitsContainer.innerHTML = ''; // Limpa frutas existentes para evitar duplicação

    for (let i = 0; i < count; i++) {
        const fruitElement = document.createElement('div');
        fruitElement.classList.add('fruit');
        setRandomFruit(fruitElement);
        fruitElement.addEventListener('mousedown', onMouseDown);
        fruitsContainer.appendChild(fruitElement);
    }
}


function setRandomFruit(fruitElement) {
    const fruitType = fruits[Math.floor(Math.random() * fruits.length)];
    fruitElement.style.backgroundImage = `url('${fruitType}')`;
    const { x, y } = getRandomEdge();
    fruitElement.style.left = `${x}px`;
    fruitElement.style.top = `${y}px`;
    fruitElement.style.visibility = 'visible';
    fruitElement.style.transition = 'none';
}

function getRandomEdge() {
    const container = document.getElementById('game-container');
    const containerRect = container.getBoundingClientRect();

    function isInProhibitedArea(x, y) {
        return PROHIBITED_AREAS.some(area =>
            x >= area.x && x <= (area.x + area.width) &&
            y >= area.y && y <= (area.y + area.height)
        );
    }

    let edge;
    do {
        edge = [
            { x: 0, y: Math.random() * (containerRect.height - FRUIT_SIZE) },
            { x: containerRect.width - FRUIT_SIZE, y: Math.random() * (containerRect.height - FRUIT_SIZE) },
            { x: Math.random() * (containerRect.width - FRUIT_SIZE), y: containerRect.height - FRUIT_SIZE }
        ][Math.floor(Math.random() * 3)];
    } while (isInProhibitedArea(edge.x, edge.y));

    return edge;
}

function followMouse(event) {
    if (!isDragging || !dragFruitElement) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    dragFruitElement.style.left = `${mouseX - dragFruitElement.clientWidth / 2}px`;
    dragFruitElement.style.top = `${mouseY - dragFruitElement.clientHeight / 2}px`;

    dragPath.push({ x: mouseX, y: mouseY });
}

function onMouseDown(event) {
    if (isDragging) return; // Ignora se já estiver arrastando outro elemento

    dragFruitElement = event.target;
    if (!dragFruitElement.classList.contains('fruit')) return;

    throwSound.play();
    isDragging = true;
    dragPath = [];
    originalX = parseFloat(dragFruitElement.style.left);
    originalY = parseFloat(dragFruitElement.style.top);

    // Desativa a seleção de texto
    document.body.style.userSelect = 'none';

    document.addEventListener('mousemove', followMouse);
    document.addEventListener('mouseup', onMouseUp);
}

function onMouseUp() {
    if (isDragging && dragFruitElement) {
        isDragging = false;
        document.removeEventListener('mousemove', followMouse);
        document.removeEventListener('mouseup', onMouseUp);

        // Reativa a seleção de texto
        document.body.style.userSelect = '';

        checkCollisionAfterDrag(dragFruitElement);
        dragFruitElement = null;
    }
}

function checkCollisionAfterDrag(fruitElement) {
    const fruitRect = fruitElement.getBoundingClientRect();
    const fruitX = fruitRect.left + fruitRect.width / 2;
    const fruitY = fruitRect.top + fruitRect.height / 2;

    if (checkCollision(fruitX, fruitY)) {
        handleCollision(fruitElement);
    } else {
        animateReturnToOriginalPosition(fruitElement);
    }
}

function handleCollision(fruitElement) {
    if (soundsEnabled) {
        hitSound.play();
        const fruitType = fruitElement.style.backgroundImage.split('/').pop().split('"')[0];
        fruitSounds[fruitType]?.play();
    }
    createParticles(fruitElement.offsetLeft + fruitElement.clientWidth / 2, fruitElement.offsetTop + fruitElement.clientHeight / 2);
    score++;
    scoreDisplay.textContent = `Pontuação: ${score}`;

    // Mova o palhaço para o centro após a colisão
    moveClown(true);

    fruitElement.remove();
    fruitsRemaining--; // Decrementa o contador de frutas restantes

    // Verifica se não há mais frutas restantes
    if (fruitsRemaining === 0) {
        endGame(); // Exibe a tela de parabenização
        celebrateWithConfetti(); 
    }
}


function checkCollision(fruitX, fruitY) {
    const clownRect = clown.getBoundingClientRect();
    return (
        fruitX >= clownRect.left &&
        fruitX <= clownRect.right &&
        fruitY >= clownRect.top &&
        fruitY <= clownRect.bottom
    );
}

function animateReturnToOriginalPosition(fruitElement) {
    const duration = 500;
    const startX = parseFloat(fruitElement.style.left);
    const startY = parseFloat(fruitElement.style.top);
    const dx = originalX - startX;
    const dy = originalY - startY;
    const startTime = performance.now();

    function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentX = startX + dx * progress;
        const currentY = startY + dy * progress;

        fruitElement.style.left = `${currentX}px`;
        fruitElement.style.top = `${currentY}px`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            fruitElement.style.left = `${originalX}px`;
            fruitElement.style.top = `${originalY}px`;
            fruitElement.style.transition = 'left 0.1s linear, top 0.1s linear';
        }
    }

    requestAnimationFrame(animate);
}

function celebrateWithConfetti() {
    const numConfetti = 200; // Número de confetes
    const colors = [
        '#ff5722', '#ffeb3b', '#4caf50', '#2196f3', 
        '#9c27b0', '#e91e63', '#00bcd4', '#ff9800', 
        '#673ab7', '#795548', '#f44336', '#3f51b5'
    ];
    const shapes = ['circle', 'square', 'rectangle'];

    for (let i = 0; i < numConfetti; i++) {
        const particle = document.createElement('div');
        particle.classList.add('confete');

        // Escolha de forma aleatória
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        particle.classList.add(shape);

        const size = `${Math.random() * 20 + 10}px`; // Tamanho maior
        particle.style.width = size;
        particle.style.height = size;
        particle.style.position = 'absolute';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.opacity = '1';
        particle.style.zIndex = '1000'; // Garante que os confetes fiquem acima

        // Posição inicial
        particle.style.left = `${Math.random() * window.innerWidth}px`;
        particle.style.top = `${Math.random() * window.innerHeight}px`;
        document.body.appendChild(particle); // Adiciona ao body

        // Animação do confete
        animateParticle(particle);
    }
}


function animateParticle(particle) {
    const duration = Math.random() * 100 + 200; // Duração aleatória
    const startX = parseFloat(particle.style.left);
    const startY = parseFloat(particle.style.top);
    const endX = startX + (Math.random() - 0.5) * 600; // Movimento amplo
    const endY = startY + (Math.random() - 0.5) * 600; // Movimento amplo
    const startTime = performance.now();

    function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        const opacity = 1 - progress; // Desvanecimento
        const bounce = Math.sin(progress * Math.PI * 4) * 10; // Efeito de rebote

        particle.style.left = `${currentX}px`;
        particle.style.top = `${currentY + bounce}px`;
        particle.style.opacity = opacity;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            particle.remove(); // Remove o confete após a animação
        }
    }

    requestAnimationFrame(animate);
}




function createParticles(x, y) {
    const numParticles = 30; // Aumentado o número de confetes
    const colors = ['#ff5722', '#4caf50', '#2196f3', '#ffc107', '#9c27b0', '#e91e63', '#00bcd4']; // Cores vibrantes

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('confete');
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = `${Math.random() * 13 + 10}px`; // Tamanho aumentado
        particle.style.height = particle.style.width; // Mantém a forma de círculo
        particle.style.position = 'absolute';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        document.getElementById('particles').appendChild(particle);

        // Anima os confetes
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    const duration = Math.random() * 2000 + 1000; // Duração aleatória
    const startX = parseFloat(particle.style.left);
    const startY = parseFloat(particle.style.top);
    const endX = startX + (Math.random() - 0.5) * 200; // Movimento aleatório
    const endY = startY + (Math.random() - 0.5) * 200; // Movimento aleatório
    const startTime = performance.now();

    function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        const opacity = 1 - progress; // Desaparecer gradualmente

        particle.style.left = `${currentX}px`;
        particle.style.top = `${currentY}px`;
        particle.style.opacity = opacity;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            particle.remove(); // Remove o confete após a animação
        }
    }

    requestAnimationFrame(animate);
}


let timerStarted = false;
let countdownInterval;
const timerDisplay = document.getElementById('timer');
const soundToggleButton = document.querySelector('.sound-button');
let soundsEnabled = true;

function resetGame() {
    score = 0;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    createFruits(FRUIT_COUNT); // Cria exatamente 20 frutas
    moveClown(true); // Passa `true` para centralizar o palhaço
}

// Inicializa o jogo
resetGame();

const MIN_TOP_MARGIN = 100; // Margem mínima em pixels

function moveClown(center = false) {
    const container = document.getElementById('game-container');
    const containerRect = container.getBoundingClientRect();
    const clownRect = clown.getBoundingClientRect();

    const prohibitedAreas = PROHIBITED_AREAS.map(area => ({
        x: area.x,
        y: area.y,
        width: area.width,
        height: area.height
    }));

    function isInProhibitedArea(x, y) {
        return prohibitedAreas.some(area =>
            x >= area.x && x <= (area.x + area.width) &&
            y >= area.y && y <= (area.y + area.height)
        );
    }

    let newX, newY;

    if (center) {
        // Centraliza o palhaço no centro do container
        newX = (containerRect.width - clownRect.width) / 2;
        newY = (containerRect.height - clownRect.height) / 2;
    } else {
        // Move o palhaço aleatoriamente, mas com restrições
        do {
            newX = Math.random() * (containerRect.width - clownRect.width);
            newY = Math.random() * (containerRect.height - clownRect.height);
        } while (
            Math.abs(newX - parseFloat(clown.style.left)) < MIN_CLOWN_MOVE_DISTANCE &&
            Math.abs(newY - parseFloat(clown.style.top)) < MIN_CLOWN_MOVE_DISTANCE ||
            isInProhibitedArea(newX, newY)
        );
    }

    clown.style.left = `${newX}px`;
    clown.style.top = `${newY}px`;
}


document.getElementById('play-again-button').addEventListener('click', () => {
    document.getElementById('end-screen').classList.add('hidden');
    resetGame();
});

window.addEventListener('resize', () => {
    if (document.getElementById('end-screen').classList.contains('hidden')) {
        moveClown(true); // Reposiciona o palhaço no centro quando a tela é redimensionada
    }
});


//tela de sair ou ficar
document.getElementById('return-link').addEventListener('click', function(event) {
    event.preventDefault(); // Impede o redirecionamento imediato
    showExitModal(); // Mostra o modal
});

// Botão "Sim" que redireciona para index1.html
document.getElementById('confirm-exit-button').addEventListener('click', function() {
    window.location.href = 'index1.html'; // Redirecionar para a tela de seleção de níveis
});

// Botão "Não" que apenas fecha o modal
document.getElementById('cancel-exit-button').addEventListener('click', function() {
    hideExitModal(); // Esconder o modal e o fundo
});


function showExitModal() {
    const exitModal = document.getElementById('exit-modal');
    const overlay = document.getElementById('overlay');
    
    overlay.classList.add('visible'); // Exibir o fundo embaçado
    exitModal.classList.remove('hidden'); // Exibir o modal
}

function hideExitModal() {
    const exitModal = document.getElementById('exit-modal');
    const overlay = document.getElementById('overlay');
    
    overlay.classList.remove('visible'); // Esconder o fundo embaçado
    exitModal.classList.add('hidden'); // Esconder o modal
}


// No evento de clique dos botões de confirmação ou cancelamento
document.getElementById('confirm-exit-button').addEventListener('click', function() {
    hideExitModal(); // Esconder o modal e o fundo ao sair
    window.location.href = 'index1.html'; // Redirecionar
});

document.getElementById('cancel-exit-button').addEventListener('click', function() {
    hideExitModal(); // Apenas esconder o modal e o fundo
});


createFruits(FRUIT_COUNT); // Cria frutas no início do jogo com base no nível "difícil"
