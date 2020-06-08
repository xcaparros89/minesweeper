import Timer from './timer.js'

//select the div where we will put the grid
const grid = document.querySelector('.grid');
//width and height of the grid
let width = 10;
//number of bombs
let bombAmount = 20;
//array where we will put the position of bombs
let squares = [];
//array to use to look at the neightbours of the square clicked
let arround = [-1, -9, -10, -11, +1, +11, +10, +9]
let upArround = [-1, +1, +11, +10, +9]
let downArround = [-1, -9, -10, -11, +1]
let leftArround = [ -9, -10, +1, +11, +10]
let rightArround = [-1, -10, -11, +10, +9]
let upLeftArround = [+1, +11, +10]
let upRightArround = [-1, +9, +10]
let downLeftArround = [-10, -9, +1]
let downRightArround = [-11, -10, -1]
//array with the number of bombs
const bombsArray= Array(bombAmount).fill('bomb')
//array with the number of free spaces but one, because we will add the square of the first click
const emptyArray = Array(width*width - bombAmount-1).fill('valid')
//array with all the empty and bombs
const gameArray = emptyArray.concat(bombsArray);
//array with empty and bombs suffled
let suffledArray
//button with the face used to restart
var face = document.getElementById("face")
//number of bombs missing
var numBombs = document.getElementById('numBombs')
//control if its the first click
let first = true;

//create the board from the width number
function createBoard(){
    for(let i=0; i<width*width; i++){
        const square = document.createElement('div');
        square.setAttribute('id', i);
        grid.appendChild(square);
        squares.push(square);
    }
}

//add the hidden class to all the squares and make the array with the position of all the bombs
function addBombs(){
    numBombs.innerHTML = bombAmount
    suffledArray = gameArray.sort(()=>Math.random()-0.5);
    //you can see where are the bombs in the console
    console.log(suffledArray)
    squares.forEach(square =>{
        square.classList.add('hidden');
    })
}

//check if there are bombs in the square clicked
function numberBombs(e){
    //once the person click for the first time in one square we put the bombs to make sure he doesn't die in the first turn
    if(first){
        suffledArray.splice(e.target.id, 0, "valid")
        squares.forEach((square, index )=>{
            square.classList.add(suffledArray[index]);
        })
        first = false
    }
    //start the timer
    if(!newTimer.running){
        newTimer.start();
    }
    //if he click a bomb
    if(e.target.classList.contains('bomb')){
        //mark the square clicked in red
        e.target.classList.add("red");
        //don't let him click any squares again
        grid.removeEventListener('click', numberBombs);
        e.target.classList.remove("hidden");
        //change the face to sad
        face.classList.remove("smiley-face")
        face.classList.add("sad-face")
        //stop time
        newTimer.stop();
        //show all the bombs
        squares.forEach(x => {if(x.classList.contains("bomb")){
            x.classList.add("showBombs")
            x.classList.remove("hidden");
            x.classList.remove("flag");
        }})
    } else {
        //if there are no bombs in the square clicked...
        noBomb(Number(e.target.id))
    }
}

//if there are no bombs in the square clicked...
function noBomb(x){
    squares[x].classList.remove("hidden")
    squares[x].classList.remove("flag")
    let newArround = arround
    //look at the squares arround taking into account if it's in a border
    if(x === 0){
        newArround = upLeftArround
    } else if ( x === 9){
        newArround = upRightArround
    } else if (x === 90){
        newArround = downLeftArround
    } else if (x === 99){
        newArround = downRightArround
    } else if (x<9){
        newArround = upArround
    } else if (x>90){
        newArround = downArround
    } else if (x%10 === 0){
        newArround = leftArround
    } else if ((x+1)%10 ===0){
        newArround = rightArround
    }

    //count the bombs arround the square
    let bombs = newArround.reduce(function(accum, square) {
        if(squares[x+square].classList.contains('bomb')){
        return accum + 1
        } else { return accum}
    }, 0)
    //if there are no bombs we repeat the accion with the squares arround it
    if(bombs===0){
        newArround.forEach(y => {if(squares[y+x].classList.contains("hidden")){noBomb(y+x)}})
    } else {
        //write in the square the number of bombs arround
        squares[x].innerHTML = bombs;
        switch(bombs){
            case 1: 
                squares[x].style.color = "blue";
                break;
            case 2:
                squares[x].style.color = "rgb(17, 82, 17)"
                break;
            case 3:
                squares[x].style.color = "rgb(161, 23, 23)";
                break;
            case 4:
                squares[x].style.color = "rgb(56, 22, 90)";
                break;  
            case 5:
                squares[x].style.color = "rgb(185, 125, 13)";
                break;  
            case 6:
                squares[x].style.color = "rgb(5, 96, 119)";
                break; 
            case 7:
                squares[x].style.color = "rgb(80, 35, 23)";
                break; 
        }
    }
}
// event listeners for the clicks
grid.addEventListener('click', numberBombs)
grid.oncontextmenu = function(e){
    e.preventDefault();
    e.target.classList.toggle("flag")
    win();
}
face.addEventListener("click", reset)

//reset the game
function reset(){
    squares.forEach(x => {
        x.className="";
        x.innerHTML=""});
    face.className="";
    face.classList.add("smiley-face")
    addBombs();
    grid.addEventListener('click', numberBombs)
    newTimer.reset();
    first = true;
}

//winning
function win(){
    let w=0;
    let f=0;
    squares.forEach(x =>{
        if(x.classList.contains("flag")){
            f++;
            if(x.classList.contains("bomb")){
            w++
            }
        }
    })
    //change the counter with the number of bombs missing
    numBombs.innerHTML = bombAmount - f;
    //if there is a flag in every square with a bombs and there is no flags in squares without bombs he wins
    if(w === bombAmount && f === w){
        //don't let him click any squares again
        grid.removeEventListener('click', numberBombs);
        //change face
        face.classList.remove("smiley-face") 
        face.classList.add("glasses-face")
        //stop time
       newTimer.stop();
    }
}

//create a newTimer obj from the timer class
let newTimer = new Timer(
    document.querySelector('.time'),
);

newTimer;
createBoard();
addBombs()