'use strict'
const victory= new Audio('clapping.wav')
const MINE = '💣'
const EMPTY = ''
const FLAG = '🚩'
const SCERED = "😬"
const HAPPY = "😁"
const SAD = "😞"
var gIsFirstClick = true


var gLevel = {
    size: 4,
    mines: 2,
}
var gBoard
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

function onInit() {
    gGame.shownCount = 0
    gGame.mineCount = 0
    gGame.markedCount = 0
    gBoard = buildBoard()
    setMinesOnBoard(gBoard)
    renderBoard(gBoard)

}
function changeLevel(num) {
    gGame.isOn = false
    if (num === 4) {
        gLevel.size = num
        gLevel.mines = num / 2
    }
    else if (num === 6) {
        gLevel.size = num
        gLevel.mines = (num ** 2) / 3
    }
    else if (num === 8) {
        gLevel.size = num
        gLevel.mines = (num ** 2) / 3
    }
    handelNewGame()
    onInit()
}
function checkvictory() {
    // var mineMarked = 0
    // var nonMineShown = 0
    // for (let i = 0; i < gBoard.length; i++) {
    //     for (let j = 0; j < gBoard[i].length; j++) {
    //         var currCell = gBoard[i][j]
    //         if (currCell.isMine) {
    //             if (currCell.isMarked) mineMarked++
    //         } else {
    //             if (currCell.isShown) nonMineShown++
    //         }
    //     }
    // }
    // if ((mineMarked == +gLevel.mines) &&
    //     (nonMineShown == (gLevel.size ** 2) - (+gLevel.mines))) {
    //     console.log('victory');

    // }
    if (gGame.markedCount === 0) victory.play()

}
function handelNewGame() {
    gGame.shownCount = 0
    gGame.mineCount = 0
    gGame.isOn = false
    gIsFirstClick = true
    const elcells = document.querySelectorAll('.cell')
    const elsmailey = document.querySelector('.smailey')
    elsmailey.innerHTML = HAPPY
    elcells.forEach(elcell => {
        elcell.innerHTML = EMPTY
        elcell.style.backgroundColor = 'gray'

    });
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            var currPos = gBoard[i][j]
            currPos.isMine = false
            currPos.isShown = false
            currPos.isMarked = false
        }

    }

    console.log('gBord', gBoard);

    onInit
}
function handelGameOver() {
    var elsmailey = document.querySelector('.smailey')

    elsmailey.innerHTML = SAD
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {

            const currPos = gBoard[i][j]
            var elcell = document.querySelector(`.cell-${i}-${j}`)
            if (currPos.isMine) {
                elcell.innerHTML = MINE
            } else {
                elcell.innerHTML = gBoard[i][j].minesAroundCount
            }
        }
    }
}

function handelRightclick(elCell) {
    console.log('gBord', gBoard);

    var elMarkedCounter = document.querySelector('.counter')
    var i = +elCell.dataset.i
    var j = +elCell.dataset.j
    var currPos = gBoard[i][j]
    if (currPos.isMine) gGame.markedCount = gGame.markedCount - 1
    if (currPos.isShown === true) return
    if (currPos.isMarked) {
        currPos.isMarked = false
        elCell.innerHTML = ""
        elMarkedCounter.innerHTML = +gGame.markedCount
    } else {
        currPos.isMarked = true
        elCell.innerHTML = FLAG

    }

    console.log('gGame', gGame);

    elMarkedCounter.innerHTML = gGame.markedCount
    checkvictory()

}

function cellClicked(elCell) {
    if (gGame.isOn) return
    var i = +elCell.dataset.i
    var j = +elCell.dataset.j
    var currPos = gBoard[i][j]

    if (currPos.isMine) {
        handelGameOver()
        gGame.isOn = true
    } else {
        currPos.isShown = true
        elCell.innerHTML = gBoard[i][j].minesAroundCount
        elCell.style.backgroundColor = 'lightgray'
        handelFistClick(elCell, i, j)
        expandShown(gBoard,  i, j)

    }


}
function expandShown(board, rowIdx, colIdx) {

    if (board[rowIdx][colIdx].minesAroundCount === EMPTY) {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (i === rowIdx && j === colIdx) continue
                if (j < 0 || j >= board.length) continue
                if (board[i][j].isMine) continue
                gGame.shownCount++
                if (board[i][j].minesAroundCount !== MINE) {
                    var elCell = document.querySelector(`.cell-${i}-${j}`)
                    elCell.innerHTML = board[i][j].minesAroundCount
                    board[i][j].isShown = true
                }

                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.style.backgroundColor = 'lightgray'
                console.log('board[i][j].isShown', board[i][j].isShown);
            }
        }
    }


}

function handelFistClick(elcell, i, j) {
    if (gIsFirstClick) {
        gBoard[i][j].isShown = true
        elcell.style.backgroundColor = 'lightgray'
        gIsFirstClick = false
        // setMinesOnBoard(gBoard)

        for (let i = 0; i < gBoard.length; i++) {
            for (let j = 0; j < gBoard[i].length; j++) {
                var currPos = gBoard[i][j]
                if (!currPos.isMine) {
                    currPos.minesAroundCount = setMinesNegsCount(gBoard, i, j)
                }
            }
        }
    }
    return
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var mineCount = 0
    if (board[rowIdx][colIdx].isMine) return
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board.length) continue
            var currCell = board[i][j]
            if (currCell.isMine === true) mineCount++
        }
    }
    if (mineCount === 0) return EMPTY
    return mineCount
}

function renderBoard(board) {
    var strHTML = ''
    for (let i = 0; i < gLevel.size; i++) {
        strHTML += `<tr>`
        for (let j = 0; j < gLevel.size; j++) {

            const className = `cell cell-${i}-${j}`
            strHTML += `<td data-i="${i}" data-j="${j} "class="${className}"
             onclick="cellClicked(this)"oncontextmenu="handelRightclick(this)" >
            </td>`

        }
        var elTable = document.querySelector('.board')
        elTable.innerHTML = strHTML
    }

}


function buildBoard() {
    var size = gLevel['size']
    var board = createMat(size, size)
    for (let i = 0; i < gLevel.size; i++) {
        for (let j = 0; j < gLevel.size; j++) {
            const cell = {
                minesAroundCount: "",
                isShown: false,
                isMine: false,
                isMarked: false,
            }
            board[i][j] = cell
        }
    }
    return board
}

function setMinesOnBoard(board) {

    for (let i = 0; i < gLevel.mines; i++) {

        board[getRandomInt(0, board.length)][getRandomInt(0, board.length)].isMine = true
        gGame.markedCount++
    }
    // board[2][3].isMine = true
    // board[0][2].isMine = true
    // gGame.markedCount = 2
    var elcounater = document.querySelector('.counter')
    elcounater.innerHTML= gGame.markedCount 
    return

}

function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push()
        }
        mat.push(row)
    }
    return mat
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
// --------------- mouse events----------------------------
document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
}, true);
document.addEventListener('mousedown', function () {
    var elsmailey = document.querySelector('.smailey')
    elsmailey.innerHTML = SCERED
});
document.addEventListener('mouseup', function () {
    var elsmailey = document.querySelector('.smailey')
    elsmailey.innerHTML = HAPPY
});

