// Module that contains the gameboard.
const gameBoard = (() => {
    const markers = [
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        // 'x', 'o', 'x', 'o', 'o', 'x', 'x', 'x', 'o'
    ];

    const spotTaken = [
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

    return {markers, spotTaken, checkWin}
})();


// Player factory
const player = (name, marker) => {
    const takeSpot = (x) => {
        console.log(marker);
        displayController.update(x, marker);
        gameBoard.markers[x] = marker;
        gameBoard.spotTaken[x] = true;
        
        if (gameFlow.onePlayerMode == true) {
            computer.play();
        };
    };
    
    return {name, marker, takeSpot};
};


// Module to control the display
const displayController = (() => {
    const spots = document.querySelectorAll('.game-spot');
    const endText = document.querySelector('.end-text')
    
    
    const invalidMove = () => {
        return;
    };
    
    const spotHandler = (i) => {
        if (gameBoard.spotTaken[i] === true) {
            invalidMove();
            return;
        };
        
        gameFlow.playerTurn(i);
    };
    
    const clear = () => {
        spots.forEach(spot => {
            spot.textContent = undefined;
        });
    };

    const update = (spot, marker) => {
        spots[spot].textContent = marker;
    };

    const boardSetup = () => {
        spots.forEach((spot, index) => {
            spot.addEventListener('click', () => {
                spotHandler(index);
            });
        });
    };

    const gameOver = (winner) => {
        switch (winner) {
            case 'x':
                navi.gameIsOver = true;
                endText.textContent = `${gameFlow.players[0].name} is the Winner!`
                navi.toggleGameOver();
                break;
            case 'o':
                navi.gameIsOver = true;
                endText.textContent = `${gameFlow.players[1].name} is the Winner!`
                navi.toggleGameOver();
                break;
            case 'draw':
                navi.gameIsOver = true;
                endText.textContent = 'Its a Draw!'
                navi.toggleGameOver();
                break;
            default:
                console.log('uh oh')
        };
    };
    
    return {spots, clear, update, boardSetup, gameOver};
})();

// Module to control the flow of gameplay
const gameFlow = (() => {
    // Stores the player objects.
    const one = '1'
    const two = '2'
    const ex = 'x'
    const oh = 'o'
    const players = [player(one, ex), player(two, oh)]

    let thisTurn = 0;
    let onePlayerMode = false
    let difficulty
    
    const nextTurn = () => {
        if (thisTurn === 0) {
            thisTurn = 1;
            return;
        } else if (thisTurn === 1) {
            thisTurn = 0;
            return;
        }
    };

    const playerTurn = (i) => {
        players[thisTurn].takeSpot(i);
        gameBoard.checkWin();
    };
    
    return {thisTurn, players, nextTurn, playerTurn}
})();

// Menu Navigation Module
const navi = (() => {
    const choose = document.querySelector('.choose');
    const oneP = document.querySelector('.one-player');
    const twoP = document.querySelector('.two-player');
    const menu = document.querySelector('.menu');
    const gameOver = document.querySelector('.game-over');
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtns = document.querySelectorAll('.close-btn');

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

    // Event listeners
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

    return {gameIsOver, toggleChoose, toggleOneP, toggleTwoP, toggleMenu, toggleGameOver}
})(); 

displayController.boardSetup();
