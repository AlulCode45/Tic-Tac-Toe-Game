const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = canvas.scrollWidth
canvas.height = canvas.scrollHeight


const grids = []
const playerSelectedRow = []

const cellSize = canvas.width / 3

let playerActive = 0


let time = 31



var player1Wins = parseInt(localStorage.getItem('player1')) || 0;
var player2Wins = parseInt(localStorage.getItem('player2')) || 0;

document.getElementById('splash').innerHTML = 'Game ke - ' + ((player1Wins + player2Wins) == 0 ? 1 : (player1Wins + player2Wins) + 1)

let splashTime = 4
setTimeout(() => {
    splashTimer = setInterval(() => {
        splashTime -= 1
        document.getElementById('splash').innerHTML = splashTime
        if (splashTime == 0) {
            clearInterval(splashTimer)
            document.querySelector('.splash').style.display = 'none'

            playerTime = setInterval(() => {
                time -= 1
                document.getElementById('timer').innerHTML = time
                if (time == 0) {
                    time = 31
                    if (playerActive == 1) {
                        playerActive = 0
                        document.getElementById('giliran').innerHTML = 'Player 1'
                    } else {
                        playerActive = 1
                        document.getElementById('giliran').innerHTML = 'Player 2'
                    }
                }
            }, 1000);
        }
    }, 1000)
}, 1000);

if (player1Wins > player2Wins) {
    document.getElementById('rank').innerHTML = "<tr><td>Player 1</td><td>" + player1Wins + "</td></tr><tr><td>Player 2</td><td>" + player2Wins + "</td></tr>";
} else {
    document.getElementById('rank').innerHTML = "<tr><td>Player 2</td><td>" + player2Wins + "</td></tr><tr><td>Player 1</td><td>" + player1Wins + "</td></tr>";
}

const gamePattern = [
    [{ x: 0, y: 0 }, { x: 166.66666666666666, y: 0 }, { x: 333.3333333333333, y: 0 }],
    [{ x: 0, y: 166.66666666666666 }, { x: 166.66666666666666, y: 166.66666666666666 }, { x: 333.3333333333333, y: 166.66666666666666 }],
    [{ x: 0, y: 333.3333333333333 }, { x: 166.66666666666666, y: 333.3333333333333 }, { x: 333.3333333333333, y: 333.3333333333333 }],
]

let playerPattern = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined]
]

mouse = {
    x: undefined,
    y: undefined,
    width: 0.1,
    height: 0.1
}

let canvasPosition = canvas.getBoundingClientRect()
canvas.addEventListener('mousemove', e => {
    mouse.x = e.x - canvasPosition.left
    mouse.y = e.y - canvasPosition.top
})
canvas.addEventListener('mouseleave', e => {
    mouse.x = undefined
    mouse.y = undefined
})

class Cell {
    constructor(x, y, i) {
        this.x = x
        this.y = y
        this.width = cellSize
        this.height = cellSize
        this.i = i
        this.background = 'white'
    }
    draw() {
        ctx.fillStyle = this.background
        ctx.fillRect(this.x, this.y, this.width, this.height)

        ctx.strokeStyle = 'black'
        ctx.strokeRect(this.x, this.y, this.width, this.height)

        ctx.beginPath()
        ctx.fillStyle = 'rgba(0,0,0,0.1)'
        ctx.font = `${cellSize}px arial`
        ctx.fillText(this.i + 1, this.x + 25, this.y + cellSize - 25) // Perbaikan di sini
        ctx.closePath()

        if (mouse.x && mouse.y && collision(this, mouse)) {
            ctx.fillStyle = this.background == 'white' ? 'rgba(0,0,255,0.5)' : this.background
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
    update(color) {
        this.background = color
    }
}


//handle grids
let i = 0
for (let y = 0; y < canvas.width; y += cellSize) {
    for (let x = 0; x < canvas.height; x += cellSize) {
        grids.push(new Cell(x, y, i))
        i++
    }
}

//handle grids
function handleGrids() {
    for (let i = 0; i < grids.length; i++) {
        const grid = grids[i];
        grid.draw()
    }
}

class PlayerX {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = cellSize
        this.height = cellSize
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = 'black'
        ctx.font = `${cellSize}px arial`
        ctx.fillText('X', this.x + 25, this.y + cellSize - 25, this.width, this.height)
        ctx.closePath()
    }
    update(color) {
        this.background = color
    }
}


class PlayerO {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.width = cellSize
        this.height = cellSize
    }
    draw() {
        ctx.beginPath()
        ctx.fillStyle = 'black'
        ctx.font = `${cellSize}px arial`
        ctx.fillText('O ', this.x + 25, this.y + cellSize - 25, this.width, this.height)
        ctx.closePath()
    }
    update(color) {
        this.background = color
    }
}


function handleWin(player) {
    clearInterval(playerTime)
    switch (player) {
        case 1:
            if (localStorage.getItem('player1')) {
                localStorage.setItem('player1', parseInt(localStorage.getItem('player1')) + 1)
            } else {
                localStorage.setItem('player1', 1)
            }
            document.querySelector('.winner').style.display = 'grid'
            document.querySelector('.winner h1').innerHTML = 'Player 1 Win !!!'
            break;
        case 2:
            if (localStorage.getItem('player2')) {
                localStorage.setItem('player2', parseInt(localStorage.getItem('player2')) + 1)
            } else {
                localStorage.setItem('player2', 1)
            }
            document.querySelector('.winner').style.display = 'grid'
            document.querySelector('.winner h1').innerHTML = 'Player 2 Win !!!'
            break;
        default:
            break;
    }
}

function handleDraw() {
    clearInterval(playerTime)
    document.querySelector('.winner').style.display = 'grid'
    document.querySelector('.winner h1').innerHTML = 'NOBODY WINS'
    document.querySelector('.winner img').style.display = 'none'
}
canvas.addEventListener('click', e => {
    if (playerActive == 1) {
        playerActive = 0
        document.getElementById('giliran').innerHTML = 'Player 1'
    } else {
        playerActive = 1
        document.getElementById('giliran').innerHTML = 'Player 2'
    }

    const gridPositionX = mouse.x - (mouse.x % cellSize)
    const gridPositionY = mouse.y - (mouse.y % cellSize)

    // Menambahkan variabel untuk menentukan apakah kotak sudah dipilih sebelumnya
    let alreadySelected = false;

    // Memeriksa apakah kotak sudah dipilih sebelumnya
    playerSelectedRow.forEach(row => {
        if (row.x === gridPositionX && row.y === gridPositionY) {
            alreadySelected = true;
        }
    });

    // Jika kotak sudah dipilih sebelumnya, hentikan proses selanjutnya
    if (alreadySelected) {
        return;
    }

    if (playerActive == 1) {
        time = 31
        gamePattern?.map((y, i) => {
            y?.map((x, iY) => {
                const selected = () => {
                    if (x?.x == gridPositionX && x?.y == gridPositionY) {
                        return x
                    }
                }
                if (selected()?.x == gamePattern[0][0].x && selected()?.y == gamePattern[0][0].y) {
                    playerPattern[0][0] = 1
                } else if (selected()?.x == gamePattern[0][1].x && selected()?.y == gamePattern[0][1].y) {
                    playerPattern[0][1] = 1
                } else if (selected()?.x == gamePattern[0][2].x && selected()?.y == gamePattern[0][2].y) {
                    playerPattern[0][2] = 1
                }

                else if (selected()?.x == gamePattern[1][0].x && selected()?.y == gamePattern[1][0].y) {
                    playerPattern[1][0] = 1
                } else if (selected()?.x == gamePattern[1][1].x && selected()?.y == gamePattern[1][1].y) {
                    playerPattern[1][1] = 1
                } else if (selected()?.x == gamePattern[1][2].x && selected()?.y == gamePattern[1][2].y) {
                    playerPattern[1][2] = 1
                }

                else if (selected()?.x == gamePattern[2][0].x && selected()?.y == gamePattern[2][0].y) {
                    playerPattern[2][0] = 1
                } else if (selected()?.x == gamePattern[2][1].x && selected()?.y == gamePattern[2][1].y) {
                    playerPattern[2][1] = 1
                } else if (selected()?.x == gamePattern[2][2].x && selected()?.y == gamePattern[2][2].y) {
                    playerPattern[2][2] = 1
                }

            })
        })
        handleGame()
        playerSelectedRow.push(new PlayerX(gridPositionX, gridPositionY))
    } else {
        time = 31
        gamePattern?.map((y, i) => {
            y?.map((x, iY) => {
                const selected = () => {
                    if (x?.x == gridPositionX && x?.y == gridPositionY) {
                        return x
                    }
                }
                if (selected()?.x == gamePattern[0][0].x && selected()?.y == gamePattern[0][0].y) {
                    playerPattern[0][0] = 2
                } else if (selected()?.x == gamePattern[0][1].x && selected()?.y == gamePattern[0][1].y) {
                    playerPattern[0][1] = 2
                } else if (selected()?.x == gamePattern[0][2].x && selected()?.y == gamePattern[0][2].y) {
                    playerPattern[0][2] = 2
                }

                else if (selected()?.x == gamePattern[1][0].x && selected()?.y == gamePattern[1][0].y) {
                    playerPattern[1][0] = 2
                } else if (selected()?.x == gamePattern[1][1].x && selected()?.y == gamePattern[1][1].y) {
                    playerPattern[1][1] = 2
                } else if (selected()?.x == gamePattern[1][2].x && selected()?.y == gamePattern[1][2].y) {
                    playerPattern[1][2] = 2
                }

                else if (selected()?.x == gamePattern[2][0].x && selected()?.y == gamePattern[2][0].y) {
                    playerPattern[2][0] = 2
                } else if (selected()?.x == gamePattern[2][1].x && selected()?.y == gamePattern[2][1].y) {
                    playerPattern[2][1] = 2
                } else if (selected()?.x == gamePattern[2][2].x && selected()?.y == gamePattern[2][2].y) {
                    playerPattern[2][2] = 2
                }

            })
        })
        handleGame()
        playerSelectedRow.push(new PlayerO(gridPositionX, gridPositionY))
    }

})



function handlePlayerGame() {
    for (let i = 0; i < playerSelectedRow.length; i++) {
        const playerGame = playerSelectedRow[i];
        playerGame.draw()
    }
}

function handleGame() {
    if (playerPattern[0][0] == 1 && playerPattern[0][1] == 1 && playerPattern[0][2] == 1) {
        grids[0].update('yellow')
        grids[1].update('yellow')
        grids[2].update('yellow')
        return handleWin(1)
    } else if (playerPattern[0][0] == 1 && playerPattern[0][1] == 1 && playerPattern[0][2] == 1) {
        grids[0].update('yellow');
        grids[1].update('yellow');
        grids[2].update('yellow');
        return handleWin(1);
    } else if (playerPattern[1][0] == 1 && playerPattern[1][1] == 1 && playerPattern[1][2] == 1) {
        grids[3].update('yellow');
        grids[4].update('yellow');
        grids[5].update('yellow');
        return handleWin(1);
    } else if (playerPattern[2][0] == 1 && playerPattern[2][1] == 1 && playerPattern[2][2] == 1) {
        grids[6].update('yellow');
        grids[7].update('yellow');
        grids[8].update('yellow');
        return handleWin(1);
    } else if (playerPattern[0][0] == 1 && playerPattern[1][0] == 1 && playerPattern[2][0] == 1) {
        grids[0].update('yellow');
        grids[3].update('yellow');
        grids[6].update('yellow');
        return handleWin(1);
    } else if (playerPattern[0][1] == 1 && playerPattern[1][1] == 1 && playerPattern[2][1] == 1) {
        grids[1].update('yellow');
        grids[4].update('yellow');
        grids[7].update('yellow');
        return handleWin(1);
    } else if (playerPattern[0][2] == 1 && playerPattern[1][2] == 1 && playerPattern[2][2] == 1) {
        grids[2].update('yellow');
        grids[5].update('yellow');
        grids[8].update('yellow');
        return handleWin(1);
    } else if (playerPattern[0][0] == 1 && playerPattern[1][1] == 1 && playerPattern[2][2] == 1) {
        grids[0].update('yellow');
        grids[4].update('yellow');
        grids[8].update('yellow');
        return handleWin(1);
    } else if (playerPattern[0][2] == 1 && playerPattern[1][1] == 1 && playerPattern[2][0] == 1) {
        grids[2].update('yellow');
        grids[4].update('yellow');
        grids[6].update('yellow');
        return handleWin(1);
    }
    /////////////////////////////////////////////////////////////////////
    else if (playerPattern[0][0] == 2 && playerPattern[0][1] == 2 && playerPattern[0][2] == 2) {
        grids[0].update('yellow');
        grids[1].update('yellow');
        grids[2].update('yellow');
        return handleWin(2);
    } else if (playerPattern[1][0] == 2 && playerPattern[1][1] == 2 && playerPattern[1][2] == 2) {
        grids[3].update('yellow');
        grids[4].update('yellow');
        grids[5].update('yellow');
        return handleWin(2);
    } else if (playerPattern[2][0] == 2 && playerPattern[2][1] == 2 && playerPattern[2][2] == 2) {
        grids[6].update('yellow');
        grids[7].update('yellow');
        grids[8].update('yellow');
        return handleWin(2);
    } else if (playerPattern[0][0] == 2 && playerPattern[1][0] == 2 && playerPattern[2][0] == 2) {
        grids[0].update('yellow');
        grids[3].update('yellow');
        grids[6].update('yellow');
        return handleWin(2);
    } else if (playerPattern[0][1] == 2 && playerPattern[1][1] == 2 && playerPattern[2][1] == 2) {
        grids[1].update('yellow');
        grids[4].update('yellow');
        grids[7].update('yellow');
        return handleWin(2);
    } else if (playerPattern[0][2] == 2 && playerPattern[1][2] == 2 && playerPattern[2][2] == 2) {
        grids[2].update('yellow');
        grids[5].update('yellow');
        grids[8].update('yellow');
        return handleWin(2);
    } else if (playerPattern[0][0] == 2 && playerPattern[1][1] == 2 && playerPattern[2][2] == 2) {
        grids[0].update('yellow');
        grids[4].update('yellow');
        grids[8].update('yellow');
        return handleWin(2);
    } else if (playerPattern[0][2] == 2 && playerPattern[1][1] == 2 && playerPattern[2][0] == 2) {
        grids[2].update('yellow');
        grids[4].update('yellow');
        grids[6].update('yellow');
        return handleWin(2);
    }

    if ((playerPattern[0]?.filter(data => data).length + playerPattern[1]?.filter(data => data).length + playerPattern[2]?.filter(data => data).length) == 9) {
        handleDraw()
    }

}


function collision(first, second) {
    if (
        !(
            first.x > second.x + second.width ||
            first.x + first.width < second.x ||
            first.y > second.y + second.height ||
            first.y + first.height < second.y
        )
    ) {
        return true
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    handleGrids()
    handlePlayerGame()

    requestAnimationFrame(animate)
}

animate()