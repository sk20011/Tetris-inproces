// Inicio del canvas
const canvas = document.querySelector('#board');
const contexto = canvas.getContext('2d');

const canvasReserva = document.querySelector('#reservaPieza');
const contextoReserva = canvasReserva.getContext('2d');

const anchoDeBloque = 15;
const altoDeBloque = 22.02;
const tamanyoBloque = 30;

canvas.width = tamanyoBloque * anchoDeBloque;
canvas.height = tamanyoBloque * altoDeBloque;
canvasReserva.width = tamanyoBloque * 5;
canvasReserva.height = tamanyoBloque * 5;

contexto.scale(tamanyoBloque, tamanyoBloque);
contextoReserva.scale(tamanyoBloque, tamanyoBloque);

// Definición del tablero (board)
// Crea una matriz bidimensional para representar el tablero del juego
// altoDeBloque es el número de filas y anchoDeBloque es el número de columnas
const board = Array.from({ length: altoDeBloque }, () => Array(anchoDeBloque).fill(0));
//const scoreElement = document.getElementById('score'); // Asume que tienes un elemento para mostrar la puntuación

// Variable para la puntuación
let puntuacion = 0;


// Definición de las piezas disponibles en el juego
const piezas = {
    "cuadrado": [
        [1, 1],
        [1, 1]
    ],
    "rectangulo": [
        [1],
        [1],
        [1],
        [1]
    ],
    "ele": [
        [1, 0],
        [1, 0],
        [1, 1]
    ],
    "eleInvertida": [
        [0, 1],
        [0, 1],
        [1, 1]
    ],
    "zeta": [
        [1, 1, 0],
        [0, 1, 1]
    ],
    "zetaInvertida": [
        [0, 1, 1],
        [1, 1, 0]
    ],
    "te": [
        [0, 1],
        [1, 1],
        [0, 1]
    ]
};

let piezaGuardada = null;

// Función para obtener una pieza aleatoria del conjunto de piezas
function obtenerPiezaRandom() {
    const nombresPiezas = Object.keys(piezas); // Obtiene un array con los nombres de todas las piezas del objeto `piezas`
    const nombrePieza = nombresPiezas[Math.floor(Math.random() * nombresPiezas.length)]; // Selecciona un nombre de pieza aleatorio usando un índice aleatorio
    return piezas[nombrePieza]; // Retorna la pieza correspondiente al nombre seleccionado
}

// Define la variable 'piezaActual' usando 'let' para que su alcance esté limitado al bloque donde se declara
let piezaActual = {
    "position": {
        x: 6, // Coordenada x inicial de la pieza
        y: 0  // Coordenada y inicial de la pieza
    },
    "shape": obtenerPiezaRandom() // Llama a la función para obtener una pieza aleatoria
};

// Esta función reinicia el juego.
function resetGame(){
    // Reinicia la puntuación del jugador.
    puntuacion = 0;
    // Establece la posición inicial de la pieza en el tablero.
    piezaActual = {
        "position": {
            x: 6, // Coordenada x inicial de la pieza
            y: 0  // Coordenada y inicial de la pieza
        },
        // Obtiene una pieza aleatoria y la asigna como pieza actual.
        "shape": obtenerPiezaRandom() // Llama a la función para obtener una pieza aleatoria
    };
    // Resetea la pieza guardada a null.
    piezaGuardada = null;
    // Dibuja la reserva de piezas en la interfaz.
    drawReserva() 
    // Establece todas las celdas del tablero a 0 (vacías).
    board.forEach(fila => fila.fill(0));
    // Dibuja el estado actual del tablero.
    draw();
}

// Define una función asincrónica llamada 'update'
async function update() {
    draw(); // Llama a la función 'draw' para dibujar el estado actual del juego

    await sleep(1000); // Espera 1000 milisegundos (1 segundo) antes de continuar con la siguiente instrucción

    piezaActual.position.y++; // Incrementa la coordenada y de la pieza actual en 1, moviendo la pieza hacia abajo

    if (colisionCurrent()) { // Comprueba si la pieza actual ha colisionado con algo
        piezaActual.position.y--; // Si hay colisión, revertir la última acción moviendo la pieza hacia arriba
        fijarPieza(); // Fija la pieza en su posición actual en el tablero
        limpiarLineasCompletas(); // Limpia las líneas completas del tablero
        piezaActual = { // Genera una nueva pieza en la posición inicial
            "position": { x: 6, y: 0 },
            "shape": obtenerPiezaRandom()
        };

        // Verifica si la nueva pieza colisiona en la parte superior del tablero, lo que significa que el juego ha terminado
        if (colisionCurrent()) {
            alert("Game Over"); // Muestra un mensaje de "Game Over"
            resetGame();
             // Termina la función update, deteniendo el juego
        }
    }

    window.requestAnimationFrame(update); // Solicita al navegador que ejecute 'update' de nuevo en el próximo ciclo de animación
}


//Funcion para el canvasReserva
function drawReserva() {
    contextoReserva.fillStyle = '#000'; // Establece el color de relleno a negro
    contextoReserva.fillRect(0, 0, canvasReserva.width, canvasReserva.height); // Rellena el canvas con el color de fondo

// Dibuja la pieza guardada en el canvasReserva
    if (piezaGuardada != null) {
        let margenAlto = (5 - piezaGuardada.shape.length)/2;
        let margenAncho = (5 - piezaGuardada.shape[0].length)/2;
        piezaGuardada.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) { // Si el valor en la posición (x, y) es 1, dibuja un bloque amarillo
                    contextoReserva.fillStyle = 'yellow';
                    contextoReserva.fillRect(x+margenAncho, y+margenAlto, 1, 1);
                }
            });
        });
    }
}


// Modifica la función draw para que dibuje la cuadrícula antes de dibujar el tablero y las piezas
function draw() {
    contexto.fillStyle = '#000'; // Establece el color de relleno a negro
    contexto.fillRect(0, 0, canvas.width, canvas.height); // Rellena el canvas con el color de fondo


    // Dibuja el tablero
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value == 1) { // Si el valor en la posición (x, y) es 1, dibuja un bloque verde
                contexto.fillStyle = 'green';
                contexto.fillRect(x, y, 1, 1);
            }
        });
    });

    // Dibuja la pieza actual
    piezaActual.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) { // Si el valor en la posición (x, y) es 1, dibuja un bloque amarillo
                contexto.fillStyle = 'yellow';
                contexto.fillRect(x + piezaActual.position.x, y + piezaActual.position.y, 1, 1);
            }
        });
    });
}

// Función para eliminar la fila si está completa
function limpiarLineasCompletas() {
    let y = board.length - 1;
    while (y >= 0) {
        if (board[y].every(value => value === 1)) {
            board.splice(y, 1); // Elimina la fila completa
            board.unshift(Array(anchoDeBloque).fill(0)); // Añade una nueva fila vacía en la parte superior del tablero
            completeLineFound = true;
            const score = document.getElementById("score")
            puntuacion += 100;
            score.innerText = `Puntuación: ${puntuacion}`;
            console.log(`puntuacion: ${puntuacion}`)
        }
        else y--;
    }
}

// Función para fijar la pieza actual en el tablero
function fijarPieza() {
    piezaActual.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) { // Si el valor en la posición (x, y) es 1
                board[piezaActual.position.y + y][piezaActual.position.x + x] = value; // Fija el valor en la posición correspondiente del tablero
            }
        });
    });
}
// Control de eventos del teclado para mover y rotar la pieza
document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft') {
        piezaActual.position.x--; // Mueve la pieza a la izquierda
        if (colisionCurrent()) { // Si hay colisión, revertir el movimiento
            piezaActual.position.x++;
        }
        draw(); // Redibuja el estado del juego
    } else if (event.code === 'ArrowRight') {
        piezaActual.position.x++; // Mueve la pieza a la derecha
        if (colisionCurrent()) { // Si hay colisión, revertir el movimiento
            piezaActual.position.x--;
        }
        draw(); // Redibuja el estado del juego
    } else if (event.code === 'ArrowDown') {
        piezaActual.position.y++; // Mueve la pieza hacia abajo
        if (colisionCurrent()) { // Si hay colisión, revertir el movimiento
            piezaActual.position.y--;
        }
        draw(); // Redibuja el estado del juego

    } else if (event.code === "Space") {
        do {
            piezaActual.position.y++ //Mueve la pieza hasta abajo
        } while (!colisionCurrent())
        piezaActual.position.y--; //Una vez colisiona, se deja colocado encima
        draw(); // Redibuja el estado del juego

    } else if (event.code === 'ArrowUp') {
        rotate(); // Rota la pieza
        draw(); // Redibuja el estado del juego
    }
});

// Función para rotar la pieza
function rotate() {
    const auxPieza = rotarPieza(piezaActual.shape); // Calcula la rotación de la pieza actual
    if (!colision(piezaActual.position.x, piezaActual.position.y, auxPieza)) { // Si no hay colisión, aplica la rotación
        piezaActual.shape = auxPieza;
    }
}

// Función para rotar una pieza 90 grados en sentido horario
function rotarPieza(pieza) {
    const n = pieza.length;
    const m = pieza[0].length;
    const piezaAux = Array.from({ length: m }, () => Array(n).fill(0));
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            piezaAux[i][j] = pieza[n - 1 - j][i];
        }
    }
    return piezaAux;
}

// Función para pausar la ejecución por un tiempo determinado
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para verificar si hay colisión
function colision(positionX, positionY, auxPieza) {
    return auxPieza.some((row, y) => {
        return row.some((value, x) => {
            const piezaY = y + positionY;
            const piezaX = x + positionX;

            // Verifica si la posición está fuera del tablero verticalmente o horizontalmente
            if (piezaY >= altoDeBloque || piezaX >= anchoDeBloque || piezaX < 0) {
                return true;
            }
            // Verifica colisión con las piezas en el tablero
            return value !== 0 && board[piezaY]?.[piezaX] !== 0;
        });
    });
}

// Función para verificar colisión con la pieza actual
function colisionCurrent() {
    return colision(piezaActual.position.x, piezaActual.position.y, piezaActual.shape);
}

function guardarPieza(event) {
    if (piezaGuardada === null) {
        piezaGuardada = piezaActual;
        piezaActual = { "position": { x: 6, y: 0 }, "shape": obtenerPiezaRandom() };
    } else {
        const temp = piezaActual;
        piezaActual = piezaGuardada;
        piezaActual.position = { x: 6, y: 0 };
        piezaGuardada = temp;
    }
    draw();
    drawReserva();
}

document.getElementById('reserva').addEventListener('click', guardarPieza);


// Inicia el bucle de actualización del juego
drawReserva();
update();
