var PLAY = 1;
var END = 0;
var end2 = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var trophy,trophyG

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var loading
var score=0;

var backgroundImg,bg;

var gameOver, restart;
var youWin
var firebase;
var hour

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
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
  trophyImg = loadImage('images.png');
  youWinImg = loadImage('you.png');

}

function setup() {

  createCanvas(displayWidth-500,displayHeight/3-20);



  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5;


  
  ground = createSprite(200,220,displayHeight/3-20,20);
  ground.addImage("ground",groundImage);
  ground.x = displayWidth-500
 ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(displayWidth-1200,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth-1200,140);
  restart.addImage(restartImg);

  youWin = createSprite(displayWidth-1200,100);
  youWin.addImage(youWinImg);
  youWin.visible =false


  gameOver.scale = 0.5;
  restart.scale = 0.5;


  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,220,400,10);
  invisibleGround.visible = false;
 
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  trophyG = new Group();
  
  score = 0;
}

function draw() {
 
  //trex.debug = true;
  getTime();


  if(hour >= 06 && hour <= 16)
  {
   background (255)
   
  }
  else{
   background (0)
  }



text("Score: "+ score, displayWidth-1000 ,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
 ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
if (ground.x < 0){
     ground.x = displayWidth-500 ;
    }

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  spawnt();
  if (trophyG.isTouching(trex)){

gameState = end2
endPart2();

}
    if(obstaclesGroup.isTouching(trex)  ){
      
      gameState = END

    }


  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  camera.position.y = displayHeight/5
  
  camera.position.x = trex.x ;
  text("HS : "+localStorage["HighestScore"],displayWidth-1090,50);

  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.position.x/2 + 300,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 250;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(camera.position.x/2 +300,195,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
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
    obstacle.scale = 0.5;
    obstacle.lifetime = 350;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
 
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  
  }

  
  score = 0;
  
}

async function getTime()
{
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata")
  var responseJSON = await response.json();
 
 

  var datetime = responseJSON.datetime
hour = datetime.slice(11,13);





}

function spawnt (){  
  if (score === 1500) {
     trophy = createSprite(camera.position.x/2 + 300,195,40,10);

 trophy.addImage(trophyImg)
   trophy.scale = 0.5;
    trophy.velocityX = -3;
  trophyG.add(trophy)  
  trophy.debug = false
  } 

  }

  function endPart2(){
    if(gameState===end2)

    {
    youWin.visible = true

    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    trophyG.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
 
  
  camera.position.y = displayHeight/5
  
  camera.position.x = trex.x ;
  text("HS : "+localStorage["HighestScore"],displayWidth-1090,50);

  drawSprites();
    }
  }