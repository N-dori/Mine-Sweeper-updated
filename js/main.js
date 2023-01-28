'use strict'
const victory = new Audio('clapping.wav')
const exposion = new Audio('explosion.mp3')
const MINE = '💣'
const EMPTY = ''
const FLAG = '🚩'
const SCERED = "😬"
const HAPPY = "😁"
const SAD = "😞"
var LIFE = 3
var gIsFirstClick = true
var gHint = {
    lastCellClicked: { i: 0, j: 0 },
    isHintOn: false,
    count: 3

}

var hintInterval



var gLevel = {
    size: 4,
    mines: 2,
}
var board
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCountForDisplay: 0,
    markedCountForVictory: 0,
    secsPassed: 0,
}

function onInit() {

    showlLife()
    restartTimer()
    board = buildBoard()
    renderBoard(gLevel.size)


}
function cellClicked(elCell) {
    var elLifeCouner = document.querySelector('.life')
    if (gGame.isOn) return
    if (gHint.isHintOn) {
        exposeNegs(elCell)
        return
    }
    // first make sure that you can't hit  a cell that is marked or shown   
    var i = +elCell.dataset.i
    var j = +elCell.dataset.j
    // update gLastCellClicked with the recent cell clicked for the hint
    var currPos = board[i][j]
    if (currPos.isShown) return
    if (currPos.isMarked) return

    // case its is a mine decreace life color cell borded in red for a secound
    if (currPos.isMine) {
        exposion.play()
        LIFE--
        elLifeCouner.innerHTML = LIFE
        elCell.style.borderColor = 'red'
        setTimeout(() => {
            elCell.style.borderColor = 'salmon'
        }, 1000);
        if (LIFE === 0) {
            handelGameOver()
        }
    } else {
        // if it is a first click
        handelFistClick(board, i, j)
        // if it is not a first click        
        expandShown(board, i, j)

    }


}
function handelRightclick(elCell) {

    var elMarkedCounter = document.querySelector('.counter')
    var i = +elCell.dataset.i
    var j = +elCell.dataset.j
    var currPos = board[i][j]

    if (currPos.isShown) return

    if (currPos.isMarked) {
        gGame.markedCountForDisplay++
        currPos.isMarked = false
        elCell.innerHTML = ""
        elMarkedCounter.innerHTML = +gGame.markedCountForDisplay
    } else {
        gGame.markedCountForDisplay--
        if (+gGame.markedCountForDisplay < 0) gGame.markedCountForDisplay = 0
        currPos.isMarked = true
        elCell.innerHTML = FLAG

    }

    console.log('gGame', gGame);

    elMarkedCounter.innerHTML = gGame.markedCountForDisplay
    checkvictory()

}

function expandShown(board, rowIdx, colIdx) {
    var currPos = board[rowIdx][colIdx]
    var elCell = document.querySelector(`.cell-${rowIdx}-${colIdx}`)
    //if the location clicked is empty with no neg mines
    if (currPos.minesAroundCount === EMPTY) {

        // if thet is the cese  than lets open them too  

        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                // normaly here we check that it is not the cell himself, however in this point  there is no need because that is the first condition we check 
                if (j < 0 || j >= board.length) continue
                var nextCellExpose = board[i][j]
                // if the cell is marked skip it            
                if (nextCellExpose.isMarked) continue
                // update the MODEL and DOM            
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.innerHTML = nextCellExpose.minesAroundCount
                elCell.style.backgroundColor = 'lightgray'
                nextCellExpose.isShown = true
                gGame.shownCount++

            }
        }
    } else {
        // if this cell has mines Negs this revel only that one        
        elCell.innerHTML = currPos.minesAroundCount
        elCell.style.backgroundColor = 'lightgray'
        currPos.isShown = true
    }


}

function handelFistClick(board, i, j) {
    if (gIsFirstClick) {
        // if it's first click start timer
        startTimer()
        //set mines on board but make sure not to place the mine,
        // in the newly preesed cell
        setMinesOnBoard(board, i, j)
        gIsFirstClick = false

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                var currPos = board[i][j]
                // here we set value for how many Negs mines this cell has                 
                if (!currPos.isMine) {
                    currPos.minesAroundCount = setMinesNegsCount(board, i, j)
                }
            }
        }
    }
    return
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    // go around each cell and count number of mines
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
function setMinesOnBoard(board, i, j) {
    var firstClickedCell = board[i][j]
    console.log('firstClickedCell', i, j);

    var count = 0
    var count1 = 0

    // the loop stop when we have all the mines we needed 
    while (count < gLevel.mines) {
        var random1 = getRandomInt(0, board.length)
        var random2 = getRandomInt(0, board.length)
        // if the new random loction is equle to the one just preesed skip it!
        if (firstClickedCell === board[random1][random2]) continue
        // skip it also , if it is a mine
        if (board[random1][random2].isMine) continue
        board[random1][random2].isMine = true
        // here we count who many mines there is on borad
        // once it is equle to the number of mines, break out of the loop
        count++
    }
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].isMine) {
                console.log('board[i][j]', i, j);
                gGame.markedCountForVictory++
                gGame.markedCountForDisplay++
                count1++
            }

        }
    }
    // update the DOM
    var elcounater = document.querySelector('.counter')
    elcounater.innerHTML = gGame.markedCountForDisplay
    return

}
function buildBoard() {
    var size = gLevel['size']
    var board = createMat(size, size)
    for (let i = 0; i < gLevel.size; i++) {
        for (let j = 0; j < gLevel.size; j++) {
            const cell = {
                minesAroundCount: EMPTY,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
            board[i][j] = cell
        }
    }
    return board
}

function changeLevel(num) {
    gGame.isOn = false
    if (num === 4) {

        gLevel.size = num
        gLevel.mines = num / 2
    }
    else if (num === 8) {
        console.log('hi8');

        gLevel.size = num
        gLevel.mines = num + 2

    }
    else if (num === 12) {
        gLevel.size = num
        gLevel.mines = num + 2
    }
    restartTimer()
    handelNewGame()
    onInit()
}
function checkvictory() {
    //  chack how many are marked. And how many are marked and mines
    //then check is the intial number of mines maches these who are mine and marked
    //  one more thing chack if ther is no more marked cells than the intial number of mines
    var minesAndMarked = 0
    var markedCells = 0
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            var currPos = board[i][j]
            if (currPos.isMine && currPos.isMarked) minesAndMarked++
            if (currPos.isMarked) markedCells++
            console.log('markedCells', markedCells);

            if (minesAndMarked === gGame.markedCountForVictory &&
                gIsFirstClick === false) {
                if (markedCells > gGame.markedCountForVictory) return
                gGame.isOn = true
                victory.play()
                restartTimer()
            }
        }
    }
}
function resetVariblsModelAndDom() {

    LIFE = 3
    gHint.count=3
    gGame.markedCountForDisplay = 0
    gGame.markedCountForVictory = 0
    gGame.shownCount = 0
    gGame.mineCount = 0
    gGame.isOn = false
    gIsFirstClick = true
    var elcells = document.querySelectorAll('.cell')
    var elsmailey = document.querySelector('.smailey')
    elsmailey.innerHTML = HAPPY
    elcells.forEach(elcell => {
        elcell.innerHTML = EMPTY
        elcell.style.backgroundColor = 'gray'

    });
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            var currPos = board[i][j]
            currPos.isMine = false
            currPos.isShown = false
            currPos.isMarked = false
        }

    }
}
function toggelHint(el) {
    if(gGame.isOn)return
    if(gIsFirstClick)return
    if (!gHint.isHintOn) {
        if (gHint.count === 0) return
 
        gHint.isHintOn = true
        el.style.backgroundColor = 'yellow'
    } else {
        gHint.isHintOn = false
        el.style.backgroundColor = 'gray'

    }
}

function exposeNegs(el) {
    lastClicked(el)
    // chack if hint is on ?
    if (gHint.isHintOn) {
        // save in to this array all the locations that we expose       
        var exposedCells = []
        // get the the location of the last cell clicked
        var rowIdx = gHint.lastCellClicked.i
        var colIdx = gHint.lastCellClicked.j
        console.log('gHint.lastCellClicked.i', gHint.lastCellClicked.i);
        console.log('gHint.lastCellClicked.j', gHint.lastCellClicked.j);
        // Neg loop to expose them all for one second
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                // if (i === rowIdx && j === colIdx) continue-- no need to skip 'this'
                if (j < 0 || j >= board.length) continue
                var currPos = board[i][j]
                if (currPos.isShown) continue

                var elCell = document.querySelector(`.cell-${i}-${j}`)
                exposedCells.push({ i: i, j: j })
                elCell.style.backgroundColor = 'pink'
                elCell.innerHTML = currPos.minesAroundCount
                if (currPos.isMine) elCell.innerHTML = MINE

            }
        }
        gHint.count--

        setTimeout(() => {
            var elHint=document.querySelector('.hint')
            for (let i = 0; i < exposedCells.length; i++) {

                var row = exposedCells[i].i
                var col = exposedCells[i].j

                var elCell1 = document.querySelector(`.cell-${row}-${col}`)
                elCell1.style.backgroundColor = 'gray'
                elCell1.innerHTML = EMPTY
                elHint.style.backgroundColor='gray'
                gHint.isHintOn = false
            }


        }, 1000);
    }

}
function lastClicked(elCell) {
    var i = +elCell.dataset.i
    var j = +elCell.dataset.j

    gHint.lastCellClicked.i = i
    gHint.lastCellClicked.j = j

}
function handelNewGame() {
    restartTimer()
    resetVariblsModelAndDom()
    onInit()
}
function handelGameOver() {
    // when is a game over turn smaily to be sad and show the locations of all mins
    gGame.isOn = true
    exposion.play()
    restartTimer()

    var elsmailey = document.querySelector('.smailey')
    elsmailey.innerHTML = SAD

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const currPos = board[i][j]
            var elcell = document.querySelector(`.cell-${i}-${j}`)
            if (currPos.isMine) {
                elcell.innerHTML = MINE
            }
        }
    }

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


