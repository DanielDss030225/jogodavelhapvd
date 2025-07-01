class JogoDaVelha {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'heart'; // 'heart' para criança, 'hand' para policial
        this.gameActive = true;
        this.playerSymbol = '❤️';
        this.computerSymbol = '✋';
        
        this.educationalMessages = [
            "O diálogo é a chave para resolver problemas em família!",
            "Pedir ajuda é um ato de coragem!",
            "O amor e o respeito constroem lares felizes!",
            "Todos merecem viver em paz e segurança!",
            "A família é um lugar de proteção e carinho!",
            "Conversar sobre sentimentos é muito importante!",
            "Nunca tenha medo de falar com um adulto de confiança!",
            "O respeito mútuo torna as relações mais fortes!",
            "A violência nunca é a solução para os problemas!",
            "Cada pessoa tem o direito de se sentir segura em casa!"
        ];
        
        this.policialMessages = {
            start: "Olá! Vamos jogar e aprender sobre amor e proteção? 💖",
            playerTurn: "Sua vez! Clique em uma casa para colocar seu ❤️",
            computerTurn: "Agora é minha vez de proteger! ✋",
            playerWin: "Parabéns! Você construiu um lar cheio de amor! 🎉",
            computerWin: "A proteção sempre vence! Juntos somos mais fortes! 💪",
            draw: "Todos juntos construímos a paz! 🤝",
            gameOver: "Que tal jogarmos novamente? 😊"
        };
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'heart';
        this.gameActive = true;
        
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = '';
            cell.classList.remove('taken', 'winning-line');
            // Remove event listeners existentes
            cell.replaceWith(cell.cloneNode(true));
        });
        
        // Re-adicionar event listeners após clonar
        const newCells = document.querySelectorAll('.cell');
        newCells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        
        const resetButton = document.getElementById('resetButton');
        resetButton.replaceWith(resetButton.cloneNode(true));
        document.getElementById('resetButton').addEventListener('click', () => this.resetGame());
        
        this.updateDisplay();
        this.showRandomEducationalMessage();
    }
    
    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== '' || this.currentPlayer !== 'heart') {
            return;
        }
        
        this.makeMove(index, 'heart');
        
        if (this.gameActive && this.currentPlayer === 'hand') {
            setTimeout(() => {
                this.computerMove();
            }, 1000);
        }
    }
    
    makeMove(index, player) {
        this.board[index] = player;
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = player === 'heart' ? this.playerSymbol : this.computerSymbol;
        cell.classList.add('taken');
        
        if (this.checkWinner()) {
            this.endGame(player);
        } else if (this.board.every(cell => cell !== '')) {
            this.endGame('draw');
        } else {
            this.currentPlayer = player === 'heart' ? 'hand' : 'heart';
            this.updateDisplay();
        }
    }
    
    computerMove() {
        if (!this.gameActive) return;
        
        // Estratégia simples: tentar ganhar, depois bloquear, depois jogar aleatório
        let move = this.findWinningMove('hand') || 
                   this.findWinningMove('heart') || 
                   this.findRandomMove();
        
        if (move !== null) {
            this.makeMove(move, 'hand');
        }
    }
    
    findWinningMove(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
            [0, 4, 8], [2, 4, 6] // diagonais
        ];
        
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            const line = [this.board[a], this.board[b], this.board[c]];
            
            if (line.filter(cell => cell === player).length === 2 && 
                line.filter(cell => cell === '').length === 1) {
                return pattern[line.indexOf('')];
            }
        }
        return null;
    }
    
    findRandomMove() {
        const emptyCells = this.board
            .map((cell, index) => cell === '' ? index : null)
            .filter(index => index !== null);
        
        if (emptyCells.length > 0) {
            return emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
        return null;
    }
    
    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
            [0, 4, 8], [2, 4, 6] // diagonais
        ];
        
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                this.highlightWinningLine(pattern);
                return this.board[a];
            }
        }
        return null;
    }
    
    highlightWinningLine(pattern) {
        pattern.forEach(index => {
            document.querySelector(`[data-index="${index}"]`).classList.add('winning-line');
        });
    }
    
    endGame(result) {
        this.gameActive = false;
        document.querySelector('.board').classList.add('game-over');
        
        let message;
        if (result === 'heart') {
            message = this.policialMessages.playerWin;
        } else if (result === 'hand') {
            message = this.policialMessages.computerWin;
        } else {
            message = this.policialMessages.draw;
        }
        
        this.updatePolicialMessage(message);
        this.updateCurrentPlayerDisplay(this.policialMessages.gameOver);
        
        setTimeout(() => {
            this.showRandomEducationalMessage();
        }, 2000);
    }
    
    resetGame() {
        document.querySelector('.board').classList.remove('game-over');
        this.initializeGame();
    }
    
    updateDisplay() {
        if (this.currentPlayer === 'heart') {
            this.updateCurrentPlayerDisplay(this.policialMessages.playerTurn);
            this.updatePolicialMessage(this.policialMessages.playerTurn);
        } else {
            this.updateCurrentPlayerDisplay(this.policialMessages.computerTurn);
            this.updatePolicialMessage(this.policialMessages.computerTurn);
        }
    }
    
    updateCurrentPlayerDisplay(message) {
        document.getElementById('currentPlayer').textContent = message;
    }
    
    updatePolicialMessage(message) {
        document.getElementById('policialMessage').textContent = message;
    }
    
    showRandomEducationalMessage() {
        const randomMessage = this.educationalMessages[
            Math.floor(Math.random() * this.educationalMessages.length)
        ];
        document.getElementById('messageText').textContent = randomMessage;
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new JogoDaVelha();
});

