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
var computerChoices = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];
var player1 = null;
var player2 = null;
var player1Guess = "";
var player2Guess = "";
var player1Name = "";
var player2Name = "";
var turn = 1;

// Attach a listener to the database /players/ node to listen for any changes
database.ref("/players/").on("value", function(snapshot) {
	// Check for existence of player 1 in the database
	if (snapshot.child("player1").exists()) {
		// console.log("Player 1 exists");

		// Record player1 data
		player1 = snapshot.val().player1;
		player1Name = player1.name;

		// // Update player1 display
		$("#playerOneName").text(player1Name);
		$("#player1Stats").html("Win: " + player1.win + ", Loss: " + player1.lose + ", Tie: " + player1.tie);
	} else {
		// console.log("Player 1 does NOT exist");

		player1 = null;
		player1Name = "";

		// // Update player1 display
		$("#playerOneName").text("Waiting for Player 1...");
		$("#playerPanel1").removeClass("border-success");
		$("#playerPanel2").removeClass("border-success");
		database.ref("/outcome/").remove();
		$("#roundOutcome").html("Rock-Paper-Scissors");
		$("#waitingNotice").html("Please add yourself to begin the game");
		$("#player1Stats").html("Win: 0, Loss: 0, Tie: 0");
	}

	// Check for existence of player 2 in the database
	if (snapshot.child("player2").exists()) {
		// console.log("Player 2 exists");

		// Record player2 data
		player2 = snapshot.val().player2;
		player2Name = player2.name;

		// // Update player2 display
		$("#playerTwoName").text(player2Name);
		$("#player2Stats").html("Win: " + player2.win + ", Loss: " + player2.lose + ", Tie: " + player2.tie);
	} else {
		// console.log("Player 2 does NOT exist");

		player2 = null;
		player2Name = "";

		// // Update player2 display
		$("#playerTwoName").text("Waiting for Player 2...");
		$("#playerPanel1").removeClass("border-success");
		$("#playerPanel2").removeClass("border-success");
		database.ref("/outcome/").remove();
		$("#roundOutcome").html("Rock-Paper-Scissors");
		$("#waitingNotice").html("Please add yourself to begin the game");
		$("#player2Stats").html("Win: 0, Loss: 0, Tie: 0");
	}

	// If both players are now present, it's player1's turn
	if (player1 && player2) {
		// Update the display with a green border around player 1
		$("#playerPanel1").addClass("border-success");

		// Update the center display
        $("#waitingNotice").html("Waiting on " + player1Name + " to choose...");
	}

	// If both players leave the game, empty the the database
	if (!player1 && !player2) {
		database.ref("/turn/").remove();
		database.ref("/outcome/").remove();

		$("#playerPanel1").removeClass("border-success");
		$("#playerPanel2").removeClass("border-success");
		$("#roundOutcome").html("Rock-Paper-Scissors");
		$("#waitingNotice").html("Please add yourself to begin the game");
	}
});

// Attach a listener that detects player disconnection events
database.ref("/players/").on("child_removed", function(snapshot) {
    console.log(snapshot.val().name + " has disconnected!");
});

// Click functiont to add a player
$("#addplayer").on("click", function(event) {
    event.preventDefault();
    // Does player1 exist
    if (player1 === null) {
        // console.log("Adding Player 1");
        // Render buttons for player1
        renderButtons();
        player1Name = $("#player-input").val().trim();
        form.reset();
        player1 = {
            name: player1Name,
            win: 0,
            lose: 0,
            tie: 0,
            choice: "",
        };
        database.ref().child("/players/player1").set(player1);
        database.ref("/players/player1").onDisconnect().remove();
    }
    // Does player2 exist if player1 exists
    else if ( (player1 !== null) && (player2 === null) ) {
        // console.log("Adding Player 2");
        // Render buttons for player2
        renderButtons();
        player2Name = $("#player-input").val().trim();
        form.reset();
        player2 = {
            name: player2Name,
            win: 0,
            lose: 0,
            tie: 0,
            choice: "",
        };
        database.ref().child("/players/player2").set(player2);
        database.ref("/players/player2").onDisconnect().remove();
    }
});

// Function for player1 choice selection
function player1Go() {
    if (player1 && player2 && (player1Name === player1.name) && (turn === 1)) {
        var choice = $(this).attr("data-name");
        player1Guess = choice;
        database.ref().child("/players/player1/choice").set(player1Guess);
        turn = 2;
        database.ref().child("/turn").set(2);
    }
};

// Function for player2 choice selection
function player2Go() {
    if (player1 && player2 && (player2Name === player2.name) && (turn === 2)) {
        var choice = $(this).attr("data-name");
        player2Guess = choice;
        database.ref().child("/players/player2/choice").set(player2Guess);
        runGame();
    }
};

// Render our buttons upon adding a player
function renderButtons() {
    // Determine if player1 exists and render player1 buttons if not
    if (player1 === null) {
        // console.log("Adding Player 1 buttons");

        $("#button-view").empty();

        // Iterate through our array, creat the buttons and append them to the button-view div
        for (var i = 0; i < computerChoices.length; i++) {
            var a = $("<button>");
            a.addClass("btn btn-default m-1 choice1");
            a.attr("data-name", computerChoices[i]);
            a.text(computerChoices[i]);
            $("#button-view").append(a);
        };
    }
    // Determine if player2 exists and render player2 buttons if not
    else if ( (player1 !== null) && (player2 === null) ) {
        // console.log("Adding Player 2 buttons");

        $("#button-view").empty();

        // Iterate through our array, creat the buttons and append them to the button-view div
        for (var i = 0; i < computerChoices.length; i++) {
            var a = $("<button>");
            a.addClass("btn btn-default m-1 choice2");
            a.attr("data-name", computerChoices[i]);
            a.text(computerChoices[i]);
            $("#button-view").append(a);
        };
    }
};

// Watch our database for game outcomes
database.ref("/outcome/").on("value", function(snapshot) {
    $("#roundOutcome").html(snapshot.val());
});

// Watch our database for changes in turns
database.ref("/turn/").on("value", function(snapshot) {
	// Check if it's player1's turn
	if (snapshot.val() === 1) {
        // console.log("TURN 1");
        $("#roundOutcome").empty();
		turn = 1;

		// Update the display if both players are in the game
		if (player1 && player2) {
			$("#playerPanel1").addClass("border-success");
			$("#playerPanel2").removeClass("border-success");
            $("#waitingNotice").html("Waiting on " + player1Name + " to choose...");
		}
    }
    // Check if it's player2's turn
    else if (snapshot.val() === 2) {
		// console.log("TURN 2");
		turn = 2;

		// Update the display if both players are in the game
		if (player1 && player2) {
			$("#playerPanel1").removeClass("border-success");
			$("#playerPanel2").addClass("border-success");
            $("#waitingNotice").html("Waiting on " + player2Name + " to choose...");
		}
    }
    // Check if it's the outcome turn
    else if (snapshot.val() === 3) {
        console.log("TURN 3 means Outcome Round");
        turn = 3;
        setTimeout(endGame, 5000);
    }
});

// Game win/lose logic
function runGame() {
    player1Guess = player1.choice;
    player2Guess = player2.choice;
    // Scenario one
    if (player1Guess == player2Guess)
        playerTied();
        // Scenario two
        else if (player1Guess == "Rock")
            if (player2Guess == "Scissors") 
                player1Won();
            else if (player2Guess == "Lizard")
                player1Won();
            else 
                player2Won();
    
        // Scenario three
        else if (player1Guess == "Paper")
            if (player2Guess == "Rock") 
                player1Won();
            else if (player2Guess == "Spock")
                player1Won();
            else 
                player2Won();
    
        // Scenario four
        else if (player1Guess == "Scissors")
            if (player2Guess == "Paper")
                player1Won();
            else if (player2Guess == "Lizard")
                player1Won();
            else 
                player2Won();

        // Scenario five
        else if (player1Guess == "Lizard")
            if (player2Guess == "Paper")
                player1Won();
            else if (player2Guess == "Spock")
                player1Won();
            else
                player2Won();

        // Scenario six
        else if (player1Guess == "Spock")
            if (player2Guess == "Rock")
                player1Won();
            else if (player2Guess == "Scissors")
                player1Won();
            else
                player2Won();

        // Change turn to 3 for the outcome round
        turn = 3;
        database.ref().child("/turn").set(3);
};

// Reset game back to turn 1
function endGame() {
    turn = 1;
    database.ref().child("/turn").set(1);
}

// Player1 wins scenario
function player1Won() {
    database.ref().child("/outcome/").set(player1.name + " beats " + player2.name + " with " + player1.choice + " over " + player2.choice);
    database.ref().child("/players/player1/win").set(player1.win + 1);
    database.ref().child("/players/player2/lose").set(player2.lose + 1);
};

// Player2 wins scenario
function player2Won() {
    database.ref().child("/outcome/").set(player2.name + " beats " + player1.name + " with " + player2.choice + " over " + player1.choice);
    database.ref().child("/players/player1/lose").set(player1.lose + 1);
    database.ref().child("/players/player2/win").set(player2.win + 1);
};

// Players tie and pick the same item
function playerTied() {
    database.ref().child("/outcome/").set("Great minds think alike you copycat!");
    database.ref().child("/players/player1/tie").set(player1.tie + 1);
    database.ref().child("/players/player2/tie").set(player2.tie + 1);
};

// .on("click") for player1
$(document).on("click", ".choice1", player1Go);

// .on("click") for player2
$(document).on("click", ".choice2", player2Go);

});