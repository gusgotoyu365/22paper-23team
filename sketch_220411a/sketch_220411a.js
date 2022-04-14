let sliderGroup = [];
let X;
let Y;
let Z;
let centerX;
let centerY;
let centerZ;
let hi = 20;

let cols, rows;
let scl = 20;
let w = 1400;
let h = 1000;
const SB = -70; //Sea bottom

let sb_speed = 0;

let terrain = [];

function setup() {
  createCanvas(540, 960, WEBGL);
  //cols = w / scl;
  //rows = h / scl;
  cols = 20;
  rows = 20;
  
  for (let x = 0; x < cols; x++) {
    terrain[x] = [];
    for (let y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
    }
  }
  
  for (let i = 0; i < 6; i++) {
    if (i === 2) {
      sliderGroup[i] = createSlider(-1000, 1000, 200);
    } else {
      sliderGroup[i] = createSlider(-1000, 1000, 0);
    }
    hi = map(i, 0, 6, 5, 85);
    sliderGroup[i].position(10, height + hi);
    sliderGroup[i].style('width', '80px');
  }
}

function draw() {
  rotateX(PI/2);
  //땅  
  let yoff = sb_speed;
  
  sb_display(yoff);
  
  slider();
  
  //camera(X, Y, Z, centerX, centerY, centerZ, 0, 1, 0);
  //print("X: "+X+"  Y: "+Y+"  Z: "+Z+"\ncX: "+centerX+"  cY: "+centerY+"  cZ: "+centerZ);
  camera(1000, -187, 656, -94, -125, 0);
  //camera(-625, 813, 1000, 281, -406, 125);
}

function slider() {
  X = sliderGroup[0].value();
  Y = sliderGroup[1].value();
  Z = sliderGroup[2].value();
  centerX = sliderGroup[3].value();
  centerY = sliderGroup[4].value();
  centerZ = sliderGroup[5].value();
}

function sb_display(yoff) {
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -50, 50);
      xoff += 0.2;
    }
    yoff += 0.2;
  }
  
  push();
  background(0);
  normalMaterial();
  fill(242,245,169);
  for (let y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }
  
  for (let x = 0; x < cols; x++) {
    beginShape(TRIANGLE_STRIP);
    for (let y = 0; y < rows - 1; y++) {
      if (x == 0 || x == cols - 1) {
        vertex(x * scl, y * scl, terrain[x][y]);
        vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
        vertex(x * scl, y * scl, SB);
        vertex(x * scl, (y + 1) * scl, SB);
      }
    }
    endShape();
  }
  
  for (let y = 0; y < rows; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < rows - 1; x++) {
      if (y == 0 || y == rows - 1) {
        vertex(x * scl, y * scl, terrain[x][y]);
        vertex((x + 1) * scl, y * scl, terrain[x + 1][y]);
        vertex(x * scl, y * scl, SB);
        vertex((x + 1) * scl, y * scl, SB);
      }
    }
    endShape();
  }
  
  beginShape();
  vertex(0, 0, SB);
  vertex(0, 19 * scl, SB);
  vertex(19 * scl, 19 * scl, SB);
  vertex(19 * scl, 0, SB);
  endShape(CLOSE);
  pop();
}

function sea_display() {
  
}
