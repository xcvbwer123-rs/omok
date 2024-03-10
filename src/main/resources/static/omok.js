

function clearBoard(){
    for(let row = 0; row < board_size; row++){
        for(let col = 0; col < board_size; col++){
            $(board_doms[row][col]).removeClass("board__col__same")
            $(board_doms[row][col]).removeClass("board__col__wall")
            $(board_doms[row][col]).removeClass("board__col__blank")
            $(board_doms[row][col]).addClass("board__col")
        }
    }
}

let isEnded = false
let currentColor
let dirs = [
    [0, 1],
    [-1, 1],
    [1, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
    [-1, -1],
    [1, -1],
]

const colors = {
    0: "Null",
    1: true,
    2: false
}

function checkNearby(row, col, stack, direction) {
    stack = stack != null ? stack : 0
    
    if(direction == null){
        for(let i = 0; i < dirs.length; i++){
            if(checkNearby(row, col, stack + 1, dirs[i])){
                return true
            }
        }

        return false
    }else{
        row = row + direction[0]
        col = col + direction[1]

        if((row < 0 || row >= board_size) || (col < 0 || col >= board_size)){
            return false
        }

        let currentColor = colors[boards[row][col]]

        if(stack >= 5){
            return true
        }else{
            if(currentColor == isWhite){
                return checkNearby(row, col, stack + 1, direction)
            }else{
                return false
            }
        }
    }
}

function isOutBounds(row, col){
    return row >= board_size || row < 0 || col >= board_size || col < 0
}

function checkRow(row, col, direction1, direction2){
    let blank = 0
    let met_wall = false
    let currentColor = isWhite
    
    let stack1 = 0
    let row1 = row
    let col1 = col
    while(blank < 2 && !met_wall){
        row1 += direction1[0]
        col1 += direction1[1]

        if(isOutBounds(row1, col1) || colors[boards[row1][col1]] == !currentColor){
            met_wall = true
        }

        if(!met_wall){
            if(colors[boards[row1][col1]] == "Null"){
                blank++

                if(blank >= 2){
                    met_wall = true
                }
            }else{
                stack1++
            }
        }
    }

    blank = 0
    met_wall = false
    let stack2 = 0
    let row2 = row
    let col2 = col
    while(blank < 2 && !met_wall){
        row2 += direction2[0]
        col2 += direction2[1]

        if(isOutBounds(row2, col2) || colors[boards[row2][col2]] == !currentColor){
            met_wall = true
        }

        if(!met_wall){
            if(colors[boards[row2][col2]] == "Null"){
                blank++

                if(blank >= 2){
                    met_wall = true
                }
            }else{
                stack2++
            }
        }
    }

    return stack1 + stack2 == 2 ? 1 : 0
}

function checkSam(row, col) {
    // clearBoard()
    
    for(let row = 0; row < board_size; row++){
        for(let col = 0; col < board_size; col++){
            if(colors[boards[row][col]] == currentColor){
                let samsam = 0

                samsam += checkRow(row, col, [1, 0], [-1, 0])
                samsam += checkRow(row, col, [1, 1], [-1, -1])
                samsam += checkRow(row, col, [-1, 1], [1, -1])
                samsam += checkRow(row, col, [0, 1], [0, -1])

                console.log(samsam)

                if(samsam >= 2){
                    return true
                }
            }
        }
    }

    let samsam = 0

    samsam += checkRow(row, col, [1, 0], [-1, 0])
    samsam += checkRow(row, col, [1, 1], [-1, -1])
    samsam += checkRow(row, col, [-1, 1], [1, -1])
    samsam += checkRow(row, col, [0, 1], [0, -1])

    console.log(samsam)

    if(samsam >= 2){
        return true
    }

    return false
}

const board_size = 17
const userId = guid()
let board_doms = {}
let boards = {}
let isWhite = false
let clickAble = true

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

function onWin(){
    if(isWhite){
        alert("흰돌이 이겼습니다.")
    }else{
        alert("검은돌이 이겼습니다.")
    }

    if(confirm("다시 하시겠습니다?")){
        location.reload()
    }
}

function putStone(data){
    console.log(data);

    let split = data.content.split("_")
    let row = split[0]*1
    let col = split[1]*1

    if(isWhite){
        board_doms[row][col].append(`<div class="white"></div>`)
        boards[row][col] = 1
    }else{
        board_doms[row][col].append(`<div class="black"></div>`)
        boards[row][col] = 2
    }

    currentColor = colors[boards[row][col]]

    let won = checkNearby(row, col);

    console.log("won", won);

    if(won){
        console.log("win")
        onWin()
        console.log("done")

        return
    // }else if(checkSam(row, col)){
    //     onWin()

    //     return
    }

    isWhite = !isWhite
    
    if(data.id != userId){
        clickAble = true
    }
}

$(document).ready(() => {
    const board = $(".board")

    for(let row = 0; row < board_size; row++){
        board_doms[row] = {};
        boards[row] = new Array(board_size);
        board.append(`<div id="row_`+row+`" class="board__row"></div>`)

        for(let col = 0; col < board_size; col++){
            $(`#row_`+row).append(`<div id="row_`+row+`_`+col+`" class="board__col">
                <div class="col__grid"></div>
            </div>`)

            board_doms[row][col] = $(`#row_`+row+`_`+col)
            boards[row][col] = 0

            board_doms[row][col].click(() => {
                if(boards[row][col] != 0 || clickAble == false){return}

                let lastColor = currentColor
                currentColor = isWhite

                if(isWhite){
                    boards[row][col] = 1
                }else{
                    boards[row][col] = 2
                }

                if(checkSam(row, col)){
                    currentColor = lastColor
                    boards[row][col] = 0
                    return alert("거기다 둘수 없습니다.")
                }

                clickAble = false
                sendRowData(row, col, userId)
            })
        }
    }
})