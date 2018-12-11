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
// var user1Wins = 0;
// var user1Losses = 0;
// var user2Wins = 0;
// var user2Losses = 0;
// var user1GetsTied = 0;
// var user2GetsTied = 0;
var user1Name = "";
var user2Name = "";
// var userName = "";
var turn = 1;

// Attach a listener to the database /players/ node to listen for any changes
database.ref("/players/").on("value", function(snapshot) {
	// Check for existence of player 1 in the database
	if (snapshot.child("player1").exists()) {
		console.log("Player 1 exists");

		// Record player1 data
		player1 = snapshot.val().player1;
		user1Name = player1.name;

		// // Update player1 display
		// $("#playerOneName").text(player1Name);
		$("#player1Stats").html("Win: " + player1.win + ", Loss: " + player1.lose + ", Tie: " + player1.tie);
	} else {
		console.log("Player 1 does NOT exist");

		player1 = null;
		user1Name = "";

		// // Update player1 display
		// $("#playerOneName").text("Waiting for Player 1...");
		// $("#playerPanel1").removeClass("playerPanelTurn");
		// $("#playerPanel2").removeClass("playerPanelTurn");
		// database.ref("/outcome/").remove();
		// $("#roundOutcome").html("Rock-Paper-Scissors");
		// $("#waitingNotice").html("");
		$("#player1Stats").html("Win: 0, Loss: 0, Tie: 0");
	}

	// Check for existence of player 2 in the database
	if (snapshot.child("player2").exists()) {
		console.log("Player 2 exists");

		// Record player2 data
		player2 = snapshot.val().player2;
		user2Name = player2.name;

		// // Update player2 display
		// $("#playerTwoName").text(player2Name);
		$("#player2Stats").html("Win: " + player2.win + ", Loss: " + player2.lose + ", Tie: " + player2.tie);
	} else {
		console.log("Player 2 does NOT exist");

		player2 = null;
		user2Name = "";

		// // Update player2 display
		// $("#playerTwoName").text("Waiting for Player 2...");
		// $("#playerPanel1").removeClass("playerPanelTurn");
		// $("#playerPanel2").removeClass("playerPanelTurn");
		// database.ref("/outcome/").remove();
		// $("#roundOutcome").html("Rock-Paper-Scissors");
		// $("#waitingNotice").html("");
		$("#player2Stats").html("Win: 0, Loss: 0, Tie: 0");
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
		database.ref("/turn/").remove();
		database.ref("/outcome/").remove();

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

// function runGuesses() {
// // Randomly chooses a choice from the options array. This is the Computer's guess.
// user2Guess = computerChoices[Math.floor(Math.random() * computerChoices.length)];

// // Alerts the Computer's guess.
// alert("Computer guess: " + user2Guess);

// }

$("#addplayer").on("click", function(event) {
    event.preventDefault();
    if (player1 === null) {
        console.log("Adding Player 1");

        user1Name = $("#player-input").val().trim();
        form.reset();
        player1 = {
            name: user1Name,
            win: 0,
            lose: 0,
            tie: 0,
            choice: "",
        };
        database.ref().child("/players/player1").set(player1);
        database.ref("/players/player1").onDisconnect().remove();
    }
    else if ( (player1 !== null) && (player2 === null) ) {
        console.log("Adding Player 2");

        user2Name = $("#player-input").val().trim();
        form.reset();
        player2 = {
            name: user2Name,
            win: 0,
            lose: 0,
            tie: 0,
            choice: "",
        };
        database.ref().child("/players/player2").set(player2);
        database.ref("/players/player2").onDisconnect().remove();
    }
});

$(".choice1").on("click", function(event) {
    event.preventDefault();
    if (player1 && player2 && (user1Name === player1.name) && (turn === 1)) {
        var choice = $(this).attr("data-name");
        user1Guess = choice;
        database.ref().child("/players/player1/choice").set(user1Guess);
        alert(user1Name + " guess: " + user1Guess);
        turn = 2;
        database.ref().child("/turn").set(2);
    }
});

$(".choice2").on("click", function(event) {
    event.preventDefault();
    if (player1 && player2 && (user2Name === player2.name) && (turn === 2)) {
        var choice = $(this).attr("data-name");
        user2Guess = choice;
        database.ref().child("/players/player2/choice").set(user2Guess);
        alert(user2Name + " guess: " + user2Guess);
        runGame();
    }
});

database.ref("/outcome/").on("value", function(snapshot) {
    $("#roundOutcome").html(snapshot.val());
});

database.ref("/turn/").on("value", function(snapshot) {
	// Check if it's player1's turn
	if (snapshot.val() === 1) {
		console.log("TURN 1");
		turn = 1;

		// Update the display if both players are in the game
		if (player1 && player2) {
			$("#playerPanel1").addClass("playerPanelTurn");
			$("#playerPanel2").removeClass("playerPanelTurn");
            $("#waitingNotice").html("Waiting on " + user1Name + " to choose...");
                // Start by emptying our button-view div
            $("#button-view").empty();

                // Iterate through our array, creat the buttons and append them to the button-view div
                for (var i = 0; i < computerChoices.length; i++) {
                    var a = $("<button>");
                    a.addClass("btn btn-primary m-1 choice1");
                    // a.attr("id", "choice1");
                    a.attr("data-name", computerChoices[i]);
                    a.text(computerChoices[i]);
                    $("#button-view").append(a);
                    // console.log(topics);
                }
		}
	} else if (snapshot.val() === 2) {
		console.log("TURN 2");
		turn = 2;

		// Update the display if both players are in the game
		if (player1 && player2) {
			$("#playerPanel1").removeClass("playerPanelTurn");
			$("#playerPanel2").addClass("playerPanelTurn");
            $("#waitingNotice").html("Waiting on " + user2Name + " to choose...");
            $("#button-view").empty();

            // Iterate through our array, creat the buttons and append them to the button-view div
            for (var i = 0; i < computerChoices.length; i++) {
                var a = $("<button>");
                a.addClass("btn btn-primary m-1 choice2");
                // a.attr("id", "choice2");
                a.attr("data-name", computerChoices[i]);
                a.text(computerChoices[i]);
                $("#button-view").append(a);
                // console.log(topics);
            }
		}
	}
});

function runGame() {
    user1Guess = player1.choice;
    user2Guess = player2.choice;
    // runGuesses();
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

        turn = 1;
        database.ref().child("/turn").set(1);

};

function user1Won() {
    database.ref().child("/outcome/").set(player1.choice + " beats " + player2.choice);
    database.ref().child("/players/player1/win").set(player1.win + 1);
    database.ref().child("/players/player2/lose").set(player2.lose + 1);
};

function user2Won() {
    database.ref().child("/outcome/").set(player2.choice + " beats " + player1.choice);
    database.ref().child("/players/player1/lose").set(player1.lose + 1);
    database.ref().child("/players/player2/win").set(player2.win + 1);
};

function userTied() {
    database.ref().child("/outcome/").set("Great minds think alike you copycat!");
    database.ref().child("/players/player1/tie").set(player1.tie + 1);
    database.ref().child("/players/player2/tie").set(player2.tie + 1);
};

});