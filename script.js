const board = [];

let boardSize = 9;

let nrMines = 10;
let minePositions = [];

let squaresClicked = 0;

let placedFlags = nrMines;

const r = document.querySelector(":root");

const difficultySave = JSON.parse(localStorage.getItem("difficulty"));
/* console.log(difficultySave); */

let timerOn = false;

let lost = false;

document.addEventListener('keyup', function (e) {
  if (e.key === 'r')
      window.location.reload();
});

window.onload = function() {
  loadContent();
}

let operator = () => {
  window.location.reload();
}

function loadContent() {

  if (difficultySave == "x1") {
    boardSize = 9;
    nrMines = 10;
    r.style.setProperty("--width", "360px");
    r.style.setProperty("--height", "360px");
    r.style.setProperty("--grid-template-rows", 'repeat(9, 40px');
    r.style.setProperty("--grid-template-columns", 'repeat(9, 40px');
  } else if (difficultySave == "x2") {
    boardSize = 16;
    nrMines = 40;
    r.style.setProperty("--width", "640px");
    r.style.setProperty("--height", "640px");
    r.style.setProperty("--grid-template-rows", 'repeat(16, 40px');
    r.style.setProperty("--grid-template-columns", 'repeat(16, 40px');
  } else if (difficultySave == "x3") {
    boardSize = 23;
    nrMines = 99;
    r.style.setProperty("--width", "920px");
    r.style.setProperty("--height", "920px");
    r.style.setProperty("--grid-template-rows", 'repeat(23, 40px');
    r.style.setProperty("--grid-template-columns", 'repeat(23, 40px');
  }

  placedFlags = nrMines;

  document.querySelector('#head').innerText = '🧐';
  document.querySelector('#flag-count').innerText = placedFlags;
  /* console.log(placedFlags); */
  drawBoard();

}

function startTimer() {
  let seconds = 1;
  let timerEl = document.getElementById('timer');
  timer = setInterval(() => {
    timerEl.innerHTML = seconds;
    seconds++;
    if (seconds == 999) {
      seconds = 1;
    }
  }, 1000)
}

let drawBoard = () => {

  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      let square = document.createElement('div');

      document.querySelector('#board').append(square);

      square.id = x.toString() + ':' + y.toString();

      square.addEventListener('click', squareClicked);

      square.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        if (lost || square.classList.contains('square-clicked')) {
          return;
        }

        if (square.innerText == '') {
          square.innerText = '🚩';
          placedFlags -= 1;
        } else if (square.innerText == '🚩') {
          square.innerText = '';
          placedFlags += 1;
        }
        document.querySelector('#flag-count').innerText = placedFlags;
      })
      row.push(square);
    }
    board.push(row);
  }
  /* console.log(board); */
  deployMines();
}

function squareClicked() {
  let square = this;

  if (timerOn == false) {
    startTimer();
    timerOn = true;
  }

  if (lost || this.classList.contains('square-clicked') || this.innerText == '🚩') {
    return;
  }

  document.querySelector('#head').innerText = '😬';

  if (minePositions.includes(square.id)) {
    displayMines();
    document.querySelector('#head').innerText = '😭';
    console.log('better luck next time 🤡')
    lost = true;
    return;
  }

  let coords = square.id.split(':');
  let x = Number(coords[0]);
  let y = Number(coords[1]);
  probeMine(x, y);
}

function probeMine(x, y) {
  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
    return;
  }

  //PREVENTS INFINITE RECURSION
  if (board[x][y].classList.contains('square-clicked')) {
    return;
  }
  board[x][y].classList.add('square-clicked');
  //END

  squaresClicked += 1;

  foundMines = 0;

  foundMines += checkSquare(x - 1, y - 1);
  foundMines += checkSquare(x - 1, y);
  foundMines += checkSquare(x - 1, y + 1);

  foundMines += checkSquare(x, y - 1);
  foundMines += checkSquare(x, y + 1);

  foundMines += checkSquare(x + 1, y - 1);
  foundMines += checkSquare(x + 1, y);
  foundMines += checkSquare(x + 1, y + 1);

  if (foundMines > 0) {
    board[x][y].innerText = foundMines;
    board[x][y].classList.add('x' + foundMines.toString());
  }
  else { //RECURSION - INFITITE RECURSION
    probeMine(x - 1, y - 1);
    probeMine(x - 1, y);
    probeMine(x - 1, y + 1);

    probeMine(x, y - 1);
    probeMine(x, y + 1);

    probeMine(x + 1, y - 1);
    probeMine(x + 1, y);
    probeMine(x + 1, y + 1);
  }

  /* console.log(squaresClicked); */

  if (squaresClicked == boardSize * boardSize - nrMines) {
    document.querySelector('#flag-count').innerText = 'VICTORY!';
    document.querySelector('#head').innerText = '🥳';
    /* console.log('VICTORY!'); */
    lost = true;
  }
}

function checkSquare(x, y) {
  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) {
    return 0;
  }
  if (minePositions.includes(x.toString() + ':' + y.toString())) {
    return 1;
  }
  return 0;
}

let displayMines = () => {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      let square = board[x][y];
      if (minePositions.includes(square.id)) {
        square.innerText = '💣';
        square.style.backgroundColor = 'red';
      }
    }
  }
}

function deployMines() {
  let minesToPlace = nrMines;

  while (minesToPlace > 0) {
    let x = parseInt(Math.random() * boardSize);
    let y = parseInt(Math.random() * boardSize);
    let id = x.toString() + ':' + y.toString();

    if (!minePositions.includes(id)) {
      minePositions.push(id);
      minesToPlace -= 1;
    }
  }
}

function diff(option) {
  switch (option) {
    case 'x1':
      localStorage.setItem('difficulty', JSON.stringify('x1'));
      break;
    case 'x2':
      localStorage.setItem('difficulty', JSON.stringify('x2'));
      break;
    case 'x3':
      localStorage.setItem('difficulty', JSON.stringify('x3'));
      break;
  }
  /* console.log(option); */
  window.location.reload();
}

let modal = document.getElementById('popup');
let modalBtn = document.getElementById('btn');

modalBtn.addEventListener("click", openModal);

function openModal() {
  modal.style.display = "block";
}