let blackjackGame = {
  'you': { 'scoreSpan' : '.result', 'div' : '.myscore', 'score':0},
  'dealer': { 'scoreSpan':'.result2', 'div' : '.dealerscore', 'score' :0},
  'cards': ['2','3','4','5','6','7',
     '8','9','10','K','J','Q','A'],
  'cardsmap': {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':13,'J':11,'Q':12,'A':1},
  'wins' : 0,
  'losses' : 0,
  'draws' : 0,
  'hitOver' : false,
  'standOver' : false,
  'dealOver' : false,
}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];


const hitSound = new Audio('swish.m4a');
const bustSound = new Audio('aww.mp3');
const cashSound = new Audio('cash.mp3');
const drawSound = new Audio('draw.mp3');



document.querySelector('.hit').addEventListener('click',Hit);
document.querySelector('.stand').addEventListener('click',dealerlogic);
document.querySelector('.deal').addEventListener('click',Deal);


function randomcard() {
 let randomIndex =  Math.floor(Math.random() * 13);
 return blackjackGame['cards'][randomIndex];
 //console.log(randomIndex);
}


async function Hit() {
 if (blackjackGame['hitOver'] === false) {
  let card = randomcard();
  showcard(card, YOU);
  updateScore(card, YOU);
  showScore(YOU);
  if (YOU['score'] > 25) {
    await sleep(1000);
    blackjackGame['dealOver'] = false;
    blackjackGame['hitOver'] = true;
    dealerlogic();
  }
 }
 //console.log(card)
}

function showcard(card, activePlayer) {
  if (activePlayer['score'] + blackjackGame['cardsmap'][card] <= 25) {
      let cardImage = document.createElement('img');
      cardImage.src = `./${card}.png`;
      document.querySelector(activePlayer['div']).appendChild(cardImage);
      hitSound.play();
}
}



function updateScore(card, activePlayer) {
  activePlayer['score'] += blackjackGame['cardsmap'][card];
}


function showScore(activePlayer) {
  if (activePlayer['score'] > 25) {
    document.querySelector(activePlayer['scoreSpan']).innerText = 'BUST!';
    bustSound.play();
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
  }else {
  document.querySelector(activePlayer['scoreSpan']).innerText = activePlayer['score'];
  }
  //bustSound.play()
}


function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Deal() {

 if (blackjackGame['standOver'] === true) {
  blackjackGame['hitOver'] = false;
  dealCard (YOU);
  dealCard (DEALER);
  let resultDiv = document.getElementById('heading');
  resultDiv.innerText = "Let's Play";
  resultDiv.style.color = '#FAAFBA';
  blackjackGame['standOver'] = false;
  blackjackGame['dealOver'] = false;
 }
}


function dealCard(activePlayer) {
 let Images = document.querySelector(activePlayer['div']).querySelectorAll('img');

 for (i=0; i < Images.length; i++) {
   Images[i].remove();
 }
 hitSound.play();
 activePlayer['score'] = 0;
 document.querySelector(activePlayer['scoreSpan']).innerText = activePlayer['score'];
 document.querySelector(activePlayer['scoreSpan']).style.color = 'white';
}


async function dealerlogic() {
  if (blackjackGame['dealOver'] === false){
    blackjackGame['hitOver'] = true;
    while (DEALER['score'] < 20) {
      let card = randomcard();
      showcard(card, DEALER);
      updateScore(card, DEALER);
      showScore(DEALER);
      await sleep(2000);
    } 
    blackjackGame['standOver'] = true;
    let winner = computeWinner();
    showResult(winner);
    blackjackGame['dealOver'] = true;
  }
}

function computeWinner() {
  let winner;

  if (YOU['score'] <=25) {
    if (YOU['score'] > DEALER['score'] || (DEALER['score'] > 25)) {
      winner = YOU;
    }else if (YOU['score'] < DEALER['score']) {
      console.log('You lost');
      winner = DEALER;
    }else if (YOU['score'] === DEALER['score']) {
      console.log('You draw');
    }
  }else if (YOU['score'] > 25 && DEALER['score'] <= 25) {
    winner = DEALER;
  } else if (YOU['score'] > 25 && DEALER['score'] > 25) {
    console.log('You draw');
  }
  return winner;
}


function showResult(winner) {
  let message, messageColor;

  if (winner === YOU) {
    message = "YOU WON!🏅";
    messageColor =  "green";
    cashSound.play();
    blackjackGame['wins']++;
    document.getElementById('wins').innerText = blackjackGame['wins'];
  } else if (winner === DEALER) {
    message = "YOU LOST!";
    messageColor = "red";
    bustSound.play();
    blackjackGame['losses']++;
    document.getElementById('losses').innerText = blackjackGame['losses'];
  } else {
    message = "YOU DRAW!";
    messageColor = "yellow";
    drawSound.play();
    blackjackGame['draws']++;
    document.getElementById('draws').innerText = blackjackGame['draws'];
  }
  resultDiv = document.getElementById("heading");
  resultDiv.innerText = message;
  resultDiv.style.color =  messageColor;
}


const triggerControl = (event) => {
  let keyCode = event.keyCode;
  if (keyCode == "72") {
    blackjackHit();
  } else if (keyCode == "68") {
    blackjackDeal();
  } else if (keyCode == "74") {
    dealerlogic();
  }
}

addEventListener('keydown', triggerControl);