// Module that contains the gameboard.
const gameBoard = (() => {
    let markers = [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
    ];

    let spotTaken = [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
    ];

    const checkWin = () => {
        if (spotTaken[0] == true) {
            if (markers[0] == markers[1] && markers[0] == markers[2]) {
                displayController.gameOver(markers[0])
            } else if (markers[0] == markers[3] && markers[0] == markers[6]) {
                displayController.gameOver(markers[0])
            } else if (markers[0] == markers[4] && markers[0] == markers[8]) {
                displayController.gameOver(markers[0])
            };
        };
        if (spotTaken[4] == true) {
            if (markers[4] == markers[1] && markers[4] == markers[7]) {
                displayController.gameOver(markers[4])
            } else if (markers[4] == markers[3] && markers[4] == markers[5]) {
                displayController.gameOver(markers[4])
            } else if (markers[4] == markers[2] && markers[4] == markers[6]) {
                displayController.gameOver(markers[4])
            };
        };
        if (spotTaken[8] == true) {
            if (markers[8] == markers[2] && markers[8] == markers[5]) {
                displayController.gameOver(markers[8])
            } else if (markers[8] == markers[6] && markers[8] == markers[7]) {
                displayController.gameOver(markers[8])
            };
        };
        if (spotTaken.filter(taken => taken == true).length === 9) {
            displayController.gameOver('draw');
        };

        gameFlow.nextTurn();
    };

    const resetMarkers = () => {
        markers.forEach((marker, index) => {
            markers[index] = undefined;
        });
    };

    const resetSpotTaken = () => {
        spotTaken.forEach((spot, index) => {
            spotTaken[index] = false;
        });
    };

    return {markers, spotTaken, checkWin, resetMarkers, resetSpotTaken}
})();


// Player factory
const player = (name, marker) => {
    const takeSpot = (x) => {
        console.log(marker);
        displayController.update(x, marker);
        gameBoard.markers[x] = marker;
        gameBoard.spotTaken[x] = true;
    };
    
    return {name, marker, takeSpot};
};


// Module to control the display
const displayController = (() => {
    const endText = document.querySelector('.end-text');
    const turnDisplay = document.querySelector('.turn-display');
    
    
    const invalidMove = (player) => {
        turnDisplay.textContent = `Please select an empty spot, ${gameFlow.players[player].name}`
    };

    const updateTurnDisp = (player) => {
        turnDisplay.textContent = `It is ${gameFlow.players[player].name}'s turn.`
    };

    const clearTurnDisp = () => {
        turnDisplay.textContent = '';
    };
    
    const spotHandler = (i) => {
        gameFlow.playerTurn(i);
    };
    
    const clear = () => {
        const spots = document.querySelectorAll('.game-spot');
        spots.forEach(spot => {
            spot.textContent = undefined;
        });
        endText.textContent = '';
    };

    const update = (spot, marker) => {
        const spots = document.querySelectorAll('.game-spot');
        spots[spot].textContent = marker;
    };

    const updatePlayerNames = () => {
        const nameBoxes = document.querySelectorAll('.name-box');
        nameBoxes.forEach((box, index) => {
            box.textContent = gameFlow.players[index].name
        });
    };

    const boardSetup = () => {
        let spots = document.querySelectorAll('.game-spot');
        spots.forEach((spot, index) => {
            spot.addEventListener('click', (e) => {
                spotHandler(index);
            });
        });
    };

    const boardTeardown = () => {
        let spots = document.querySelectorAll('.game-spot');
        spots.forEach((spot) => {
            spot.replaceWith(spot.cloneNode(true));
        });
    };

    const gameOver = (winner) => {
        switch (winner) {
            case 'x':
                navi.gameIsOver = true;
                endText.textContent = `${gameFlow.players[0].name} is the Winner!`;
                clearTurnDisp();
                navi.toggleGameOver();
                break;
            case 'o':
                navi.gameIsOver = true;
                endText.textContent = `${gameFlow.players[1].name} is the Winner!`
                clearTurnDisp();
                navi.toggleGameOver();
                break;
            case 'draw':
                navi.gameIsOver = true;
                endText.textContent = 'Its a Draw!'
                clearTurnDisp();
                navi.toggleGameOver();
                break;
            default:
                console.log('uh oh')
        };
    };
    
    return {invalidMove, updateTurnDisp, clearTurnDisp, clear, update, updatePlayerNames, boardSetup, boardTeardown, gameOver};
})();

// Module to control the flow of gameplay
const gameFlow = (() => {
    const ex = 'x'
    const oh = 'o'

    // Stores the player objects.
    const players = []

    let thisTurn = 0;
    let onePlayerMode = false
    let difficulty

    const start2PGame = (playerOne, playerTwo) => {
        players[0] = player(playerOne, ex);
        players[1] = player(playerTwo, oh);
        displayController.updatePlayerNames();
        displayController.boardSetup();
        navi.gameIsOver = false;
        displayController.clearTurnDisp();
        displayController.updateTurnDisp(thisTurn);
    };
    
    const nextTurn = () => {
        if (thisTurn === 0) {
            thisTurn = 1;
        } else if (thisTurn === 1) {
            thisTurn = 0;
        }
    };

    const playerTurn = (i) => {
        if (navi.gameIsOver === true) {return;}
        if (gameBoard.spotTaken[i] === true) {
            displayController.invalidMove(thisTurn);
            return;
        }
        players[thisTurn].takeSpot(i);
        gameBoard.checkWin();
        displayController.clearTurnDisp();
        displayController.updateTurnDisp(thisTurn);
    };

    const restart = () => {
        displayController.clear();
        displayController.clearTurnDisp();
        gameBoard.resetMarkers();
        gameBoard.resetSpotTaken();
        navi.gameIsOver = false;
        thisTurn = 0;
    };

    const resetPlayers = () => {
        players.forEach(player => {
            player = undefined;
        });
    };
    
    return {thisTurn, players, start2PGame, nextTurn, playerTurn, restart, resetPlayers}
})();

// Menu Navigation Module
const navi = (() => {

    // Modals
    const choose = document.querySelector('.choose');
    const oneP = document.querySelector('.one-player');
    const twoP = document.querySelector('.two-player');
    const menu = document.querySelector('.menu');
    const gameOver = document.querySelector('.game-over');
    // Buttons
    const onePBtn = document.querySelector('.oneP-btn');
    const twoPBtn = document.querySelector('.twoP-btn');
    const start2P = document.querySelector('.start2P-btn')
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtns = document.querySelectorAll('.close-btn');
    const backBtns = document.querySelectorAll('.back-btn');
    const samePlayersBtn = document.querySelector('.same-players');
    const newPlayersBtn = document.querySelector('.new-players');
    // Inputs
    const playerNameX = document.querySelector('#twoP-nameX');
    const playerNameO = document.querySelector('#twoP-nameO');

    let gameIsOver = false;
    
    const toggleChoose = () => {
        choose.classList.toggle('show');
    }
    
    const toggleOneP = () => {
        oneP.classList.toggle('show');
    }
    
    const toggleTwoP = () => {
        twoP.classList.toggle('show');
    }
    
    const toggleMenu = (game) => {
        if (game == true) {
            gameOver.classList.toggle('show');
        } else {
            menu.classList.toggle('show');
        }
    }
    
    const toggleGameOver = () => {
        gameOver.classList.toggle('show');
    }
    
    toggleChoose();

    // Event listeners
    onePBtn.addEventListener('click', () => {
        toggleChoose();
        toggleOneP();
    });
    
    twoPBtn.addEventListener('click', () => {
        toggleChoose();
        toggleTwoP();
    });
    
    start2P.addEventListener('click', () => {
        let playerX = playerNameX.value;
        let playerO = playerNameO.value;
        gameFlow.start2PGame(playerX, playerO);
        toggleTwoP();
        playerNameX.value = '';
        playerNameO.value = '';
    });
    
    menuBtn.addEventListener('click', () => {
        toggleMenu(navi.gameIsOver);
    });
    
    closeBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (index == 0) {
                toggleGameOver();
            } else if (index == 1) {
                toggleMenu();
            }
        });
    });

    backBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            if (index == 0) {
                toggleOneP();
                toggleChoose();
            } else if (index == 1) {
                toggleTwoP();
                toggleChoose();
            }
        });
    });

    samePlayersBtn.addEventListener('click', () => {
        gameFlow.restart();
        displayController.updateTurnDisp(gameFlow.thisTurn);
        toggleGameOver();
    });

    newPlayersBtn.addEventListener('click', () => {
        gameFlow.restart();
        gameFlow.resetPlayers;
        displayController.clearTurnDisp();
        displayController.boardTeardown();
        toggleGameOver();
        toggleChoose();
    });

    return {gameIsOver, toggleMenu, toggleGameOver}
})(); 


