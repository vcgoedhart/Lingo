var footer = document.getElementById("footer");
var audio = document.getElementById("audio");
var startButton = document.getElementById("startButton");
var title = document.getElementById("title");
var gameboard;
var timeInterval;
var interval;

var buttonSound = new Audio("audio/button/default.mp3");
var bgMusic = new Audio("audio/music/intense.mp3");
var runescape = new Audio("audio/music/runescape.mp3");
var clock = new Audio("audio/music/clock.mp3");

var game = {
	cheat: true, // cheat modus aan / uit

	rows: 5, // De rijen het lingo bord. Deze is niet aan te passen.
	columns: 5, // De columns van het lingo bord. Deze is wel aan te passen.
	currentRow: 1, // De rij waar de speler op typt
	currentColumn: 1, // De column waar de speler op typt

	isStarted: false, // Een variabele om te checken of de game is gestart.
	isTyping: false, // check of de gebruiker mag typen
	
	hasTimer: true, // set de timer modus aan / uit
	timeWord: 30, // seconde om 1 woord te raden.
	word: null, // Hier zit het random word in.

	correctLetters: ["", "", "", "", ""], // Dit slaat de correcte letters op.
	voice: "rogier",

	init: function(parentElement){ // dit is een functie om het lingo bord in te laden.
		for (var i = 0; i < this.rows; i++){
			var divRow = document.createElement("div");
			divRow.id = "r" + (i+1);
			gameboard.appendChild(divRow);
			for (var j = 0; j < this.columns; j++){
				var divColumn = document.createElement("div");
				divColumn.id = "c" + (i+1) + "." + (j+1);
				divRow.appendChild(divColumn);
			}
		}
		gameboard.style.width = ((90*this.columns) + (4*this.columns)) + "px"; // Dit past de width van het lingo bord aan voor als er meer colums komen.
	}
};

function init(){
	gameboard = document.createElement("div");
	gameboard.id = "gameboard";
	footer.appendChild(gameboard);

	game.init(gameboard);
	keyListener();
}
init();

function startGame(){
	if (game.isStarted == false){
		if (game.hasTimer == true){
			startTimer();
		}
		game.isTyping = true;
		game.isStarted = true;
		bgMusic.loop = true;
		bgMusic.volume = 0.08;
		bgMusic.play();

		runescape.loop = true;
		runescape.volume = 0.3;

		buttonSound.currentTime = 0;
		buttonSound.play();
		startButton.style.display = "none";
		title.style.fontSize = "95px";
		title.style.paddingTop = "32px";
		title.style.animation = "titleAnim ease 3s";
		setTimeout(function(){
			title.style.animation = "hoverAnim ease-in-out 6s infinite";	
		}, 3000);
		randomiseWord();
		addCorrectLetters();
		if (game.cheat == true){
			console.log("CHEAT ON");
			console.log("Word: " + game.word);
		} else {
			console.log("CHEAT OFF");
		}
	}
}

function keyListener(){
	document.addEventListener("keydown", function(e){
		var x = String.fromCharCode(e.keyCode).toUpperCase();
		if (game.isStarted == true){
			addLetter(x, e.keyCode);
		}
	});
}

function addLetter(letter, letterCode){
	if (game.currentColumn <= 5 && letter.match(/[a-z]/i) && game.currentRow <= 5 && game.isTyping == true){
		var columnLetter = document.getElementById("c" + game.currentRow + "." + game.currentColumn).firstChild;
		columnLetter.style.opacity = "1.0";
		columnLetter.innerHTML = letter;
		playLetterSound(letter);
		game.currentColumn++;
		if (game.currentColumn == 6){
			if (game.currentRow <= 5){
				var word = "";
				for (var i = 0; i < game.columns; i++){
					var wordChar = document.getElementById("c" + game.currentRow + "." + (i+1)).firstChild.innerHTML;
					word += wordChar;
				}
				checkWord(word);
				setTimeout(function(){
					game.currentRow++;
					game.currentColumn = 1;
					addCorrectLetters();
				}, 750);
				if (game.currentRow >= game.rows){
					bgMusic.pause();
					clock.pause();
					setTimeout(function(){
						alert("Wat jammer! Je hebt verloren. Het woord was: " + game.word);
						location.reload();
					}, 500);
				}
			}
		}
	}
}

function addCorrectLetters(){
	if (game.currentRow <= 5){
		for (var i = 0; i < game.correctLetters.length; i++){
			var divColumn = document.getElementById("c" + game.currentRow + "." + (i+1));
			var columnLetter = document.createElement("p");
			columnLetter.innerHTML = game.correctLetters[i];
			divColumn.appendChild(columnLetter);
			columnLetter.style.opacity = "0.4";
		}
		var columnLetter = document.getElementById("c" + game.currentRow + ".1").firstChild;
		columnLetter.innerHTML = game.word.charAt(0).toUpperCase();
	}
}

function checkWord(myWord){	
	var guess = myWord.split("");
	var answer = game.word.toUpperCase().split("");

	for (var i = 0; i < myWord.length; i++){
		if (guess[i] == answer[i]){
			var correctDiv = document.getElementById("c" + game.currentRow + "." + (i+1)).firstChild;
			correctDiv.style.backgroundColor = "#61ce35";
			correctDiv.style.borderRadius = "10px";
			game.correctLetters[i] = answer[i];
			answer[i] = "*";
			guess[i] = "";
		}
	}
	if (checkAllValues(answer, '*') == true){
		bgMusic.pause();
		clock.pause();
		game.currentRow = 1;
		setTimeout(function(){
			runescape.play();
			alert("Goed gedaan! Je hebt het woord geraden!!");
			location.reload();
		}, 500);
	} else {
		for (var i = 0; i < myWord.length; i++){
			for (var j = 0; j < myWord.length; j++){
				if (guess[i] == answer[j]){
					var correctDiv = document.getElementById("c" + game.currentRow + "." + (i+1)).firstChild;
					correctDiv.style.backgroundColor = "#fffb21";
					correctDiv.style.borderRadius = "100px";
					answer[j] = "*";
					guess[i] = "";
				}
			}
		}
	}
}

function randomiseWord(){
	var randomWord = words[Math.floor(Math.random() * words.length)];
	game.word = randomWord;
}

function checkAllValues(myArray, symbol){
	for (var i = 0; i < myArray.length; i++){
		if (myArray[i] != symbol){
			return false;
		}
	}
	return true;
}

function playLetterSound(letter){
	audio.src = "audio/letter/" + game.voice + "/" + letter + ".mp3";
	audio.currentTime = 0.57;
	var audioPlay = audio.play();
	audio.ontimeupdate = function(){
		if (audio.currentTime >= 1.2){
			audio.pause();
		}
	};
	if (audioPlay !== undefined) {
	    audioPlay.then(_=> {}).catch(error => {});
	}
}

function changeVoice(gender) {
	var buttonMan = document.getElementById("buttonMan");
	var buttonVrouw = document.getElementById("buttonVrouw");

	buttonSound.currentTime = 0;
	buttonSound.play();

	if (gender == "man"){
		if (buttonMan.className != "active"){
			game.voice = "rogier";
			buttonMan.classList.add("active");
			buttonVrouw.classList.remove("active");
		}
	} else if (gender == "vrouw") {
		if (buttonVrouw.className != "active"){
			game.voice = "zoe";
			buttonVrouw.classList.add("active");
			buttonMan.classList.remove("active");
		}
	}
}

function startTimer(){
	var timerText = document.getElementById("timerText");
	timeInterval = game.timeWord * 100;
	clock.loop = true;
	clock.volume = 0.2;

	interval = setInterval(function(){
		if (timeInterval/100 > 10){
			timerText.innerHTML = "TIJD: " + Math.round(timeInterval/100);
			clock.pause();
		} else {
			clock.play();
			var x = timeInterval / 100;
			if (x <= 0){
				clock.pause();
				bgMusic.pause();
				clearInterval(interval);
				x = 0;
				setTimeout(function(){
					alert("Je was niet binnen de tijd");
					location.reload();	
				}, 100);
			}
			timerText.innerHTML = "TIJD: " + x.toFixed(2);
		}
		timeInterval--;
	}, 10);
}