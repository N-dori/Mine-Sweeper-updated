var gIsPused = true
var gStartTime = 0
var gelapsedTime = 0
var gmins = 0
var gsecs = 0
var gml = 0
var gInterval

function renderBoard(size) {
    var strHTML = ''
    for (let i = 0; i < size; i++) {
        strHTML += `<tr>`
        for (let j = 0; j < size; j++) {

            const className = `cell cell-${i}-${j}`
            strHTML += `<td data-i="${i}" data-j="${j} "class="${className}"
             onclick="cellClicked(this),lastClicked(this)"oncontextmenu="handelRightclick(this)" >
            </td>`

        }
        var elTable = document.querySelector('.board')
        elTable.innerHTML = strHTML
    }

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
function showlLife() {
    var elLifeCouner = document.querySelector('.life')
    elLifeCouner.innerHTML = LIFE
}
//--------------timer-----
function updateTimer() {

    gelapsedTime = Date.now() - gStartTime
    gml = (1000 + new Date().getMilliseconds()).toString().substring(1);
    gsecs = Math.floor((gelapsedTime / 1000) % 60)
    gmins = Math.floor((gelapsedTime / (1000 * 60) % 60))
    var elStoper = document.querySelector('.stoper')
    elStoper.innerText = `  ${pad(gmins)}:${pad(gsecs)}:${pad(gml)}`
}

function startTimer() {
    gStartTime = Date.now() - gelapsedTime

    gInterval = setInterval(updateTimer, 100)
}
function pad(unit) {
    return (("0") + unit).length > 2 ? unit : "0" + unit
}



function restartTimer() {
    gelapsedTime = 0
    gsecs = 0
    gml = 0
    clearInterval(gInterval)
    var elStoper = document.querySelector('.stoper')
    elStoper.innerText = `   00:00:00`
}


