var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
context.scale(20, 20);
document.addEventListener('keydown', keyboardIn, false);

var board = createMatrix(12, 20);
var player = {
    pos: {
        x: 0,
        y: 0
    },
    matrix: null,
    score: 0
};
var colors = [null, '#FF0000', '#FFA500', '#0000FF', '#FFFF00', '#00FF00', '#FF00FF', '#00FFFF'];

var timeElapsed = 0;
var speed = 1000;
var lastTime = 0;
var level = 1;
var completedRows = 0;

newPiece();
updateCanvas();
update();

function keyboardIn(evt) {
    switch (evt.keyCode) {
        case 37:
            movePiece(-1);
            break;
        case 39:
            movePiece(1);
            break;
        case 65:
            movePiece(-1);
            break;
        case 68:
            movePiece(1);
            break;
        case 40:
            updatePiece();
            break;
        case 81:
            rotatePiece(-1);
            break;
        case 69:
            rotatePiece(1);
            break;
        case 83:
            updatePiece();
            break;
        case 38:
            rotatePiece(1);
            break;
        case 32:

            for(var i = 0; i < 20; ++i){
                player.pos.y++;
                if (collisionDetect(board, player)) {
                    player.pos.y--;
                    i=20
                    setPiece(board, player);
                    newPiece();
                    boardSweep();
                    updateCanvas();
                }
                timeElapsed = 0;
            }
            break;



    }
}

function boardSweep() {
    var rowCount = 1;
    outer: for (var y = board.length - 1; y > 0; --y) {
        for (var x = 0; x < board[y].length; ++x) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }

        var row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        ++y;

        player.score += rowCount * 10 * level;
        completedRows += rowCount;

        var templevel = level;
        templevel = Math.floor(completedRows / 25);
        if (templevel >= level) {
            level += 1;
            setLevel();
        }

        rowCount *= 2;
    }



}

function setLevel() {
    switch (level) {
        case 1:
            break;
        case 2:
            speed -= 100;
            break;
        case 3:
            speed -= 100;
            break;
        case 4:
            speed -= 100;
            break;
        case 5:
            speed -= 100;
            break;
        case 6:
            speed -= 100;
            break;
        case 7:
            speed -= 100;
            break;
        case 8:
            speed -= 100;
            break;
        case 9:
            speed -= 100;
            break;
        default:
            break;

    }
}

function collisionDetect(board, player) {
    for (var y = 0; y < player.matrix.length; ++y) {
        for (var x = 0; x < player.matrix[y].length; ++x) {
            if (player.matrix[y][x] !== 0 && (board[y + player.pos.y] && board[y + player.pos.y][x + player.pos.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    var tempM = [];
    for (h; h != 0; h--) {
        tempM.push(new Array(w).fill(0));
    }
    return tempM;
}

function createPiece(code) {
    switch (code) {
        case '1':

            return [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
            ];

        case '2':

            return [
                [0, 2, 0],
                [0, 2, 0],
                [0, 2, 2],
            ];

        case '3':

            return [
                [0, 3, 0],
                [0, 3, 0],
                [3, 3, 0],
            ];

        case '4':

            return [
                [4, 4],
                [4, 4],
            ];

        case '5':

            return [
                [5, 5, 0],
                [0, 5, 5],
                [0, 0, 0],
            ];

        case '6':

            return [
                [0, 6, 6],
                [6, 6, 0],
                [0, 0, 0],
            ];

        case '7':

            return [
                [0, 7, 0],
                [7, 7, 7],
                [0, 0, 0],
            ];

    }
}


function draw() {
    context.fillStyle = '#020';
    context.fillRect(0, 0, canvas.width, canvas.height);


    var ix = 0;
    var iy = 0;

    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + ix,
                    y + iy,
                    1, 1);
            }
        });
    });

    ix = player.pos.x;
    iy = player.pos.y;

    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + ix,
                    y + iy,
                    1, 1);
            }
        });
    });
}

function setPiece(board, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function rotate(matrix, dir) {
    for (var y = 0; y < matrix.length; ++y) {
        for (var x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function updatePiece() {
    player.pos.y++;
    if (collisionDetect(board, player)) {
        player.pos.y--;
        setPiece(board, player);
        newPiece();
        boardSweep();
        updateCanvas();
    }
    timeElapsed = 0;
}

function movePiece(offset) {
    player.pos.x += offset;
    if (collisionDetect(board, player)) {
        player.pos.x -= offset;
    }
}

function newPiece() {
    var pieces = '1234567';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (board[0].length / 2 | 0) -
        (player.matrix[0].length / 2 | 0);
    if (collisionDetect(board, player)) {
        board.forEach(row => row.fill(0));
        player.score = 0;
        completedRows = 0;
        level = 1;
        speed = 1000;
        updateCanvas();
    }
}

function rotatePiece(dir) {
    var pos = player.pos.x;
    var offset = 1;
    rotate(player.matrix, dir);
    while (collisionDetect(board, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}


function update(time = 0) {
    var deltaTime = time - lastTime;

    timeElapsed += deltaTime;
    if (timeElapsed > speed) {
        updatePiece();
    }

    lastTime = time;

    draw();
    requestAnimationFrame(update);
}

function updateCanvas() {
    document.getElementById('score').innerText = "Score: " + player.score;
    document.getElementById('level').innerText = "Level: " + level;
}