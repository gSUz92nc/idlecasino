class Player {

    saveToLocalStorage() {
        localStorage.setItem('player', JSON.stringify(this));
    }

    static loadFromLocalStorage() {
        const data = localStorage.getItem('player');
        if (data) {
            return Object.assign(new Player(), JSON.parse(data));
        }
        return null;
    }
    
    constructor(name, slotMachines, money) {
        this.name = name;
        this.slotMachines = slotMachines || 1;
        this.money = money || 1000;
    }
}

let textX = 0; // Start from the right edge of the window

let slotScroll;
let floor;
let marble;

function preload() {
    slotScroll = loadImage('./slot.gif'); // Load the GIF
    floor = loadImage('./floor.webp');
    marble = loadImage('./marble.jfif');
}

const loadedPlayer = Player.loadFromLocalStorage() || new Player("Player 1");
const player = loadedPlayer;

let slotMachines = [];

class GameState {
    constructor() {
        this.state = "menu";
        this.startButton = null;
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
    }

    draw() {
        if (this.state === "menu") {
            // Draw the menu
            this.drawMenu();
        } else if (this.state === "entered_game") {
            // Add code to draw the game
            this.drawGame();
        }
        
        player.saveToLocalStorage();
    }

    drawMenu() {
        // Set the background color
        background(220);

        // Draw the start button
        this.startButton.position(width / 2 - 50, height / 2);
        this.startButton.size(100, 50);
    }

    drawGame() {
        // Draw the casino
        this.drawCasino();

        fill(0); // Set the text color
        textSize(40); // Set the text size
        text('"90% OF GAMBLERS QUIT BEFORE THEY MAKE IT BIG."                         "GAMBLING IS NOT ABOUT MONEY; IT IS ABOUT THE THRILL OF THE RISK."                          "YOU MISS 100% OF THE SHOTS YOU DON\'T TAKE." — WAYNE GRETZKY                                          “SUCCESS IS NOT FINAL, FAILURE IS NOT FATAL: IT IS THE COURAGE TO CONTINUE THAT COUNTS.” — WINSTON CHURCHILL                                               “THE ONLY REAL MISTAKE IS NOT GOING TO THE CASINO ATLEAST ONCE A WEEK.” — HENRY FORD                          Capital Casino features several gaming tables for casino players. Contact us at (916) 446-0700 or info@capitol-casino.com to learn more and try your luck!                                                      THE SAFEST WAY TO DOUBLE YOUR MONEY IS THROUGH THE CASINO. — Kin Hubbard', textX, 50); // Draw the text
    
        textX -= 4; // Move the text to the left


    }

    drawCasino() {

        // Set the background color
        background(220);

        frameRate(30);

        // Increase the player's money
        this.increaseMoney();

        // Draw the floor to cover the whole screen
        image(floor, 0, 0, width, height);

        // Draw the marble down the middle
        const carpetWidth = 0.9 * 160; // 90% of the door width
        image(marble, width / 2 - carpetWidth / 2, 0, carpetWidth, height);

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
                this.drawSlotMachinePlaceholder(width - (i + 1) * slotMachineWidth, j * slotMachineHeight, "right");
            }
        }

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

        // Draw the slot machines on the right side accounting for the carpet and the height of the window aswell as the number of slot machines the player owns
        for (let i = 0; i < rightSlotMachineCount; i++) {
            for (let j = 0; j < topSlotMachineCount; j++) {
                if (totalSlotMachinesDrawn >= slotMachineCount) {
                    break;
                }
                this.drawSlotMachine(width - (i + 1) * slotMachineWidth, j * slotMachineHeight, "right");
                totalSlotMachinesDrawn++;
            }
            if (totalSlotMachinesDrawn >= slotMachineCount) {
                break;
            }
        }

        // Check if there are enough spaces for the player's slot machines to be drawn
        if (totalSlotMachinesDrawn < slotMachineCount) {

            // Write a small message in the bottom right of the screen saying how many hidden slot machines there are
            fill(0); // Grey
            textSize(20);
            textAlign(RIGHT);
            text(`${slotMachineCount - totalSlotMachinesDrawn} hidden slot machines`, width - 10, height - 30);
        }

        // Draw the player's money
        fill(0);
        textSize(20);
        textAlign(LEFT);
        text(`Money: ${player.money}`, 10, height - 30);

        //Calculate the cost of the nest slot machine
        const nextSlotMachineCost = 500 * player.slotMachines;

        // Setup the buy slot machine button
        // Draw the rectangle
        fill(255); // White color
        rect(10, height - 100, 250, 50);
        // Draw the text
        fill(0); // Black color
        textSize(20);
        textAlign(LEFT);
        text(`Buy Slot Machine - $${nextSlotMachineCost}`, 15, height - 70);    

        // Check if the mouse is inside the rectangle and if it is pressed
        if (mouseIsPressed && mouseX > 10 && mouseX < 300 && mouseY > height - 100 && mouseY < height - 50) {
            this.buySlotMachine(nextSlotMachineCost);
        }
    }

    increaseMoney() {
        // Increase the player's money compared to the number of slot machines they own
        player.money += player.slotMachines * 2;
    }

    // Function to buy a slot machine
    buySlotMachine(price) {
        // Check if the player has enough money to buy a slot machine
        if (player.money < price) {
            return;
        }

        // Add a slot machine to the player's slot machines
        player.slotMachines++;

        // Subtract 100 from the player's money
        player.money -= price;
    }



    // Function to draw a slot machine
    drawSlotMachine(x, y, margin = "left", number) {
        // Draw the slot machine body

        fill(200); // Gray color
        if (margin === "left") {
            rect(x + 30, y, 100, 150);

            slotMachines.push({ x: x + 30, y: y, width: 100, height: 150, number: number })
            //console.log(slotMachines)


        } else {
            rect(x, y, 100, 150);
        }

        // Draw the screen
        if (margin === "left") {
            image(slotScroll, x-6, y+5, 180, 100);
        } else {
            image(slotScroll, x-36, y+5, 180, 100);
        }
    }

    // This is used for indicating where a slot machine can be placed
    drawSlotMachinePlaceholder(x, y, margin = "left") {
        // Draw the slot machine body
        fill(200); // Gray color
        if (margin === "left") {
            rect(x + 30, y, 100, 150);
        } else {
            rect(x, y, 100, 150);
        }
    }

    windowResized() {
        resizeCanvas(windowWidth, windowHeight);

        // Recenter the menu
        this.startButton.position(width / 2 - 50, height / 2);
    }

    startGame() {
        // Add code to start the game
        console.log('Starting the game...');
        this.state = "entered_game";

        // Hide the buttons
        this.startButton.hide();
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
