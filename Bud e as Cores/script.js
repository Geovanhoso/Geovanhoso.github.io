// Inicializar o alimento desejado e sua cor
const fruitImageElement = document.getElementById('fruit-image');
const foodImageElement = document.getElementById('food-image');
const colors = document.querySelectorAll('.color');
const foodContainer = document.querySelector('.food-container');
foodContainer.style.top = '65%'; // Ajuste o valor conforme necessário

// Dados dos alimentos e cores com caminhos das imagens
const foodData = {
    "Maçã": { color: "red", imageBw: "img/macapb.png", image: "img/maca.png" },
    "Brócolis": { color: "green", imageBw: "img/brocolispb.png", image: "img/brocolis.png" },
    "Mirtilo": { color: "blue", imageBw: "img/mirtilopb.png", image: "img/mirtilo.png" },
    "Banana": { color: "#ffd633", imageBw: "img/bananapb.png", image: "img/banana.png" },
    "Uva": { color: "#722e5c", imageBw: "img/uvapb.png", image: "img/uva.png" },
    "Laranja": { color: "#f17c0f", imageBw: "img/laranjapb.png", image: "img/laranja.png" },
    "Morango": { color: "red", imageBw: "img/morangopb.png", image: "img/morango.png" },
    "Abacaxi": { color: "#ffd633", imageBw: "img/abacaxipb.png", image: "img/abacaxi.png" },
    "Batata": { color: "#D0883E", imageBw: "img/batatapb.png", image: "img/batata.png" },
    "Melancia": { color: "green", imageBw: "img/melanciapb.png", image: "img/melancia.png" },
    "Limão": { color: "green", imageBw: "img/limaopb.png", image: "img/limao.png" },
    "Melão": { color: "#ffd633", imageBw: "img/melaopb.png", image: "img/melao.png" },
    "Maracujá": { color: "#ffd633", imageBw: "img/maracujapb.png", image: "img/maracuja.png" },
    "Batata Doce": { color: "#722e5c", imageBw: "img/batatadcpb.png", image: "img/batatadc.png" },
    "Abóbora": { color: "#f17c0f", imageBw: "img/aboborapb.png", image: "img/abobora.png" },
    "Milho": { color: "#ffd633", imageBw: "img/milhopb.png", image: "img/milho.png" },
    "Cenoura": { color: "#f17c0f", imageBw: "img/cenourapb.png", image: "img/cenoura.png" },
    "Maçã Verde": { color: "#51d938", imageBw: "img/macavdpb.png", image: "img/macaverde.png" },
    "Amora": { color: "#722e5c", imageBw: "img/amorapb.png", image: "img/amora.png" },
    "Beterraba": { color: "#722e5c", imageBw: "img/beterrabapb.png", image: "img/beterraba.png" },
    "Cereja": { color: "red", imageBw: "img/cerejapb.png", image: "img/cereja.png" },
    "Caqui": { color: "#f17c0f", imageBw: "img/caquipb.png", image: "img/caqui.png" },
    "Pera": { color: "#51d938", imageBw: "img/perapb.png", image: "img/pera.png" },
    "Kiwi": { color: "#51d938", imageBw: "img/kiwipb.png", image: "img/kiwi.png" },
    "Manga": { color: "#f17c0f", imageBw: "img/mangapb.png", image: "img/manga.png" },  
    "Abacate": { color: "#ffd633", imageBw: "img/abacatepb.png", image: "img/abacate.png" }
};

// Função para embaralhar o array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Troca
    }
    return array;
}

let foodArray = shuffleArray(Object.keys(foodData));
let currentIndex = 0;

// Função para mudar o alimento desejado
function chooseFood() {
    if (currentIndex >= foodArray.length) {
        currentIndex = 0;
        foodArray = shuffleArray(Object.keys(foodData));
        console.log("Reiniciando o array de frutas:", foodArray); // Log do array embaralhado
    }

    const currentFood = foodArray[currentIndex];
    console.log("Escolhendo fruta:", currentFood); // Log da fruta escolhida
    fruitImageElement.src = foodData[currentFood].image;
    foodImageElement.src = foodData[currentFood].imageBw;
    currentIndex++;
}

// Outras funções já existentes...
function showConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function handleDragStart(event) {
    event.stopPropagation();
    event.dataTransfer.setData('color', event.target.dataset.color);

    const ghost = document.createElement('div');
    ghost.className = 'ghost';
    ghost.style.backgroundColor = event.target.dataset.color;
    ghost.style.position = 'absolute';
    ghost.style.width = '60px'; // Tamanho da cor
    ghost.style.height = '60px'; // Tamanho da cor
    ghost.style.borderRadius = '50%';
    ghost.style.opacity = '0.7';
    document.body.appendChild(ghost);

    event.dataTransfer.setDragImage(ghost, 30, 30);
    setTimeout(() => {
        ghost.remove();
    }, 0);
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const color = event.dataTransfer.getData('color');

    if (color === foodData[foodArray[currentIndex - 1]].color || color === foodData[foodArray[currentIndex - 1]].color.toLowerCase()) {
        foodImageElement.src = foodData[foodArray[currentIndex - 1]].image;
        showConfetti();
        setTimeout(chooseFood, 1500); // Mudar o alimento após 1.5 segundos
    } else {
        console.log('Cor errada, tente novamente!');
    }
}

function handleDragEnd(event) {
    // Limpar quaisquer estilos ou classes relacionados ao arrasto
}

// Adicionar event listeners para os círculos de cor
colors.forEach(color => {
    color.addEventListener('dragstart', handleDragStart);
    color.addEventListener('dragend', handleDragEnd);
});

// Adicionar eventos de arrastar e soltar na imagem do alimento
foodImageElement.addEventListener('dragover', handleDragOver);
foodImageElement.addEventListener('drop', handleDrop);

// Inicializar o jogo
chooseFood();

// Música
const backgroundMusic = document.getElementById('background-music');
const audioIcon = document.querySelector('#start-music img');

let isPlaying = false;

function toggleMusic() {
    console.log("Toggle Music called. Is Playing:", isPlaying);
    if (isPlaying) {
        backgroundMusic.pause();
        audioIcon.src = 'img/mutar.png'; // Ícone de áudio
    } else {
        backgroundMusic.volume = 0.5;
        backgroundMusic.play().catch(error => {
            console.error('Erro ao tocar música:', error);
            alert('Por favor, interaja com a página antes de reproduzir o áudio.');
        });
        audioIcon.src = 'img/audiofundo.png'; // Ícone de mudo
    }
    isPlaying = !isPlaying;
}

// Adiciona o evento de clique ao botão
document.getElementById('start-music').addEventListener('click', function() {
    toggleMusic();
    this.classList.add('active');
});

// Remove a classe active ao soltar o botão
document.getElementById('start-music').addEventListener('mouseup', function() {
    this.classList.remove('active');
});

document.getElementById('start-music').addEventListener('mouseleave', function() {
    this.classList.remove('active');
});
