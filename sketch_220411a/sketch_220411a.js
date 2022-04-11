let sliderGroup = [];
let X;
let Y;
let Z;
let centerX;
let centerY;
let centerZ;
let hi = 20;

var cols, rows;
var scl = 20;
var w = 1400;
var h = 1000;

var flying = 0;

var terrain = [];

function setup() {
  createCanvas(540, 960, WEBGL);
  //cols = w / scl;
  //rows = h / scl;
  cols = 20;
  rows = 20;
  
  
  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
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
  var yoff = flying;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff, yoff), 0, 1, -50, 50);
      xoff += 0.2;
    }
    yoff += 0.2;
  }

  background(0);
  //translate(0, 50);
  normalMaterial();
  fill(242,245,169);
  //translate(-w / 2, -h / 2);
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
    
  }
  
  X = sliderGroup[0].value();
  Y = sliderGroup[1].value();
  Z = sliderGroup[2].value();
  centerX = sliderGroup[3].value();
  centerY = sliderGroup[4].value();
  centerZ = sliderGroup[5].value();
  //camera(X, Y, Z, centerX, centerY, centerZ, 0, 1, 0);
  //print("X: "+X+"  Y: "+Y+"  Z: "+Z+"\ncX: "+centerX+"  cY: "+centerY+"  cZ: "+centerZ);
  camera(1000, -187, 656, -94, -125, 0);
}

//카메라 시점
/*X: 1125  Y: -375  Z: 625
cX: -125  cY: -375  cZ: 0 */
    
/*X: 1100  Y: -250  Z: 625
cX: -62  cY: -156  cZ: 0 */
    
/*1000 -187 656 -94 -125 0*/
