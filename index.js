const game = new Chess();

const board = Chessboard('board', {
  draggable: true,
  position: 'start',

  onDragStart: (source, piece) => {
    // Keine Züge wenn Spiel vorbei
    if (game.game_over()) return false;

    // Nur eigene Figuren ziehen
    if (
      (game.turn() === 'w' && piece.startsWith('b')) ||
      (game.turn() === 'b' && piece.startsWith('w'))
    ) {
      return false;
    }
  },

  onDrop: (source, target) => {
    const move = game.move({
      from: source,
      to: target,
      promotion: 'q' // immer Dame
    });

    // Illegaler Zug
    if (move === null) return 'snapback';

    updateStatus();
  },

  onSnapEnd: () => {
    board.position(game.fen());
  }
});

function updateStatus() {
  let status = '';

  if (game.in_checkmate()) {
    status = `Schachmatt! ${game.turn() === 'w' ? 'Schwarz' : 'Weiß'} gewinnt`;
  } else if (game.in_draw()) {
    status = 'Unentschieden';
  } else {
    status = `${game.turn() === 'w' ? 'Weiß' : 'Schwarz'} am Zug`;
    if (game.in_check()) {
      status += ' (Schach!)';
    }
  }

  document.getElementById('status').textContent = status;
}

document.getElementById('reset').addEventListener('click', () => {
  game.reset();
  board.start();
  updateStatus();
});

updateStatus();
