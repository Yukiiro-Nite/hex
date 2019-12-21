// Lots of help from https://www.redblobgames.com/grids/hexagons/

let defaultCell = {
  "bg-color": '#444444',
  "fg-color": "#FFFFFF",
  'border-color': '#000000',
  'cell-value': "00",
  accumulator: 0,
  stack: []
};

const emptyCell = {
  'bg-color': '#444444',
  'border-color': '#000000'
};

function HexGrid(size = 20) {
  this.size = size;
  this.cells = {};

  this.getCellAt = function (x, y) {
    const q = x * 2/3 / this.size;
    const r = (-x / 3 + Math.sqrt(3)/3 * y) / this.size;
    const pos = hex_round({q, r});
    console.log(pos);
    if(!this.cells[JSON.stringify(pos)]) {
      this.cells[JSON.stringify(pos)] = Object.assign({}, defaultCell, {pos});
    }
    return this.cells[JSON.stringify(pos)];
  };

  this.drawCells = function (canvas, context) {
    context.clearRect(0,0, canvas.width, canvas.height);
    this.drawGrid(canvas, context);
    Object.keys(this.cells)
      .map(key => this.cells[key])
      .forEach(cell => this.drawCell(canvas, context, cell));
  };

  this.drawGrid = function(canvas, context) {
    new Array(18)
      .fill()
      .map((_, x) =>
        new Array(18)
          .fill()
          .map((_, y) =>
            Object.assign({}, emptyCell, {pos: {q: x, r: y}})))
      .reduce((acc, row) => acc.concat(row), [])
      .forEach(cell => this.drawCell(canvas, context, cell));
  };

  this.drawCell = function(canvas, context, cell) {
    let points = new Array(6)
      .fill()
      .map((_,i) => hex_corner(hex_to_pixel(cell.pos), this.size - 1, i));
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(({x,y}) => context.lineTo(x,y));
    context.lineTo(points[0].x, points[0].y);

    context.fillStyle = cell['bg-color'];
    context.fill();
    context.strokeStyle = cell['border-color'];
    context.lineWidth = 3;
    context.stroke();
    context.closePath();
  };

  function hex_round(hex) {
    return cube_to_axial(cube_round(axial_to_cube(hex)));
  }

  function cube_round(cube) {
    var rx = Math.round(cube.x);
    var ry = Math.round(cube.y);
    var rz = Math.round(cube.z);

    var x_diff = Math.abs(rx - cube.x);
    var y_diff = Math.abs(ry - cube.y);
    var z_diff = Math.abs(rz - cube.z);

    if (x_diff > y_diff && x_diff > z_diff) {
      rx = -ry - rz;
    } else if (y_diff > z_diff) {
      ry = -rx - rz;
    } else {
      rz = -rx - ry;
    }

    return {x: rx, y: ry, z: rz};
  }

  function cube_to_axial(cube) {
    var q = cube.x;
    var r = cube.z;
    return {q, r}
  }

  function axial_to_cube(hex) {
    var x = hex.q;
    var z = hex.r;
    var y = -x - z;
    return {x, y, z}
  }

  function hex_corner(center, size, i) {
    var angle_deg = 60 * i;
    var angle_rad = Math.PI / 180 * angle_deg;
    return {
        x: center.x + size * Math.cos(angle_rad),
        y: center.y + size * Math.sin(angle_rad)
    }
  }

  function hex_to_pixel(hex) {
    let x = size * 3 / 2 * hex.q;
    let y = size * Math.sqrt(3) * (hex.r + hex.q / 2);
    return {x, y};
  }
}