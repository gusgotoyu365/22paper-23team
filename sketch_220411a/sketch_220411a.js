let sliderGroup = [];
let rotatesX, rotatesY, rotatesZ, rotates;

let f = [];

let X;
let Y;
let Z;
let centerX;
let centerY;
let centerZ;
let hi = 20;

let view = 1;

let rX, rY, rZ, rR;
let rectY = 0;

colorarray = ['#cc0000', '#FFFF33', '#FF8000'];

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
let rect_cover = false;
let rect_uncover = false;

let i_fish, i_fish_h, i_fish_c; //이미지 불러오기용
let i_wb, i_wb_h, i_wb_c;

let timer = 0;

let terrain = [];
let sea_terrain = [];

function preload() {
  wooden_boat = loadModel('obj/wooden_boat.obj');
  sit_human = loadModel('obj/sitting_human.obj');
  rod = loadModel('obj/fishing_rod.obj');
  fish = loadModel('obj/fish.obj');
  pet = loadModel('obj/plastic_bottle.obj');
  factory = loadModel('obj/factory.obj');
  i_fish = loadImage('image/fish_img.png');
  i_fish_h = loadImage('image/fish_hovered.png');
  i_fish_c = loadImage('image/fish_clicked.png');
  i_wb = loadImage('image/wb_img.png');
  i_wb_h = loadImage('image/wb_hovered.png');
  i_wb_c = loadImage('image/wb_clicked.png');
}

function setup() {
  createCanvas(540, 960, WEBGL);
  cols = 20;
  rows = 20;

  for (let x = 0; x < cols; x++) { //바다, 바다 지형 초기화
    terrain[x] = [];
    sea_terrain[x] = [];
    for (let y = 0; y < rows; y++) {
      terrain[x][y] = 0;
      sea_terrain[x][y] = 0;
    }
  }

  for (i=0; i<10; i++) { //물고기 클래스 생성
    f[i] = new Fish();
  }

  //카메라 시점용 slider
  for (let i = 0; i < 6; i++) {
    if (i === 2) {
      sliderGroup[i] = createSlider(-1000, 1000, 0);
    } else {
      sliderGroup[i] = createSlider(-1000, 1000, 0);
    }
    hi = map(i, 0, 6, 5, 85);
    sliderGroup[i].position(10, height + hi);
    sliderGroup[i].style('width', '80px');
  }

  rotates = createSlider(-20, 20, 0);
  rotatesX = createSlider(-20, 20, 0);
  rotatesY = createSlider(-20, 20, 0);
  rotatesZ = createSlider(-50, 20, 0);
}

function draw() {
  rotateX(PI/2);
  background(255);
  
  sea_speed += 0.01; //바다 움직임

  if (wb_move == true) { //wb_move가 참이 되면 나무배를 움직임
    wb_loc += 0.5;
    if (wb_loc >= 230) {
      wb_move = false;
    }
  }

  push();
  translate(0, 0, -100);
  white_wallR();
  sb_display(sb_speed, theta); //바다 아래쪽의 땅 생성
  wb_display(); //나무 배 생성 (처음에는 숨어있다가 나오는 방식)
  sea_display(sea_speed, theta); //바다의 물결 생성
  pop();

  if (rect_cover == true) { //위와 아래의 네모가 rectY에 따라 움직임
    if (rectY>=350) {
      rect_cover = false;
    } else {
      rectY += 5;
    }
  }

  if (rect_uncover == true) {
    if (rectY<=0) {
      rect_uncover = false;
    } else {
      rectY -= 5;
    }
  }
  
  UDrectG(); //회색인 위랑 아래의 네모 생성

  canvas.getContext('webgl').disable(canvas.getContext('webgl').DEPTH_TEST); //이 구문으로 인해 먼저 생성된 개체가 가장 뒤에 위치하게 됨
  if (spawn_fish == true) {
    for (let i=0; i<10; i++) {
      f[i].display();
      fish_move+=0.001;
    }
  }
  
  main_view(); //버튼을 누름에 따른 흐름
  UDrectB(); //검은색인 위와 아래의 네모 생성
  
  push();
  rotate(PI/20);
  rotateX(PI/2);
  rotateY(PI/-15);
  rotateZ(PI/-39);
  fill(100);
  scale(200);
  model(factory);
  pop();
  
  canvas.getContext('webgl').enable(canvas.getContext('webgl').DEPTH_TEST); //이 구문으로 인해 다시 보이는대로 표시 됨
  slider(); //테스트용 slider

  //camera(X, Y, Z, centerX, centerY, centerZ, 0, 1, 0);
  //print("X: "+X+"  Y: "+Y+"  Z: "+Z+"\ncX: "+centerX+"  cY: "+centerY+"  cZ: "+centerZ);
  camera(1000, -781, 969, 0, 100, 0);
  print("rR: "+rR+" rX: "+rX+" rY: "+rY+" rZ: "+rZ);
  print(mouseX + " " + mouseY + " " + timer + " rectY: "+rectY);
}

function slider() { //테스트용 slider
  X = sliderGroup[0].value();
  Y = sliderGroup[1].value();
  Z = sliderGroup[2].value();
  centerX = sliderGroup[3].value();
  centerY = sliderGroup[4].value();
  centerZ = sliderGroup[5].value();
  rR = rotates.value();
  rX = rotatesX.value();
  rY = rotatesY.value();
  rZ = rotatesZ.value();
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
      terrain[x][y] = map((co+noise(xoff, yoff)), 0, 2, 0, 100); //cos를 이용하여 noise를 변화시킴
      xoff += 0.2;
      i += TWO_PI / 500.0;
    }
    yoff += 0.2;
  }

  //바다 아래에 있는 땅의 옆에 네모난 벽 생성
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
      sea_terrain[x][y] = map((sin(theta)+(noise(xoff, yoff))+1), 0, 2, 250, 350); //sin을 이용하여 noise를 변화시킴
      xoff += 0.1;
      i += (TWO_PI / 500.0);
    }
    yoff += 0.2;
  }
  
  //바다 옆쪽의 네모난 벽 생성
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

function wb_display() { //보트 생성
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

function white_wallR() { //보트를 숨기는 하얀 박스 생성
  push();
  translate(150, -300, 350);
  noStroke();
  fill(255);
  box(600, 600);
  pop();
}

function UDrectG() { //위, 아래의 회색 네모 생성
  push(); //회색 네모
  rotateZ(PI/4);
  translate(0, 0, 1000+rectY/3);
  noStroke();
  fill(230);
  box(800);
  translate(0, 0, -4500+(-rectY*2));
  rotate(-PI/200);
  rotateY(PI/10);
  box(2300);
  pop();
}

function UDrectB() { //위, 아래의 검은색 네모 생성
  push(); //위쪽 검은색
  rotate(PI/4.08);
  rotateX(PI/1); //-8, 9, 5
  rotateY(PI/-3);
  rotateZ(PI/2);
  translate(-594, 818-rectY, 0); //약 Y가 350일때 가려짐
  noStroke();
  fill(0);
  rect(0, 0, 1400, 1400);
  pop();

  push(); //아래쪽 검은색
  rotate(PI/4.08);
  rotateX(PI/1); //-8, 9, 5
  rotateY(PI/-3);
  rotateZ(PI/2);
  translate(-625, -1030+rectY, 0); //약 Y가 350일때 가려짐
  noStroke();
  fill(0);
  rect(0, 0, 1400, -1400);
  pop();
}

function main_view() { //흐름에 따른 생성 변경 & 버튼 생성 등
  push();
  rotate(PI/4.08);
  rotateX(PI/1);
  rotateY(PI/-3);
  rotateZ(PI/2);
  scale(1,-1);
  translate(-95,765+rectY);
  if (view == 1 && mouseX >= 223 && mouseX <= 320 && mouseY >= 829 && mouseY <= 925) {
    image(i_fish_h,0,0);
  } else if (view == 1) {
    image(i_fish,0,0);
  } else if (view == 2) {
    image(i_fish_c,0,0);
  } else if (view == 3) {
    spawn_fish = true;
    timer += 1;
    if (timer >= 600) {
      rect_uncover = true;
      timer = 0;
      view = 4;
    } else {
      rect_cover = true;
    }
  } else if (view == 4 && mouseX >= 223 && mouseX <= 320 && mouseY >= 829 && mouseY <= 925) {
      image(i_wb_h,0,0);
  } else if (view == 4) {
    image(i_wb,0,0);
  } else if (view == 5) {
    image(i_wb_c,0,0);
  } else if (view == 6) {
    timer += 1;
    if (timer >= 800) {
      rect_uncover = true;
      timer = 0;
      view = 7;
    } else {
      rect_cover = true;
    }
    wb_move = true;
  }
  pop();
}

class Fish {
  constructor() {
    this.x = random(100, 150);
    this.y = random(-130, -280);
    this.z = random(0, -100);
    this.filler = random(colorarray);
    this.speed = random(1, 3);
  }
  display() {
    push();
    rotateX(PI/2);
    rotateY(fish_move*this.speed);
    translate(this.x, this.y, this.z);
    scale(20);
    fill(this.filler);
    model(fish);
    pop();
  }
}

function mousePressed() {
  if (view == 1 && mouseX >= 223 && mouseX <= 320 && mouseY >= 829 && mouseY <= 925) { //마우스가 이미지 위에 위치하고 마우스가 눌리면 view를 2로
    view = 2;
  } else if (view == 4 && mouseX >= 223 && mouseX <= 320 && mouseY >= 829 && mouseY <= 925) {
    view = 5;
  }
}

function mouseReleased() {
  if (view == 2 && mouseX >= 223 && mouseX <= 320 && mouseY >= 829 && mouseY <= 925) { //마우스가 이미지 위에 위치하고 마우스가 떼어지면 view를 3으로
    view = 3;
  } else if (view == 5 && mouseX >= 223 && mouseX <= 320 && mouseY >= 829 && mouseY <= 925) {
    view = 6; 
  }
}
