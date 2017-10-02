let canvas, context, mode, modal, inputs, accumulatorDebug, stackDebug, hexGrid;

let currentCell;

function init() {
  registerElements();
  hexGrid = new HexGrid();
  // setInterval(() => {
  //   if(mode === 'run') {
  //     defaultCell.accumulator++;
  //     defaultCell.stack = [defaultCell.accumulator].concat(defaultCell.stack);
  //   }
  // }, 1000);
}

function registerElements() {
  // get all elements
  canvas = document.getElementById('canvas');
  canvas.width = 500;
  canvas.height = 500;
  context = canvas.getContext('2d');
  let radioButtons = document.getElementsByName("mode");
  modal = document.getElementById("modal");
  let modalClose = document.getElementById("modalClose");
  let inputEls = [
    "bg-color",
    "fg-color",
    "border-color",
    "cell-value"
  ];
  accumulatorDebug = document.getElementById("accumulator-debug");
  stackDebug = document.getElementById("stack-debug");

  //set up all event listneners
  canvas.addEventListener('click', handleCanvasClick);

  mode = "edit";
  Array.from(radioButtons).forEach(el => {
    el.addEventListener('change', (event) => {
      mode = event.target.value;
    })
  });

  modalClose.addEventListener('click', handleModalClose);

  inputs = inputEls.map((id) => document.getElementById(id)).reduce((acc, el) => {
    console.log(el.id);
    acc[el.id] = {el};
    return acc;
  }, {});
}

function handleCanvasClick(event) {
  let x = event.offsetX;
  let y = event.offsetY;

  context.fillRect(x, y, 10, 10);

  currentCell = hexGrid.getCellAt(x, y);
  modal.className = `modal opened ${mode}`;
  modal.style = `top: ${event.pageY + 5}px; left: ${event.pageX + 5}px;`;
  doModeActionOnCell(currentCell);
  update();
}

function doModeActionOnCell(cell) {

  switch (mode) {
    case 'edit':
      connectEditInputs(cell);
      break;
    case 'remove':
      removeCell(cell);
      break;
    case 'run':
      connectDebugWatch(cell);
      break;
  }
}

function removeCell(cell) {
  Object.assign(cell, defaultCell);
}

function handleModalClose() {
  modal.className = "modal closed";
  disconnectEditInputs();
  disconnectDebugWatch();
}

function connectEditInputs(obj) {
  disconnectEditInputs();
  Object.keys(obj)
    .map((key) => ({key, value: obj[key]}))
    .filter(({key}) => inputs[key])
    .forEach(({key, value}) => inputs[key].el.value = value);
  Object.keys(inputs).map(key => inputs[key]).forEach(input => {
    input.listener = changeListenerFactory(input.el.id, obj);
    input.el.addEventListener('change', input.listener);
  });
}

function disconnectEditInputs() {
  Object.keys(inputs).map(key => inputs[key]).forEach(input => {
    input.el.removeEventListener('change', input.listener);
  });
}

function connectDebugWatch(cell) {
  disconnectDebugWatch();
  cell.watch('accumulator', function(prop, oldVal, newVal) {
    accumulatorDebug.innerHTML = newVal;
    return newVal;
  });
  cell.watch('stack', function(prop, oldVal, newVal) {
    stackDebug.innerHTML = newVal.map((num, index) =>
      `<tr><td>${index}</td><td>${num.toString(16)}</td><td>${num}</td></tr>`
    ).reduce((acc, str) => {acc+=str; return acc;}, '');
    return newVal;
  });
}

function disconnectDebugWatch() {
  currentCell.unwatch('accumulator');
  currentCell.unwatch('stack');
}

function changeListenerFactory(id, obj) {
  return changeListener.bind(this, id, obj);
}

function changeListener(id, obj, event) {
  obj[id] = event.target.value;
  update();
}

function update() {
  hexGrid.drawCells(canvas, context);
}
