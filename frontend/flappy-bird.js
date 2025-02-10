/**
 * ? GAME
 * FLAPPY BIRD
 * 
 * 
 * ? AUTHOR
 * SHRUTI PANDEY
 * 
 * 
 * ? DESCRIPTION
 * Flappy Bird is a simple, yet challenging, endless scrolling game where players control a bird navigating through a series of pipes. 
 * The objective is to keep the bird flying by pressing the spacebar to make the bird ascend. 
 * Players must avoid hitting the pipes or the ground to stay alive.
 * 
 * The game tracks the player's score based on how many pipes the bird successfully passes through. 
 * The score increases by one point for each pipe successfully navigated. 
 * The game ends when the bird collides with a pipe or falls to the ground.
 * 
 * Players can restart the game after it ends and continue trying to beat their highest score.
 * 
 * 
 * ? GAMEPLAY
 * * Movement:
 *   The bird can be made to ascend by pressing the spacebar.
 *   The bird falls naturally due to gravity if no input is provided.
 * 
 * * Input:
 *   Player input is as simple as pressing the spacebar to control the bird's flight.
 *   There are no complex controls, making the game easy to learn but hard to master.
 * 
 * * Scoring:
 *   For every pipe the bird successfully flies through, the player earns one point.
 *   The goal is to pass as many pipes as possible without crashing.
 * 
 * * Win/End:
 *   There is no 'win' condition in this game. The game ends when the bird hits a pipe or falls to the ground.
 *   The player's score is recorded, and they can choose to replay and try to beat their previous score.
 * 
 * 
 * ? FEATURES
 * * Simple Controls:
 *   Press space to keep the bird in the air. The more times you tap, the higher the bird goes!
 * 
 * * Endless Gameplay:
 *   The pipes move at a constant speed, and new pipes are generated continuously, making it an endless challenge.
 * 
 * * Physics:
 *   Gravity affects the bird's movement, making it fall when the player stops tapping, creating a realistic flight mechanic.
 * 
 * * Collisions:
 *   If the bird hits a pipe or falls to the ground, the game ends and the player's score is displayed.
 * 
 * * High Score System:
 *   The highest score is saved and displayed on the screen. Players can try to beat their best score with every new game.
 * 
 */

// Configuration data
const config = {
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
    birdWidth: 40,
    birdHeight: 40,
    gravity: 0.9,
    birdLift: -11,
    pipeWidth: 50,
    pipeGap: 200,
    pipeSpeed: 2,
    pipeSpawnInterval: 0,
    gameSpeed: 1000 / 60,
};

// Global game data
const gameData = {
    bird: {
        x: 50,
        y: config.canvasHeight / 2,
        velocity: 0,
    },
    pipes: [],
    score: 0,
    isGameOver: false,
    lastPipeTime: 0,
};

// Access the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = config.canvasWidth;
canvas.height = config.canvasHeight;

// Functions to handle game logic

const birdImage = new Image();
birdImage.src = 'images/Flappy-Bird-PNG-Pic.png';

const pipeImageTop = new Image();
pipeImageTop.src = 'images/pipeTop.png'; 

const pipeImageBottom = new Image();
pipeImageBottom.src = 'images/flappy-bird-pipe-png-7.png';  

let playerName = 'Player';
let playerHighScore = 0;

let leaderboardData = []; // To store leaderboard data

// // Function to fetch and display the leaderboard
// async function displayLeaderboard() {
//     try {
//         const response = await fetch('http://localhost:5000/leaderboard');  // API to get leaderboard
//         if (!response.ok) {
//             throw new Error('Failed to fetch leaderboard');
//         }
//         leaderboardData = await response.json(); // Get leaderboard data

//         // Create a leaderboard display
//         const leaderboardContainer = document.createElement('div');
//         leaderboardContainer.id = 'leaderboardContainer';
//         leaderboardContainer.style.position = 'absolute';
//         leaderboardContainer.style.top = '10%';  // Reduced top margin
//         leaderboardContainer.style.left = '50%';
//         leaderboardContainer.style.transform = 'translateX(-50%)'; // Center horizontally
//         leaderboardContainer.style.backgroundColor = '#f5e155';  // Gentle yellow background
//         leaderboardContainer.style.color = 'black';  // Set font color to black
//         leaderboardContainer.style.padding = '30px';
//         leaderboardContainer.style.borderRadius = '30px';  // More rounded corners
//         leaderboardContainer.style.fontFamily = 'Arial, sans-serif';
//         leaderboardContainer.style.zIndex = '10';
//         leaderboardContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
//         leaderboardContainer.style.fontSize = '16px';  // Main font size for title and content
//         leaderboardContainer.style.width = '450px';  // Increased width for more space (rounded square)

//         // Create the leaderboard title
//         let leaderboardText = '<h3 style="font-size: 24px; margin-bottom: 15px; text-align: center;">Leaderboard:</h3>';

//         // Create a flex container for the leaderboard items (name & score in separate columns)
//         leaderboardText += `
//         <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: bold; padding-bottom: 10px; border-bottom: 2px solid black;">
//             <span>Player Name</span>
//             <span>High Score</span>
//         </div>`;

//         // Generate the leaderboard list items
//         leaderboardData.forEach((entry) => {
//             leaderboardText += `
//             <div style="display: flex; justify-content: space-between; padding: 5px 0;">
//                 <span>${entry.playerName}</span>
//                 <span>${entry.highScore}</span>
//             </div>`;
//         });

//         leaderboardContainer.innerHTML = leaderboardText;
//         document.body.appendChild(leaderboardContainer);

//         // Wait a bit to let the leaderboard be visible
//         setTimeout(() => {
//             leaderboardContainer.style.display = 'none';  // Hide the leaderboard after a few seconds
//             startGame(); // Now prompt for player name
//         }, 2000); // 5 seconds for leaderboard visibility
//     } catch (error) {
//         console.error('Error fetching leaderboard:', error);
//     }
// }

// Function to start the game after getting the name using prompt
// function startGame() {
//     // Get player name from prompt
//     playerName = prompt("Enter your name", "Player");

//     // If the user didn't enter a name, use the default 'Player'
//     if (!playerName) {
//         playerName = 'Player';
//     }

//     // Hide the prompt (no need to actually hide anything in HTML)
//     document.getElementById('gameCanvas').style.display = 'block';

//     registerPlayer(playerName)
//         .then(response => {
//             console.log(response,"here");
//             // Reset the game and start the game loop after player registration
//             if (response.highScore !== undefined) {
//                 playerHighScore = response.highScore;
//             }
//             resetGame();
//             gameLoop();
//         })
//         .catch(error => {
//             console.error('Error registering player:', error);
//             // Handle any error (e.g., player already exists)
//         });
// }

// Function to register the player on the backend
// async function registerPlayer(name) {
//     const response = await fetch('http://localhost:5000/players', {  // Change URL if necessary
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ PlayerName: name })
//     });

//     if (!response.ok) {
//         const message = await response.text();
//         throw new Error(message);  // If registration failed, throw an error
//     }

//     const data = await response.json();
//     return data;  // Return success message or any other data
// }

// Function to submit the score to the backend
// async function submitScore() {
//     const scoreData = {
//         PlayerName: playerName,  // The player's name
//         Score: gameData.score    // The current score
//     };

//     try {
//         // Send the score data to the backend API
//         const response = await fetch('http://localhost:5000/submit-score', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(scoreData)
//         });

//         if (!response.ok) {
//             const errorMessage = await response.text();
//             alert('Failed to submit score: ' + errorMessage);
//         } else {
//             const result = await response.json();
//         }
//     } catch (error) {
//         console.error('Error submitting score:', error);
//         // alert('Error submitting score. Please try again later.');
//     }
// }


function resetGame() {
    gameData.score = 0;
    gameData.isGameOver = false;
    gameData.pipes = [];
    gameData.bird.y = config.canvasHeight / 2;
    gameData.bird.velocity = 0;
}
// Function to draw the bird
function drawBird() {
    ctx.drawImage(birdImage, gameData.bird.x, gameData.bird.y, config.birdWidth, config.birdHeight);
}

// Function to draw the pipes
function drawPipes() {
    gameData.pipes.forEach(pipe => {
        ctx.drawImage(pipeImageTop, pipe.x, 0, config.pipeWidth, pipe.topHeight);
        ctx.drawImage(pipeImageBottom, pipe.x, pipe.bottomY, config.pipeWidth, config.canvasHeight - pipe.bottomY);
    });
}

// Function to check if the bird passes a pipe and update the score
function updateScore() {
    gameData.pipes.forEach(pipe => {
        if (!pipe.passed && gameData.bird.x > pipe.x + config.pipeWidth) {
            gameData.score += 1;  
            pipe.passed = true;
        }
    });
}

// Function to draw the score on the canvas
function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + gameData.score, 20, 30); 
}

// function drawPlayerName() {
//     ctx.fillStyle = '#000';
//     ctx.font = '20px Arial';
//     ctx.fillText('Player: ' + playerName, 20, 60);  // Position can be adjusted
//     ctx.fillText('High Score: ' + playerHighScore, 20, 90);
// }
// Modified game loop to call updateScore
function gameLoop() {
    updateGame();
    updateScore();  
    draw();  

    if (!gameData.isGameOver) {
        setTimeout(gameLoop, config.gameSpeed);
    } else {
        alert('Game Over! Final Score: ' + gameData.score);
        // submitScore();  // Submit score to the backend
    }
}

// Function to move the pipes and other game logic
function movePipes() {
    gameData.pipes.forEach(pipe => {
        pipe.x -= config.pipeSpeed;
    });

    gameData.pipes = gameData.pipes.filter(pipe => pipe.x + config.pipeWidth > 0);
}

function spawnPipes() {
    const currentTime = Date.now();

    if (gameData.pipes.length === 0) {
        const initialPipeCount = 3; 
        const spacing = config.pipeWidth + 200; 

        const startX = config.canvasWidth / 2 - spacing * Math.floor(initialPipeCount / 2); 

        for (let i = 0; i < initialPipeCount; i++) {
            const topHeight = Math.floor(Math.random() * (config.canvasHeight - config.pipeGap));
            const bottomY = topHeight + config.pipeGap;

            gameData.pipes.push({
                x: startX + i * spacing, 
                topHeight,
                bottomY,
            });
        }

        gameData.lastPipeTime = currentTime;
    }

    if (currentTime - gameData.lastPipeTime >= config.pipeSpawnInterval) {
        const topHeight = Math.floor(Math.random() * (config.canvasHeight - config.pipeGap));
        const bottomY = topHeight + config.pipeGap;

        const lastPipe = gameData.pipes[gameData.pipes.length - 1];
        gameData.pipes.push({
            x: lastPipe.x + config.pipeWidth + 200,  
            topHeight,
            bottomY,
        });

        gameData.lastPipeTime = currentTime;
    }
}

// Function to handle bird movement and gravity
function moveBird() {
    gameData.bird.velocity += config.gravity;
    gameData.bird.y += gameData.bird.velocity;

    if (gameData.bird.y > config.canvasHeight - config.birdHeight) {
        gameData.bird.y = config.canvasHeight - config.birdHeight;
        gameData.bird.velocity = 0;
    }
}

// Check for collisions with pipes and ground
function checkCollisions() {

    for (let i = 0; i < gameData.pipes.length; i++) {
        const pipe = gameData.pipes[i];
        if (gameData.bird.x + config.birdWidth > pipe.x &&
            gameData.bird.x < pipe.x + config.pipeWidth) {
            if (gameData.bird.y < pipe.topHeight || gameData.bird.y + config.birdHeight > pipe.bottomY) {
                gameData.isGameOver = true;
            }
        }
    }

    if (gameData.bird.y + config.birdHeight >= config.canvasHeight) {
        gameData.isGameOver = true;
    }
}

// Function to update the game (called every frame)
function updateGame() {
    if (gameData.isGameOver) {
        return;  
    }

    moveBird();  
    movePipes();  
    spawnPipes();  
    checkCollisions();  
}

// Main draw function
function draw() {
    ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);  

    drawBird();  
    drawPipes();  
    drawScore();
    // drawPlayerName();  
}

window.onload = function() {
    // Show the prompt to enter the name as soon as the page is loaded
    // startGame();  // Calling startGame when the page loads
    // displayLeaderboard();
    gameLoop();
};

// Bird jump action (when spacebar is pressed)
function birdJump() {
    if (!gameData.isGameOver) {
        gameData.bird.velocity = config.birdLift;
    }
}

// Event listener for bird jump (spacebar)
document.addEventListener('keydown', function (e) {
    if (e.key === ' ') {
        birdJump();
    }
});
