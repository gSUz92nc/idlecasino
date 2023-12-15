class Player {
    constructor(name, score, slotMachines, money) {
        this.name = name;
        this.score = score;
        this.slotMachines = slotMachines || 1;
        this.money = money || 1000;
    }
}


class GameState {
    constructor() {
        this.state = "menu";
        this.startButton = null;
        this.leaderboardButton = null;
    }

    setup() {
        createCanvas(windowWidth, windowHeight);

        // Set the background color
        background(220);

        // Create the start button
        this.startButton = createButton('Play');
        this.startButton.position(width / 2 - 50, height / 2);
        this.startButton.size(100, 50);
        this.startButton.mousePressed(this.startGame.bind(this));

        // Create the leaderboard button
        this.leaderboardButton = createButton('Leaderboard');
        this.leaderboardButton.position(width / 2 - 50, height / 2 + 70);
        this.leaderboardButton.size(100, 50);
        this.leaderboardButton.mousePressed(this.showLeaderboard.bind(this));
    }

    draw() {
        if (this.state === "menu") {
            // Draw the menu
            this.drawMenu();
        } else if (this.state === "entered_game") {
            // Add code to draw the game
            this.drawGame();
        } else if (this.state === "showing_leaderboard") {
            // Add code to show the leaderboard
            this.showLeaderboard();
        }
    }

    drawMenu() {
        // Set the background color
        background(220);

        // Draw the start button
        this.startButton.position(width / 2 - 50, height / 2);
        this.startButton.size(100, 50);

        // Draw the leaderboard button
        this.leaderboardButton.position(width / 2 - 50, height / 2 + 70);
        this.leaderboardButton.size(100, 50);
    }

    drawGame() {
        // Draw the casino
        this.drawCasino();

        // Add code to draw the game
    }

    drawCasino() {
        // Set the background color
        background(220);

        // Draw the red carpet down the middle
        fill(255, 0, 0); // Red color
        const carpetWidth = 0.9 * 160; // 90% of the door width
        rect(width / 2 - carpetWidth / 2, 0, carpetWidth, height);

        // Draw the casino entrance door
        fill(0); // Black color
        rect(width / 2 - 80, height - 20, 160, 20);

        // Calculate how many slot machines can fit on the left and right side of the carpet
        const slotMachineWidth = 150;
        const slotMachineHeight = 300;

        const leftSlotMachineCountPlaceholder = Math.floor((width / 2 - carpetWidth / 2) / slotMachineWidth);
        const rightSlotMachineCountPlaceholder = Math.floor((width / 2 - carpetWidth / 2) / slotMachineWidth);
        const topSlotMachineCount = Math.floor(height / slotMachineHeight);

        // Draw the slot machines on the left side accounting for the carpet and the height of the window
        for (let i = 0; i < leftSlotMachineCountPlaceholder; i++) {
            for (let j = 0; j < topSlotMachineCount; j++) {
                this.drawSlotMachinePlaceholder(i * slotMachineWidth, j * slotMachineHeight);
            }
        }

        // Draw the slot machines on the right side accounting for the carpet and the height of the window
        for (let i = 0; i < rightSlotMachineCountPlaceholder; i++) {
            for (let j = 0; j < topSlotMachineCount; j++) {
                this.drawSlotMachinePlaceholder(width - (i + 1) * slotMachineWidth, j * slotMachineHeight);
            }
        }

        // Draw the as many slot machines as the player owns ontop of the placeholders accounting for the carpet and the height of the window
        const player = new Player("Player 1", 1000, 4);

        // Calculate how many slot machines can fit on the left and right side of the carpet by checking how many the player owns
        const leftSlotMachineCount = Math.min(Math.floor((width / 2 - carpetWidth / 2) / slotMachineWidth), player.slotMachines);
        const rightSlotMachineCount = Math.min(Math.floor((width / 2 - carpetWidth / 2) / slotMachineWidth), player.slotMachines);


        // Get the number of slot machines that the user owns
        const slotMachineCount = player.slotMachines;

        // Draw the slot machines on the left side accounting for the carpet and the height of the window aswell as the number of slot machines the player owns
        let totalSlotMachinesDrawn = 0;

        for (let i = 0; i < leftSlotMachineCount; i++) {
            for (let j = 0; j < topSlotMachineCount; j++) {
                if (totalSlotMachinesDrawn >= slotMachineCount) {
                    break;
                }
                this.drawSlotMachine(i * slotMachineWidth, j * slotMachineHeight);
                totalSlotMachinesDrawn++;
            }
            if (totalSlotMachinesDrawn >= slotMachineCount) {
                break;
            }
        }

        // Check if there are enough spaces for the player's slot machines to be drawn
        if (totalSlotMachinesDrawn < slotMachineCount) {
            console.log("Error: Not enough spaces to draw all the player's slot machines");

            // Draw a big red X on the screen
            fill(255, 255, 0); // Red color
            textSize(100);
            textAlign(CENTER);
            text("X", width / 2, height / 2);


        }

    }

    // Function to draw a slot machine
    drawSlotMachine(x, y) {
        // Draw the slot machine body
        fill(200); // Gray color
        rect(x, y, 100, 150);

        // Draw the screen
        fill(0); // Black color
        rect(x + 10, y + 10, 80, 70); 
    }

    // This is used for indicating where a slot machine can be placed, it's not a real slot machine and has a cost that is shown on the body, make it a rectangle with a text inside
    drawSlotMachinePlaceholder(x, y, cost = 100) {
        // Draw the slot machine body
        fill(200); // Gray color
        rect(x, y, 100, 150);
    }
    
    windowResized() {
        resizeCanvas(windowWidth, windowHeight);

        // Recenter the menu
        this.startButton.position(width / 2 - 50, height / 2);
        this.leaderboardButton.position(width / 2 - 50, height / 2 + 70);
    }

    startGame() {
        // Add code to start the game
        console.log('Starting the game...');
        this.state = "entered_game";

        // Hide the buttons
        this.startButton.hide();
        this.leaderboardButton.hide();
    }

    showLeaderboard() {
        // Add code to show the leaderboard
        console.log('Showing the leaderboard...');
        this.state = "showing_leaderboard";

        // Hide the buttons
        this.startButton.hide();
        this.leaderboardButton.hide();

        // Mock leaderboard data
        const leaderboardData = [
            { name: "Player 1", score: 100 },
            { name: "Player 2", score: 90 },
            { name: "Player 3", score: 80 },
            { name: "Player 4", score: 70 },
            { name: "Player 5", score: 60 }
        ];

        // Set the background color
        background(220);

        // Draw the leaderboard title
        textSize(24);
        textAlign(CENTER);
        text("Leaderboard", width / 2, height / 2 - 100);

        function drawLeaderboard() {
            textSize(18);
            const leaderboardWidth = width * 0.9; // Stretch to 90% of the window width
            const leaderboardX = (width - leaderboardWidth) / 2;
            const leaderboardY = height / 2 - 50;
            const lineHeight = 50;
            const buttonMargin = 10; // Margin between buttons

            for (let i = 0; i < leaderboardData.length; i++) {
                const player = leaderboardData[i];
                const rank = i + 1;
                const playerText = `Rank ${rank}: ${player.name} - Score: ${player.score}`;
                fill(0); // Black color

                // Create a button for each player
                const button = createButton(playerText);
                button.position(leaderboardX, leaderboardY + i * (lineHeight + buttonMargin));
                button.size(leaderboardWidth, lineHeight);
                button.style("background-color", "white");
                button.style("border", "1px solid black"); // Add border
                button.style("text-align", "left");
                button.style("padding", "10px");
                button.style("font-size", "18px");
                button.style("cursor", "pointer");

                // Add click event listener to each button
                button.mousePressed(() => {
                    console.log(`Clicked on ${player.name}`);
                    // Add logic here when a button is clicked
                });
            }
        }

        // Add a back button that is 50px below the last button, calculate the position based on the last button
        const backButton = createButton("Back");
        backButton.position(width / 2 - 50, height / 2 + leaderboardData.length * 60);
        backButton.size(100, 50);
        backButton.mousePressed(() => {
            console.log("Clicked on the back button");
            this.state = "menu";
        });
        

        drawLeaderboard();
    }
}

let gameState = new GameState();

function setup() {
    gameState.setup();
}

function draw() {
    gameState.draw();
}

function windowResized() {
    gameState.windowResized();
}

function startGame() {
    gameState.startGame();
}

function showLeaderboard() {
    gameState.showLeaderboard();
}
