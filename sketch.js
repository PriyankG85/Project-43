var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;
var gameOver, restart;
var bg, bgImage;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  bgImage = loadImage("bg.jpg");

}

function setup() {
  createCanvas(displayWidth, displayHeight);
  bg = createSprite(camera.x + 220, height / 2, 10, 100);
  bg.addImage('bg', bgImage);
  bg.scale = 5;
  // bg.velocityX = -1;

  trex = createSprite(100, 520, 20, 50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 1;

  // ground = createSprite(200, 645, width, 20);
  // ground.addImage("ground", groundImage);
  // ground.x = camera.x;
  // ground.velocityX = -(6 + 3 * score / 100);

  gameOver = createSprite(width / 2, 320);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.5;

  restart = createSprite(width / 2, 400);
  restart.addImage(restartImg);
  restart.scale = 1;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(200, 655, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;


}

function draw() {
  //trex.debug = true;
  background('aliceblue');

  if (gameState === PLAY) {

    camera.position.x += 6;
    camera.position.y = height / 2;
    score = score + Math.round(getFrameRate() / 60);
    // ground.velocityX = -(6 + 3 * score / 100);
    bg.velocityX = -1;

    // console.log(camera.x);

    if ((keyDown("space") || keyDown(UP_ARROW)) && trex.y >= 580) {
      trex.velocityY = -32;
    }

    trex.x = camera.x - 560;
    invisibleGround.x = camera.x - 500;
    // bg.x = camera.x + 200;
    gameOver.x = camera.x;
    restart.x = camera.x;
    trex.velocityY += 2

    // if (ground.x < camera.x - width / 2 + 200) {
    //   ground.x = camera.x;
    // }

    if (bg.x < camera.x - 200) {
      bg.x = camera.x + 220;
      console.log(bg.x);
    }


    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //set velcity of each game object to 0
    // ground.velocityX = 0;
    bg.velocityX = 0;
    // trex.velocityX = 0;
    // invisibleGround.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if ((keyDown("space") || keyDown(UP_ARROW) || mousePressedOver(restart))) {
      reset();
    }
    // else if ((keyDown("space") || keyDown(UP_ARROW))) {
    //   reset();
    // }
  }


  drawSprites();

  textSize(44);
  fill('blue');
  text("Score: " + score, camera.x + 400, 80);

}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.x + width / 2, 120, 40, 10);
    cloud.y = Math.round(random(120, 160));
    cloud.addImage(cloudImage);
    cloud.scale = 1.5;
    cloud.velocityX = -2;

    //assign lifetime to the variable
    cloud.lifetime = 440;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 80 === 0) {
    var obstacle = createSprite(camera.x + width / 2, 615, 150, 50);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3 * score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    //assign scale and lifetime to the obstacle
    obstacle.scale = 0.8;
    obstacle.lifetime = 200;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);



  score = 0;

}