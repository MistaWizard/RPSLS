$(document).ready(function() {

 // Initialize Firebase
var config = {
    apiKey: "AIzaSyCEsrPwFSLur4Gnh0QKGxcZbrI1fwo3-5A",
    authDomain: "rpsls-6068f.firebaseapp.com",
    databaseURL: "https://rpsls-6068f.firebaseio.com",
    projectId: "rpsls-6068f",
    storageBucket: "rpsls-6068f.appspot.com",
    messagingSenderId: "207009670235"
};
firebase.initializeApp(config);

var database = firebase.database();

// Creates an array that lists out all of the options (Rock, Paper, or Scissors).
var computerChoices = ["r", "p", "s", "l", "k"];
var player1 = null;
var player2 = null;
var user1Guess = "";
var user2Guess = "";
var user1Wins = 0;
var user1Losses = 0;
var user2Wins = 0;
var user2Losses = 0;
var user1GetsTied = 0;
var user2GetsTied = 0;
var user1Name = "";
var user2Name = "";

// Attach a listener to the database /players/ node to listen for any changes
database.ref("/players/").on("value", function(snapshot) {
	// Check for existence of player 1 in the database
	if (snapshot.child("player1").exists()) {
		console.log("Player 1 exists");

		// Record player1 data
		player1 = snapshot.val().player1;
		// player1Name = player1.name;

		// // Update player1 display
		// $("#playerOneName").text(player1Name);
		// $("#player1Stats").html("Win: " + player1.win + ", Loss: " + player1.loss + ", Tie: " + player1.tie);
	} else {
		console.log("Player 1 does NOT exist");

		// player1 = null;
		// player1Name = "";

		// // Update player1 display
		// $("#playerOneName").text("Waiting for Player 1...");
		// $("#playerPanel1").removeClass("playerPanelTurn");
		// $("#playerPanel2").removeClass("playerPanelTurn");
		// database.ref("/outcome/").remove();
		// $("#roundOutcome").html("Rock-Paper-Scissors");
		// $("#waitingNotice").html("");
		// $("#player1Stats").html("Win: 0, Loss: 0, Tie: 0");
	}

	// Check for existence of player 2 in the database
	if (snapshot.child("player2").exists()) {
		console.log("Player 2 exists");

		// Record player2 data
		player2 = snapshot.val().player2;
		// player2Name = player2.name;

		// // Update player2 display
		// $("#playerTwoName").text(player2Name);
		// $("#player2Stats").html("Win: " + player2.win + ", Loss: " + player2.loss + ", Tie: " + player2.tie);
	} else {
		console.log("Player 2 does NOT exist");

		// player2 = null;
		// player2Name = "";

		// // Update player2 display
		// $("#playerTwoName").text("Waiting for Player 2...");
		// $("#playerPanel1").removeClass("playerPanelTurn");
		// $("#playerPanel2").removeClass("playerPanelTurn");
		// database.ref("/outcome/").remove();
		// $("#roundOutcome").html("Rock-Paper-Scissors");
		// $("#waitingNotice").html("");
		// $("#player2Stats").html("Win: 0, Loss: 0, Tie: 0");
	}

	// If both players are now present, it's player1's turn
	if (player1 && player2) {
		// Update the display with a green border around player 1
		$("#playerPanel1").addClass("playerPanelTurn");

		// Update the center display
		$("#waitingNotice").html("Waiting on " + user1Name + " to choose...");
	}

	// If both players leave the game, empty the chat session
	if (!player1 && !player2) {
		// database.ref("/chat/").remove();
		// database.ref("/turn/").remove();
		// database.ref("/outcome/").remove();

		// $("#chatDisplay").empty();
		// $("#playerPanel1").removeClass("playerPanelTurn");
		// $("#playerPanel2").removeClass("playerPanelTurn");
		// $("#roundOutcome").html("Rock-Paper-Scissors");
		// $("#waitingNotice").html("");
	}
});

// Attach a listener that detects user disconnection events
database.ref("/players/").on("child_removed", function(snapshot) {
	var msg = snapshot.val().name + " has disconnected!";

	// // Get a key for the disconnection chat entry
	// var chatKey = database.ref().child("/chat/").push().key;

	// // Save the disconnection chat entry
	// database.ref("/chat/" + chatKey).set(msg);
});

function runGuesses() {
// Randomly chooses a choice from the options array. This is the Computer's guess.
user2Guess = computerChoices[Math.floor(Math.random() * computerChoices.length)];

// Alerts the Computer's guess.
alert("Computer guess: " + user2Guess);

}

$(".choice").on("click", function(event) {
    event.preventDefault();
    user1Guess = $(this).attr("data-name");
    alert("User guess: " + user1Guess);
    runGame();
})

$("#addplayer").on("click", function(event) {
    event.preventDefault();
    if (player1 === null) {
        console.log("Adding Player 1");

        user1Name = $("#player-input").val().trim();
        // form.reset();
        player1 = {
            name: user1Name,
            win: 0,
            lose: 0,
            tie: 0,
            user1Guess: "",
        };
        database.ref().child("/players/player1").set(user1Name);
        database.ref("/players/player1").onDisconnect().remove();
    }
    else if ( (player1 !== null) && (player2 === null) ) {
        console.log("Adding Player 2");

        user2Name = $("#player-input").val().trim();
        // form.reset();
        player2 = {
            name: user2Name,
            win: 0,
            lose: 0,
            tie: 0,
            user2Guess: "",
        };
        database.ref().child("/players/player2").set(user2Name);
        database.ref("/players/player2").onDisconnect().remove();
    }
})

function runGame() {

    runGuesses();
    if (user1Guess == user2Guess)  //condition 1
        userTied();
        else if (user1Guess == "r") //condition 2
            if (user2Guess == "s") 
                // alert("User wins");
                user1Won();
            else if (user2Guess == "l")
                // alert("User wins");
                user1Won();
            else 
                // alert("User2 wins");
                user2Won();
    
        else if (user1Guess == "p") //condition 3
            if (user2Guess == "r") 
                // alert("User wins");
                user1Won();
            else if (user2Guess == "k")
                // alert("User wins");
                user1Won();
            else 
                // alert("User2 wins");
                user2Won();
    
        else if (user1Guess == "s")
            if (user2Guess == "p")
                // alert("User wins");
                user1Won();
            else if (user2Guess == "l")
                // alert("User wins");
                user1Won();
            else 
                // alert("User2 wins");
                user2Won();

        else if (user1Guess == "l")
            if (user2Guess == "p")
                // alert("User wins");
                user1Won();
            else if (user2Guess == "k")
                // alert("User wins");
                user1Won();
            else
                // alert("User2 wins");
                user2Won();

        else if (user1Guess == "k")
            if (user2Guess == "r")
                // alert("User wins");
                user1Won();
            else if (user2Guess == "s")
                // alert("User wins");
                user1Won();
            else
                // alert("User2 wins");
                user2Won();

}

function user1Won() {
    database.ref().child("/players/player1/win").set(user1Wins++);
    database.ref().child("/players/player2/lose").set(user2Losses++);
}

function user2Won() {
    database.ref().child("/players/player1/lose").set(user1Losses++);
    database.ref().child("/players/player2/win").set(user2Wins++);
}

function userTied() {
    database.ref().child("/players/player1/tie").set(user1GetsTied++);
    database.ref().child("/players/player2/tie").set(user2GetsTied++)
}

});