let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

// inny rodzaj mapy

//L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//}).addTo(map);

const img = new Image();
const canvas = document.createElement('canvas');
const stage = canvas.getContext('2d');
let pieces = [];
let puzzleWidth;
let puzzleHeight;
let pieceWidth;
let pieceHeight;
let currentPiece;
let currentDropPiece;
let mouse;

// Request notification permission
if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            new Notification("Powiadomienia włączone!");
        }
    });
}

// Handle "Moja lokalizacja" button
document.getElementById("getLocation").addEventListener("click", function () {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
        return;
    }

    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        map.setView([lat, lon], 18);
        L.marker([lat, lon]).addTo(map).bindPopup("Twoja lokalizacja").openPopup();
    }, positionError => {
        console.error(positionError);
    });
});

// Handle "Pobierz mapę" button
document.getElementById("saveButton").addEventListener("click", function () {
    if (typeof leafletImage !== 'function') {
        console.error("leafletImage is not defined");
        return;
    }
    leafletImage(map, function(err, canvas) {
        if (err) {
            console.error("Błąd podczas tworzenia obrazu:", err);
            return;
        }

        // Konwersja canvas do formatu base64
        var imgData = canvas.toDataURL('image/png');

        // Wstawienie obrazu do elementu <img> na stronie
        var imageElement = document.getElementById('puzzleImage');
        imageElement.src = imgData;  // Ustawiamy źródło obrazu na wygenerowane dane base64
        imageElement.style.display = 'block';  // Wyświetlamy obraz (domyślnie jest ukryty)
    });
    leafletImage(map, function (err, imgCanvas) {
        if (err) {
            console.error("Error creating image:", err);
            return;
        }
        img.src = imgCanvas.toDataURL();
        img.onload = function () {
            initPuzzle(imgCanvas);
        };
    });
});

function initPuzzle(canvas) {
    pieces = [];
    mouse = { x: 0, y: 0 };
    currentPiece = null;
    currentDropPiece = null;
    puzzleWidth = canvas.width;
    puzzleHeight = canvas.height;
    pieceWidth = Math.floor(puzzleWidth / 4);
    pieceHeight = Math.floor(puzzleHeight / 4);

    setCanvas();
    buildPieces();
}

function setCanvas() {
    canvas.width = puzzleWidth;
    canvas.height = puzzleHeight;
    canvas.style.border = "1px solid black";
    document.getElementById('board').appendChild(canvas);
}

function buildPieces() {
    let xPos = 0;
    let yPos = 0;

    for (let i = 0; i < 16; i++) {
        const piece = { sx: xPos, sy: yPos };
        pieces.push(piece);
        xPos += pieceWidth;
        if (xPos >= puzzleWidth) {
            xPos = 0;
            yPos += pieceHeight;
        }
    }
    shufflePuzzle();
}

function shufflePuzzle() {
    pieces = shuffleArray(pieces);
    let xPos = 0;
    let yPos = 0;

    stage.clearRect(0, 0, puzzleWidth, puzzleHeight);

    for (const piece of pieces) {
        piece.xPos = xPos;
        piece.yPos = yPos;
        stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, xPos, yPos, pieceWidth, pieceHeight);
        stage.strokeRect(xPos, yPos, pieceWidth, pieceHeight);
        xPos += pieceWidth;
        if (xPos >= puzzleWidth) {
            xPos = 0;
            yPos += pieceHeight;
        }
    }
    document.onpointerdown = onPuzzleClick;
}

function checkPieceClicked() {
    for (const piece of pieces) {
        if (mouse.x < piece.xPos || mouse.x > piece.xPos + pieceWidth || mouse.y < piece.yPos || mouse.y > piece.yPos + pieceHeight) {
            continue;
        }
        return piece;
    }
    return null;
}

function updatePuzzle(e) {
    currentDropPiece = null;
    mouse.x = e.offsetX - canvas.offsetLeft;
    mouse.y = e.offsetY - canvas.offsetTop;

    stage.clearRect(0, 0, puzzleWidth, puzzleHeight);

    for (const piece of pieces) {
        if (piece === currentPiece) continue;
        stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);

        if (!currentDropPiece && mouse.x > piece.xPos && mouse.x < piece.xPos + pieceWidth &&
            mouse.y > piece.yPos && mouse.y < piece.yPos + pieceHeight) {
            currentDropPiece = piece;
            stage.save();
            stage.globalAlpha = 0.4;
            stage.fillStyle = "#009900";
            stage.fillRect(currentDropPiece.xPos, currentDropPiece.yPos, pieceWidth, pieceHeight);
            stage.restore();
        }
    }

    stage.save();
    stage.globalAlpha = 0.6;
    stage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - pieceWidth / 2, mouse.y - pieceHeight / 2, pieceWidth, pieceHeight);
    stage.restore();
    stage.strokeRect(mouse.x - pieceWidth / 2, mouse.y - pieceHeight / 2, pieceWidth, pieceHeight);
}

function onPuzzleClick(e) {
    mouse.x = e.offsetX - canvas.offsetLeft;
    mouse.y = e.offsetY - canvas.offsetTop;

    currentPiece = checkPieceClicked();

    if (currentPiece) {
        stage.clearRect(currentPiece.xPos, currentPiece.yPos, pieceWidth, pieceHeight);
        stage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - pieceWidth / 2, mouse.y - pieceHeight / 2, pieceWidth, pieceHeight);
        document.onpointermove = updatePuzzle;
        document.onpointerup = pieceDropped;
    }
}

function pieceDropped() {
    document.onpointermove = null;
    document.onpointerup = null;

    if (currentDropPiece) {
        [currentPiece.xPos, currentPiece.yPos, currentDropPiece.xPos, currentDropPiece.yPos] =
            [currentDropPiece.xPos, currentDropPiece.yPos, currentPiece.xPos, currentPiece.yPos];
    }

    resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin() {
    stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
    let gameWin = true;

    for (const piece of pieces) {
        stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);

        if (piece.xPos !== piece.sx || piece.yPos !== piece.sy) gameWin = false;
    }

    if (gameWin) {
        if (Notification.permission === "granted") {
            new Notification("Puzzle completed!");
        } else {
            alert("Puzzle completed!");
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}