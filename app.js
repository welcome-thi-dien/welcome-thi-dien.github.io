/* global engineGame */
const turnEl = document.getElementById('turn');
const comboEl = document.getElementById('combo');
const movesEl = document.getElementById('moves');
const messageEl = document.getElementById('message');
const difficultyEl = document.getElementById('difficulty');
const newGameBtn = document.getElementById('newGame');
const hintBtn = document.getElementById('hintBtn');
const boardHintEl = document.getElementById('boardHint');
const boardEl = document.getElementById('board');
const modalEl = document.getElementById('resultModal');
const modalTextEl = document.getElementById('resultText');
const closeModalBtn = document.getElementById('closeModal');

const winMessages = [
  'Em thật giỏi. Thắng rồi thì cứ nói rằng anh rất tự hào về em.',
  'Chiến thắng này đẹp lắm. Em là nữ hoàng trên bàn cờ.',
  'Em làm rất tốt. Anh muốn ôm em thật chặt.',
  'Cách em đi từng nước làm anh nhìn mà mê luôn.',
  'Thắng kiểu này là thắng bằng trí tuệ đó em.',
  'Em bình tĩnh, thông minh và rất bản lĩnh. Anh thích lắm.',
  'Ván này em kiểm soát thế trận quá hay.',
  'Em thắng rồi, nhưng với anh thì em lúc nào cũng là người thắng.',
  'Chơi cờ với em cảm giác rất an tâm.',
  'Em giỏi theo cách rất nhẹ nhàng, anh thấy dễ thương vô cùng.',
];

const loseMessages = [
  'Không sao đâu em. Lần sau mình lại chiến, anh vẫn có em.',
  'Thua một ván không quan trọng. Em vẫn là nhất trong lòng anh.',
  'Nghỉ một chút, uống nước nhé. Anh tin em làm được.',
  'Ván này hơi khó, không phải lỗi của em đâu.',
  'Em đã cố gắng rồi, anh thấy hết mà.',
  'Thua cũng được, miễn là em không buồn.',
  'Có anh ở đây rồi, mình chơi tiếp khi em sẵn sàng.',
  'Mỗi ván thua là một lần em học thêm được điều mới.',
  'Em không cần phải mạnh mọi lúc, chỉ cần là em thôi.',
  'Thắng thua gì cũng được, miễn là em vẫn cười.',
];

const drawMessages = [
  'Hòa rồi. Mình nghĩ là trận đấu rất đẹp.',
  'Căng đó. Em đi rất thông minh.',
  'Hòa kiểu này là ngang tài ngang sức luôn.',
  'Hai bên đều chơi rất đẹp, em làm tốt lắm.',
  'Giữ được thế cân bằng như vậy không dễ đâu.',
  'Ván này em xử lý rất điềm tĩnh.',
  'Không thắng nhưng cũng không thua, anh thấy ổn áp.',
  'Cảm giác như hai người đang khiêu vũ trên bàn cờ vậy.',
  'Hòa nhưng vẫn rất đã, đúng không em.',
  'Quan trọng là em chơi bằng cả trái tim.',
];

const comboKey = 'chess_combo_count';
let combo = Number(localStorage.getItem(comboKey)) || 0;
let gameApi = null;
let gameOverAnnounced = false;
let selectedSquare = null;
let legalMoves = [];
const SELECTED_CLASS = 'highlight1-32417';
const MOVE_CLASS = 'highlight2-9c5d2';
let hintWorker = null;
let hintReady = false;
let hintPending = false;
let hintFrom = null;
let hintTo = null;

function setMessage(text) {
  messageEl.textContent = text;
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function updateStatus(game) {
  if (!game) {
    turnEl.textContent = 'Trắng';
    comboEl.textContent = combo;
    return;
  }
  turnEl.textContent = game.turn() === 'w' ? 'Trắng' : 'Đen';
  comboEl.textContent = combo;
}

function resetMoveList() {
  movesEl.innerHTML = '';
}

function updateMoves(game) {
  resetMoveList();
  const history = game.history({ verbose: true });
  history.forEach((move) => {
    const item = document.createElement('li');
    item.textContent = move.san;
    movesEl.appendChild(item);
  });
}

function isGameOver(game) {
  if (!game) return false;
  if (typeof game.isGameOver === 'function') return game.isGameOver();
  return game.game_over();
}

function isCheckmate(game) {
  if (!game) return false;
  if (typeof game.isCheckmate === 'function') return game.isCheckmate();
  return game.in_checkmate();
}

function updateEndMessage(game) {
  if (!game || gameOverAnnounced) return;
  if (!isGameOver(game)) return;
  let text = '';
  if (isCheckmate(game)) {
    const winner = game.turn() === 'w' ? 'Đen' : 'Trắng';
    const playerWon = winner === 'Trắng';
    if (playerWon) {
      combo += 1;
      text = randomFrom(winMessages);
    } else {
      combo = Math.max(0, combo - 1);
      text = randomFrom(loseMessages);
    }
  } else {
    text = randomFrom(drawMessages);
  }
  localStorage.setItem(comboKey, combo);
  updateStatus(game);
  setMessage(text);
  showModal(text);
  gameOverAnnounced = true;
}

function handleUpdate(game) {
  updateMoves(game);
  updateStatus(game);
  updateEndMessage(game);
  clearHighlights();
  clearHint();
  selectedSquare = null;
  legalMoves = [];
}

function normalizeMoves(game, moves) {
  if (!moves || moves.length === 0) return [];
  if (typeof moves[0] !== 'string') return moves;
  const normalized = [];
  moves.forEach((san) => {
    const moveObj = game.move(san, { sloppy: true });
    if (moveObj) {
      normalized.push(moveObj);
      game.undo();
    }
  });
  return normalized;
}

function showModal(text) {
  modalTextEl.textContent = text;
  modalEl.classList.add('is-open');
  modalEl.setAttribute('aria-hidden', 'false');
}

function hideModal() {
  modalEl.classList.remove('is-open');
  modalEl.setAttribute('aria-hidden', 'true');
}

function clearHighlights() {
  boardEl
    .querySelectorAll(`.square-55d63.${SELECTED_CLASS}, .square-55d63.${MOVE_CLASS}`)
    .forEach((el) => {
      el.classList.remove(SELECTED_CLASS, MOVE_CLASS);
    });
}

function clearHint() {
  if (hintFrom) {
    const fromEl = boardEl.querySelector(`[data-square="${hintFrom}"]`);
    if (fromEl) fromEl.classList.remove('hint-from');
  }
  if (hintTo) {
    const toEl = boardEl.querySelector(`[data-square="${hintTo}"]`);
    if (toEl) toEl.classList.remove('hint-to');
  }
  hintFrom = null;
  hintTo = null;
  hintPending = false;
  if (hintBtn) {
    hintBtn.disabled = false;
  }
  if (boardHintEl) {
    boardHintEl.textContent = 'Chọn quân cờ, sau đó chọn ô muốn đi.';
  }
}

function applyHint(from, to) {
  clearHint();
  hintFrom = from;
  hintTo = to;
  const fromEl = boardEl.querySelector(`[data-square="${from}"]`);
  const toEl = boardEl.querySelector(`[data-square="${to}"]`);
  if (fromEl) fromEl.classList.add('hint-from');
  if (toEl) toEl.classList.add('hint-to');
  if (hintBtn) {
    hintBtn.disabled = false;
  }
  if (boardHintEl) {
    boardHintEl.textContent = 'Gợi ý đã được tô xanh.';
  }
}

function highlightMoves() {
  clearHighlights();
  if (!selectedSquare) return;
  const selectedEl = boardEl.querySelector(`[data-square="${selectedSquare}"]`);
  if (selectedEl) selectedEl.classList.add(SELECTED_CLASS);
  legalMoves.forEach((move) => {
    const moveEl = boardEl.querySelector(`[data-square="${move.to}"]`);
    if (moveEl) moveEl.classList.add(MOVE_CLASS);
  });
}

function highlightFromSquare(square) {
  if (!gameApi) return;
  const game = gameApi.getGame();
  if (!game) return;
  const piece = game.get(square);
  if (!piece || piece.color !== 'w') return;
  selectedSquare = square;
  legalMoves = normalizeMoves(game, game.moves({ square, verbose: true }));
  highlightMoves();
}

function onBoardSelect(event) {
  if (!gameApi) return;

  // Ngăn chặn double-tap zoom trên mobile
  if (event.type === 'touchend') {
    event.preventDefault();
    event.stopPropagation();
  }

  // Chỉ xử lý left click cho mouse
  if (event.type === 'mousedown' && event.button !== 0) return;

  const squareEl = event.target.closest('.square-55d63');
  if (!squareEl) return;
  clearHint();
  const square = squareEl.getAttribute('data-square');
  const game = gameApi.getGame();
  if (!game || isGameOver(game)) return;
  if (game.turn() !== 'w') return;

  const piece = game.get(square);
  if (!selectedSquare) {
    if (piece && piece.color === 'w') {
      highlightFromSquare(square);
    }
    return;
  }

  if (square === selectedSquare) {
    clearHighlights();
    selectedSquare = null;
    legalMoves = [];
    return;
  }

  const isLegal = legalMoves.some((move) => move.to === square);
  if (!isLegal) {
    if (piece && piece.color === 'w') {
      highlightFromSquare(square);
    } else {
      clearHighlights();
      selectedSquare = null;
      legalMoves = [];
    }
    return;
  }

  gameApi.move(selectedSquare, square, 'q');
  clearHighlights();
  selectedSquare = null;
  legalMoves = [];
}

function ensureHintWorker() {
  if (hintWorker) return;
  hintWorker = new Worker('stockfish.js');
  hintWorker.onmessage = (event) => {
    const line = event.data;
    if (line === 'uciok') {
      hintReady = true;
      return;
    }
    if (line.startsWith('bestmove')) {
      hintPending = false;
      const [, move] = line.split(' ');
      if (move && move !== '(none)') {
        applyHint(move.slice(0, 2), move.slice(2, 4));
      } else {
        clearHint();
      }
    }
  };
  hintWorker.postMessage('uci');
}

function requestHint() {
  if (!gameApi || hintPending) return;
  const game = gameApi.getGame();
  if (!game || isGameOver(game)) return;
  if (game.turn() !== 'w') return;
  ensureHintWorker();
  hintPending = true;
  if (hintBtn) hintBtn.disabled = true;
  if (boardHintEl) {
    boardHintEl.textContent = 'Đợi chút, gợi ý đang tới...';
  }
  const depth = Math.max(4, Number(difficultyEl.value));
  const sendGo = () => {
    hintWorker.postMessage(`position fen ${game.fen()}`);
    hintWorker.postMessage(`go depth ${depth}`);
  };
  if (hintReady) {
    sendGo();
  } else {
    setTimeout(sendGo, 120);
  }
}

function initGame() {
  if (typeof engineGame !== 'function') {
    setMessage('Thiếu enginegame.js, vui lòng kiểm tra lại file.');
    return;
  }

  gameOverAnnounced = false;
  gameApi = engineGame({
    boardId: 'board',
    stockfishjs: 'stockfish.js',
    pieceTheme: function (piece) {
      return 'wikipedia/' + piece + '.png';
    },
    draggable: false,
    sparePieces: false,
    moveSpeed: 300,
    snapbackSpeed: 300,
    snapSpeed: 300,
    appearSpeed: 0,
    trashSpeed: 0,
    onUpdate: handleUpdate,
    thinkDelayMs: 550,
  });

  gameApi.reset();
  gameApi.setPlayerColor('white');
  gameApi.setDisplayScore(false);
  gameApi.setSkillLevel(Number(difficultyEl.value));
  gameApi.start();
  handleUpdate(gameApi.getGame());
}

function resetGame() {
  if (!gameApi) return;
  gameOverAnnounced = false;
  resetMoveList();
  setMessage('Chúc em vui vẻ. Thắng thua gì cũng có anh bên cạnh.');
  gameApi.reset();
  gameApi.setSkillLevel(Number(difficultyEl.value));
  gameApi.start();
}

difficultyEl.addEventListener('change', () => {
  if (!gameApi) return;
  gameApi.setSkillLevel(Number(difficultyEl.value));
});

if (hintBtn) {
  hintBtn.addEventListener('click', requestHint);
}

// Chỉ dùng touchend cho mobile để tránh nháy màn hình
// Click event sẽ tự động bị preventDefault từ touchend
boardEl.addEventListener('touchend', onBoardSelect, { passive: false, capture: true });
// Dùng mousedown cho desktop thay vì click để responsive hơn
boardEl.addEventListener('mousedown', onBoardSelect, true);
closeModalBtn.addEventListener('click', hideModal);
modalEl.addEventListener('click', (event) => {
  if (event.target.classList.contains('modal__backdrop')) {
    hideModal();
  }
});

newGameBtn.addEventListener('click', resetGame);

initGame();
