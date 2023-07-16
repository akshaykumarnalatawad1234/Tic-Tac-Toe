function Player(sign){
    this.sign = sign;

    this.getSign = function () {
      return this.sign;
    };
}

const gameBoard = (() =>{
    let board = new Array(9);
    board.fill(null);
    
    const setField = (sign, index) =>{
        if(index>=board.length) return;
        board[index] = sign;
    };
    
    const  getField = (index) => {
        if(index>=board.length) return;
        return board[index];
    };
    const reset = () => {
        board.fill(null);
    };

    return {setField, getField, reset};
})();


const displayController = (() => {
    const message = document.querySelector(".message");
    const fields = document.querySelector('.gameboard');
    const restartBtn = document.querySelector('.restart');

    window.addEventListener('DOMContentLoaded', () =>{
        fields.addEventListener('click', (e) =>{
            gameController.playRound(e.target.dataset.index);
            updateGameBoard(e.target);
        });
    });

    const updateGameBoard = (target) => {
        target.innerText = gameBoard.getField(target.dataset.index);
    }

    const updateComplete = () =>{
        const fieldElements = fields.childNodes;
        fieldElements.forEach(field => {
            field.innerText = null;
        });
    }
    restartBtn.addEventListener('click', (e) => {
        gameController.resetGame();
        message.innerHTML = `player X's turn`;
        updateComplete();
    });

    const setMessage = (msg) => {
        message.innerText = msg;
    }

    const setResult = (msg) =>{
        message.innerText = msg;
    }
    return {setResult, setMessage};
})();

const gameController = (() =>{
    const player1 = new Player("X");
    const player2 = new Player("O");
    let xIsNext = true;

    const playRound = (index) =>{
        if(gameBoard.getField(index)!=null || winningCondition() || getOver())
            return;
        if(xIsNext){
            gameBoard.setField(player1.getSign(), index);
        }
        else{
             gameBoard.setField(player2.getSign(), index);
            }
        if(winningCondition()){
            displayController.setMessage(`Player ${winningCondition()} has won!`);
            return ;
        }
        if(getOver()){
            displayController.setMessage("It's a draw!! Restart to play again.");
            return ;
        }
        displayController.setMessage(`Player ${xIsNext ? player2.getSign() : player1.getSign()}'s turn`)
        xIsNext = !xIsNext;
    };

    const getOver = () =>{
        for(let i=0; i<9;i++){
            if(gameBoard.getField(i) == null)
                return false;
        }
        return true;
    }

    const resetGame = () =>{
        xIsNext = true;
        gameBoard.reset();
    }
    const winningCondition = ()=>{
        const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
        ];
        for(let i=0;i<lines.length;i++){
            const [a,b,c] = lines[i];
            if(gameBoard.getField(a) && gameBoard.getField(a) === gameBoard.getField(b) && gameBoard.getField(b) === gameBoard.getField(c)){
                return gameBoard.getField(a);
            }
        }
        return null;
    };
    return {playRound, getOver, resetGame, winningCondition};
})();
