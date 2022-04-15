let sliderGroup = [];
let f = [];

let X;
let Y;
let Z;
let centerX;
let centerY;
let centerZ;
let hi = 20;

colorarray = ['#FF3333', '#FFFF33', '#FF8000'];

let cols, rows;
let scl = 20;
let w = 1400;
let h = 1000;
const SB = -70; //Sea bottom

let theta = 0.02;

let sb_speed = 0;
let sea_speed = 0;
let wb_loc = -170;
let fish_move = 0;

let wb_move = false;
let spawn_fish = false;

let interval_fish;

let terrain = [];
let sea_terrain = [];

function preload() {
  wooden_boat = loadModel('wooden_boat.obj');
  sit_human = loadModel('sitting_human.obj');
  rod = loadModel('fishing_rod.obj');
  fish = loadModel('fish.obj');
}

function setup() {
  createCanvas(540, 960, WEBGL);
  cols = 20;
  rows = 20;

  for (let x = 0; x < cols; x++) {
    terrain[x] = [];
    sea_terrain[x] = [];
    for (let y = 0; y < rows; y++) {
      terrain[x][y] = 0;
      sea_terrain[x][y] = 0;
    }
  }
  
  for (i=0;i<10;i++) {
    f[i] = new Fish();
  }
  //카메라 시점용 slider
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
  background(255);
  //땅
  sea_speed += 0.01;
  
  if (wb_move == true) {
    wb_loc += 0.5;
    if (wb_loc >= 230) {
      wb_move = false;
    }
  }
  
  push();
  translate(0,0,-100);
  white_wallR();
  sb_display(sb_speed, theta);
  wb_display();
  sea_display(sea_speed, theta);
  pop();
  
  push();
  rotateZ(PI/4);
  translate(0,0,1000);
  noStroke();
  fill(230);
  box(800);
  translate(0,0,-4500);
  rotate(-PI/200);
  rotateY(PI/10);
  box(2300);
  pop();
  
  canvas.getContext('webgl').disable(canvas.getContext('webgl').DEPTH_TEST); //이 구문으로 인해 먼저 생성된 개체가 가장 뒤에 위치하게 됨
  if (spawn_fish == true) {
    for(let i=0; i<10; i++) {
      f[i].display();
      fish_move+=0.001;
    }
  }
  canvas.getContext('webgl').enable(canvas.getContext('webgl').DEPTH_TEST); //이 구문으로 인해 다시 보이는대로 표시 됨
  slider();
  
  //camera(X, Y, Z, centerX, centerY, centerZ, 0, 1, 0);
  //print("X: "+X+"  Y: "+Y+"  Z: "+Z+"\ncX: "+centerX+"  cY: "+centerY+"  cZ: "+centerZ);
  camera(1000, -781, 969, 0, 100, 0);
  //camera(625, 813, 1000, 281, -406, 125);
}

function slider() {
  X = sliderGroup[0].value();
  Y = sliderGroup[1].value();
  Z = sliderGroup[2].value();
  centerX = sliderGroup[3].value();
  centerY = sliderGroup[4].value();
  centerZ = sliderGroup[5].value();
}

function sb_display(yoff, theta) {
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    let i = theta;
    for (let x = 0; x < cols; x++) {
      let co = cos(theta);
      if (co>=0) {
        co = co * -1;
      }
      co = co + 1;
      terrain[x][y] = map((co+noise(xoff, yoff)), 0, 2, 0, 100);
      xoff += 0.2;
      i += TWO_PI / 500.0;
    }
    yoff += 0.2;
  }

  push();
  normalMaterial();
  fill(242, 245, 169);
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

function sea_display(yoff, theta) {
  for (let y = 0; y < rows; y++) {
    let xoff = 100;
    let i = theta;
    for (let x = 0; x < cols; x++) {
      sea_terrain[x][y] = map((sin(theta)+(noise(xoff, yoff))+1), 0, 2, 250, 350);
      xoff += 0.1;
      i += (TWO_PI / 500.0);
    }
    yoff += 0.2;
  }

  push();
  noStroke();
  fill(101, 243, 253, 100);
  for (let y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      vertex(x * scl, y * scl, sea_terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, sea_terrain[x][y + 1]);
    }
    endShape();
  }
  
  for (let x = 0; x < cols; x++) {
    beginShape(TRIANGLE_STRIP);
    for (let y = 0; y < rows - 1; y++) {
      if (x == 0 || x == cols - 1) {
        vertex(x * scl, y * scl, sea_terrain[x][y]);
        vertex(x * scl, (y + 1) * scl, sea_terrain[x][y + 1]);
        vertex(x * scl, y * scl, terrain[x][y]);
        vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
      }
    }
    endShape();
  }

  for (let y = 0; y < rows; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < rows - 1; x++) {
      if (y == 0 || y == rows - 1) {
        vertex(x * scl, y * scl, sea_terrain[x][y]);
        vertex((x + 1) * scl, y * scl, sea_terrain[x + 1][y]);
        vertex(x * scl, y * scl, terrain[x][y]);
        vertex((x + 1) * scl, y * scl, terrain[x + 1][y]);
      }
    }
    endShape();
  }
  pop();
}

function wb_display() {
  push();
  normalMaterial();
  rotateX(PI/2);
  rotateY(PI/2);
  translate(wb_loc, 351, 250);
  fill(204, 102, 0);
  model(wooden_boat);
  fill(127);
  model(sit_human);
  fill(102, 51, 0);
  model(rod);
  pop();
}

function white_wallR() {
  push();
  translate(150, -300, 350);
  noStroke();
  fill(255);
  box(600, 600);
  pop();
}

class Fish {
  constructor() {
    this.x = random(100,150);
    this.y = random(-130,-280);
    this.z = random(0,-100);
    this.filler = random(colorarray);
    this.speed = random(1,3);
  }
  display() {
    push();
    rotateX(PI/2);
    rotateY(fish_move*this.speed);
    translate(this.x,this.y,this.z);
    scale(20);
    fill(this.filler);
    model(fish);
    pop();
  }
}

function keyPressed() {
  if (key == 'w') {
    wb_move = true;
  } if (key == 's') {
    spawn_fish = true;
  }
}
