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
var user1 = null;
var user2 = null;
var user1Guess = "";
var user2Guess = "";
var user1Name = "";
var user2Name = "";
var turn = 1;

// Attach a listener to the database /players/ node to listen for any changes
database.ref("/players/").on("value", function(snapshot) {
	// Check for existence of player 1 in the database
	if (snapshot.child("user1").exists()) {
		console.log("Player 1 exists");

		// Record user1 data
		user1 = snapshot.val().user1;
		user1Name = user1.name;

		// // Update user1 display
		$("#playerOneName").text(user1Name);
		$("#user1Stats").html("Win: " + user1.win + ", Loss: " + user1.lose + ", Tie: " + user1.tie);
	} else {
		console.log("Player 1 does NOT exist");

		user1 = null;
		user1Name = "";

		// // Update user1 display
		$("#playerOneName").text("Waiting for Player 1...");
		// $("#userPanel1").removeClass("playerPanelTurn");
		// $("#userPanel2").removeClass("playerPanelTurn");
		// database.ref("/outcome/").remove();
		// $("#roundOutcome").html("Rock-Paper-Scissors");
		// $("#waitingNotice").html("");
		$("#user1Stats").html("Win: 0, Loss: 0, Tie: 0");
	}

	// Check for existence of player 2 in the database
	if (snapshot.child("user2").exists()) {
		console.log("Player 2 exists");

		// Record user2 data
		user2 = snapshot.val().user2;
		user2Name = user2.name;

		// // Update user2 display
		$("#playerTwoName").text(user2Name);
		$("#user2Stats").html("Win: " + user2.win + ", Loss: " + user2.lose + ", Tie: " + user2.tie);
	} else {
		console.log("Player 2 does NOT exist");

		user2 = null;
		user2Name = "";

		// // Update user2 display
		$("#playerTwoName").text("Waiting for Player 2...");
		// $("#userPanel1").removeClass("playerPanelTurn");
		// $("#userPanel2").removeClass("playerPanelTurn");
		// database.ref("/outcome/").remove();
		// $("#roundOutcome").html("Rock-Paper-Scissors");
		// $("#waitingNotice").html("");
		$("#user2Stats").html("Win: 0, Loss: 0, Tie: 0");
	}

	// If both players are now present, it's user1's turn
	if (user1 && user2) {
		// Update the display with a green border around player 1
		$("#userPanel1").addClass("playerPanelTurn");

		// Update the center display
		$("#waitingNotice").html("Waiting on " + user1Name + " to choose...");
	}

	// If both players leave the game, empty the chat session
	if (!user1 && !user2) {
		// database.ref("/chat/").remove();
		database.ref("/turn/").remove();
		database.ref("/outcome/").remove();

		$("#userPanel1").removeClass("playerPanelTurn");
		$("#userPanel2").removeClass("playerPanelTurn");
		$("#roundOutcome").html("Rock-Paper-Scissors");
		// $("#waitingNotice").html("");
	}
});

// Attach a listener that detects user disconnection events
database.ref("/players/").on("child_removed", function(snapshot) {
	// var msg = snapshot.val().name + " has disconnected!";
    console.log(snapshot.val().name + " has disconnected!");
});

$("#addplayer").on("click", function(event) {
    event.preventDefault();
    if (user1 === null) {
        console.log("Adding Player 1");
        renderButtons();
        user1Name = $("#player-input").val().trim();
        form.reset();
        user1 = {
            name: user1Name,
            win: 0,
            lose: 0,
            tie: 0,
            choice: "",
        };
        database.ref().child("/players/user1").set(user1);
        database.ref("/players/user1").onDisconnect().remove();
    }
    else if ( (user1 !== null) && (user2 === null) ) {
        console.log("Adding Player 2");
        renderButtons();
        user2Name = $("#player-input").val().trim();
        form.reset();
        user2 = {
            name: user2Name,
            win: 0,
            lose: 0,
            tie: 0,
            choice: "",
        };
        database.ref().child("/players/user2").set(user2);
        database.ref("/players/user2").onDisconnect().remove();
    }
});

function user1Go() {
    if (user1 && user2 && (user1Name === user1.name) && (turn === 1)) {
        var choice = $(this).attr("data-name");
        user1Guess = choice;
        database.ref().child("/players/user1/choice").set(user1Guess);
        turn = 2;
        database.ref().child("/turn").set(2);
    }
};

function user2Go() {
    if (user1 && user2 && (user2Name === user2.name) && (turn === 2)) {
        var choice = $(this).attr("data-name");
        user2Guess = choice;
        database.ref().child("/players/user2/choice").set(user2Guess);
        runGame();
    }
};

function renderButtons() {
    if (user1 === null) {
        console.log("Adding Player 1 buttons");

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
    else if ( (user1 !== null) && (user2 === null) ) {
        console.log("Adding Player 2 buttons");

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

database.ref("/outcome/").on("value", function(snapshot) {
    $("#roundOutcome").html(snapshot.val());
    setTimeout(endGame, 5000);
});

database.ref("/turn/").on("value", function(snapshot) {
	// Check if it's user1's turn
	if (snapshot.val() === 1) {
        console.log("TURN 1");
        $("#roundOutcome").empty();
		turn = 1;

		// Update the display if both players are in the game
		if (user1 && user2) {
			$("#userPanel1").addClass("playerPanelTurn");
			$("#userPanel2").removeClass("playerPanelTurn");
            $("#waitingNotice").html("Waiting on " + user1Name + " to choose...");
		}
	} else if (snapshot.val() === 2) {
		console.log("TURN 2");
		turn = 2;

		// Update the display if both players are in the game
		if (user1 && user2) {
			$("#userPanel1").removeClass("playerPanelTurn");
			$("#userPanel2").addClass("playerPanelTurn");
            $("#waitingNotice").html("Waiting on " + user2Name + " to choose...");
		}
	} else if (snapshot.val() === 3) {
        console.log("TURN 3 means Outcome Round");
        turn = 3;
    }
});

function runGame() {
    user1Guess = user1.choice;
    user2Guess = user2.choice;
    if (user1Guess == user2Guess)  //condition 1
        userTied();
        else if (user1Guess == "Rock") //condition 2
            if (user2Guess == "Scissors") 
                user1Won();
            else if (user2Guess == "Lizard")
                user1Won();
            else 
                user2Won();
    
        else if (user1Guess == "Paper") //condition 3
            if (user2Guess == "Rock") 
                user1Won();
            else if (user2Guess == "Spock")
                user1Won();
            else 
                user2Won();
    
        else if (user1Guess == "Scissors")
            if (user2Guess == "Paper")
                user1Won();
            else if (user2Guess == "Lizard")
                user1Won();
            else 
                user2Won();

        else if (user1Guess == "Lizard")
            if (user2Guess == "Paper")
                user1Won();
            else if (user2Guess == "Spock")
                user1Won();
            else
                user2Won();

        else if (user1Guess == "Spock")
            if (user2Guess == "Rock")
                user1Won();
            else if (user2Guess == "Scissors")
                user1Won();
            else
                user2Won();

        turn = 3;
        database.ref().child("/turn").set(3);

};

function endGame() {
    turn = 1;
    database.ref().child("/turn").set(1);
};

function user1Won() {
    database.ref().child("/outcome/").set(user1.name + " beats " + user2.name + " with " + user1.choice + " over " + user2.choice);
    database.ref().child("/players/user1/win").set(user1.win + 1);
    database.ref().child("/players/user2/lose").set(user2.lose + 1);
};

function user2Won() {
    database.ref().child("/outcome/").set(user2.name + " beats " + user1.name + " with " + user2.choice + " over " + user1.choice);
    database.ref().child("/players/user1/lose").set(user1.lose + 1);
    database.ref().child("/players/user2/win").set(user2.win + 1);
};

function userTied() {
    database.ref().child("/outcome/").set("Great minds think alike you copycat!");
    database.ref().child("/players/user1/tie").set(user1.tie + 1);
    database.ref().child("/players/user2/tie").set(user2.tie + 1);
};

$(document).on("click", ".choice1", user1Go);

$(document).on("click", ".choice2", user2Go);

});