//INITIALISE VARIABLES FOR TILEMAP
let tilemap = [];
let numDown = 10;
let numAcross = 10;
let tileSize = 50;
let textures = [];

let score = 0;
let stage = 0; // controls what function should be running
//stage 0 = start 
//stage 1 = game
//stage 2 = win


//VARIABLES FOR PLAYER
let player;
let playerSprites = [];
let playerSpeed = 5;
let playerSize = tileSize;

//VARIABLES FOR BULLETS
let dots = [];
let bullets = [];
//Work in Progress

let graphicMap = [ 
//         THIS IS OUR Y AXIS
//   0  1  2  3  4  5  6  7  8  9 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
    [0, 0, 0, 0, 0, 0, 0, 0, 2, 0], // 1
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0], // 2
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 3
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 4    THIS IS OUR X AXIS
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 5
    [0, 0, 2, 0, 0, 0, 0, 1, 0, 0], // 6
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // 7
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 8
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 1]  // 9

]

let tileRules = [ 
//         THIS IS OUR Y AXIS
//   0  1  2  3  4  5  6  7  8  9 
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
[0, 0, 0, 0, 0, 0, 0, 0, 2, 0], // 1
[0, 0, 0, 1, 0, 0, 0, 0, 0, 0], // 2
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 3
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 4    THIS IS OUR xAXIS
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 5
[0, 0, 2, 0, 0, 0, 0, 1, 0, 0], // 6
[0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // 7
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 8
[0, 1, 1, 0, 0, 0, 0, 0, 0, 1]  // 9
]


function preload() {
    //tilemap textures
    textures[0] = loadImage("assets/floor.png");
    textures[1] = loadImage("assets/tunnels.png");
    textures[2] = loadImage("assets/icecream.png");

   

    //Player sprite
    // playerSprite = loadImage("orangecat.png");
    playerSprites = {
        up: loadImage("assets/orangecat.png"),
        down: loadImage("assets/orangecat.png"),
        left: loadImage("assets/orangeleft.png"),
        right: loadImage("assets/orangeright.png")
    }
}

function setup() {
    createCanvas(500, 500);

    let tileID = 0; // sets our tileID for the first tile we'll make

    //Creates all tiles
    for (let across = 0; across < numAcross; across++) {
        tilemap[across] = [];
        for (let down = 0; down < numDown; down++) {
            //Setting Texture For Tile
            let textureNum = graphicMap[down][across];
    
            //Initialising Tile
            tilemap[across][down] = new Tile(textures[textureNum], across, down, tileSize, tileID); // THIS LINE CREATES OUR NEW TILE!

            tileID++;
        }
    }
    //Tile creation finished

    //Create Player
    player = new Player(playerSprites, 3, 4, tileSize, playerSpeed, tileSize, tileRules);

    //Adds new dots to the dots array
    for(let i = 0; i < dots.length;){
        let d = new Dot(width/2, height/2);
        dots.push(d);
    }
}

// this creates a stage which flicks through the screens when needed, the game will always start with the start screen, then when clciked move into the game.

function draw(){
    if (stage == 0) {
        start();
    }

    if (stage == 1) {
        game();
    }

    if (stage == 2) {
        win();
    }

    if(mouseIsPressed == true){
        stage = 1;
    }
}


function start(){
    background(195, 177, 225);
    
    text('CLICK TO START', 200, 250);
}

function win(){

}

function game() {
    background(0);
    
    // Loops through all tiles each time draw() is called
    for (let across = 0; across < numAcross; across++) {
        for (let down = 0; down < numDown; down++) {
            tilemap[across][down].display(); // runs display() method for each tile!
            tilemap[across][down].debug(); // runs debug() method for each tile!
        }
    }
    // Finishes looping through all tiles within each draw() loop

    player.display();
    player.move();
    
    //Bullets
    for(let i = 0; i < dots.length; i++){
        dots[i].display();
        dots[i].move();
    }

    for (let j = bullets.length - 1; j >= 0; j--) {
        bullets[j].display();
        bullets[j].move();
    
        if(bullets[j].y < 0){
          bullets.splice(j,1);
          break;
        }
    
    for (let i = dots.length - 1; i >= 0; i--) {
          if(bullets[j].testIntersection(dots[i])){
            console.log("hit");
            dots.splice(i,1);
            bullets.splice(j,1);
            break;
          }
        }
    }
}

 function keyPressed() {
    player.setDirection();
}

class Player {
    constructor(sprites, startAcross, startDown, size, speed, tileSize, tileRules) {
        //Attach sprite to key in object
        this.sprites = sprites;

        //Set current sprite
        this.currentSprite = this.sprites.down;

        //Store starting tile info. Later, we will use these to store the current tile the player is on.
        this.across = startAcross;
        this.down = startDown;
        
        //convert tile coordinates into pixel coordinates
        this.xPos = this.across * tileSize;
        this.yPos = this.down * tileSize;

        //storing size and speed
        this.size = size;
        this.speed = speed;

        //Check rules/collisions for the tile the player wants to move to (target Tile)
        this.tileRules = tileRules;
        this.tileSize = tileSize;

        //some extra properties that we will use to control player movement below
        //what direction the player will travel in
        this.dirX = 0;
        this.dirY = 0;
        
        //whether the player is currently moving to another tile
        this.isMoving = false;
        
        //the x/y position of the tile the player is moving to (the target)
        this.tx = this.xPos; //set these to the initial player pos
        this.ty = this.yPos;
    }

    setDirection() {
        //Check if we're NOT currently moving...
        if (!this.isMoving) {
            //if not, then let's set the direction the player is travelling!

            //UP
            if (key === "w") {
                this.dirX = 0;
                this.dirY = -1; //direction is up!
                this.currentSprite = this.sprites.up;
            }

            //DOWN
            if (key === "s") {
                this.dirX = 0;
                this.dirY = 1; //direction is down!
                this.currentSprite = this.sprites.down;
            }

            //LEFT
            if (key === "a") {
                this.dirX = -1; //direction is left!
                this.dirY = 0; 
                this.currentSprite = this.sprites.left;
            }

            //RIGHT
            if (key === "d") {
                this.dirX = 1; //direction is right!
                this.dirY = 0;
                this.currentSprite = this.sprites.right;
            }

            //With the direction set, we can now move to the next code block to check if we can move!
            this.checkTargetTile();
        }
    }

    //This checks what tile the player wants to move to and if
    //the player is allowed to move there
    checkTargetTile() {
        //First, get what tile the player is currently on
        this.across = Math.floor(this.xPos / this.tileSize);
        this.down = Math.floor(this.yPos / this.tileSize);

        //Calculate the coordinates of the target tile
        let nextTileHorizontal = this.across + this.dirX;
        let nextTileVertical = this.down + this.dirY;

        //check is that tile is in bounds of the map
        // remember: && means AND (i.e. below is asking if ALL conditions are true)
        if (
            
            nextTileHorizontal >= 0 && //top of map
            nextTileHorizontal < numAcross && //bottom of map
            nextTileVertical >= 0 && //left edge of map
            nextTileVertical < numDown //right edge of map
        ) {
            //if it is in bounds, have we set it as moveable in our ruleMap:
            if (this.tileRules[nextTileVertical][nextTileHorizontal] != 1) { // remember we have to swap these!
                //if the target tile is walkable, then...
                //...calculate the precise x and y coordinate of the target tile...
                this.tx = nextTileHorizontal * this.tileSize;
                this.ty = nextTileVertical * this.tileSize;
                
                //Because the player is ready to move there, we can set isMoving to true!
                this.isMoving = true;
            }
        }
    }

    move() {
        //This is in our draw loop, so called move() is called every frame BUT...
        if (this.isMoving) {
            //this code block will only activate when this.isMoving = true. Otherwise, nothing happens.
            //So first, start by moving in direction set by setDirection()
            this.xPos += this.speed * this.dirX;
            this.yPos += this.speed * this.dirY;

            //Now check if player has reached targetX
            if (this.xPos === this.tx && this.yPos === this.ty) {
                //if there, stop moving and reset our variables
                this.isMoving = false;
                this.dirX = 0;
                this.dirY = 0;
            }
        }
    }

    display() {
        imageMode(CORNER);
        image(this.currentSprite, this.xPos, this.yPos, this.size, this.size);
    }
}



class Tile {
    constructor(texture, across, down, tileSize, tileID) {
        this.texture = texture;
        this.across = across; // new values!
        this.down = down; // new values!
        this.xPos = across * tileSize; // pixel value generated from across
        this.yPos = down * tileSize; // pixel value generated from down
        this.tileSize = tileSize;
        this.tileID = tileID;
    }

    display() {
        //Displays the texture of instance of NPC class
        noStroke();
        image(this.texture, this.xPos, this.yPos, this.tileSize, this.tileSize)
    }

    debug() {
        //TILE
        stroke(245);
        noFill();
        rect(this.xPos, this.yPos, this.tileSize, this.tileSize);

        //LABEL
        noStroke();
        fill(255);
        textAlign(LEFT, TOP);
        
        text(this.tileID, this.xPos, this.yPos);
    } // I've hidden the DEBUG method but this is where the code for it goes!
}


class Dot{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.xspeed = random(-1, 1);
        this.yspeed = random(-1, 1);
        this.r = random(10, 30);
    }

    display(){
        noStroke();
        ellipseMode(CENTER);
        fill(120, 20, 200);
        ellipse(this.x, this.y, this.r * 2);
    }

    move(){
        this.x += this.xspeed;
        this.y += this.yspeed;
        if(this.x >= width + this){
            this.x = 0 - this.r;
        } else if (this.x <= 0 - this.r) {
          this.x = width + this.r;
        } else if (this.y >= height + this.r) {
          this.y = 0 - this.r;
        } else if (this.y <= 0 - this.r) {
          this.y = height + this.r;  
        }
    }
}

class Bullet{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.yspeed = -3;
        this.r = 3;
    }

    display(){
        noStroke();
        ellipse(CENTER);
        fill(255, this.a);
        ellipse(this.x, this.y, this.r * 2);
    }

    move(){
        this.y += this.yspeed;
    }

    testIntersection(dot){
        let d = dist(this.x, this.u, dot.x, dot.y);
        if(d <= this.r + dot.r){
            return true;
        }
    }
}

//Cretates a bullet when pressed
function mousePressed(){
    let b = new Bullet(mouseX, mouseY);
    bullets.push(b);
}





/*
//VARIABLES FOR ENEMIES
let enemy;
let enemySprites = [];
let enemySpeed = 5;
let enemySize = tileSize;


function preload() {

    //Enemy sprite
    // enemySprite = ("dog1.jpeg") for now, 
    enemySprites = {
        up: loadImage ("assets/dog1.jpeg")
        down: loadImage ("assets/dog1.jpeg") 
        left: loadImage ("assets/dog1.jpeg") 
        right: loadImage ("assets/dog1.jpeg")
    }
}
// curently trying to make the enemy move from left to right, ending the game if they collide with the player
*/