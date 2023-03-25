// COPY-PASTE THIS INTO PROCCESSING OR YOUR EDITOR OF CHOICE//

// click screen to allow interaction, w to jump, arrow keys to move //

// replace my image URLs with your own assets :) //

let player;
let bgImage;
let floorImage;
let playerImages;
let bgX;
let viewWidth = 1024;
let creature;

function preload() {
  bgImage = loadImage("https://i.imgur.com/D48qkAD.jpg");
  floorImage = loadImage("https://i.imgur.com/LCaGHXf.png");
  creatureImage = loadImage("https://i.imgur.com/Ufj8Djh.png");
  playerImages = {
    standRight: loadImage("https://i.imgur.com/t3jv99x.png"),
    standLeft: loadImage("https://i.imgur.com/AtcROTZ.png"),
    jumpRight: loadImage("https://i.imgur.com/qM1XrtL.png"),
    jumpLeft: loadImage("https://i.imgur.com/XBJQfeI.png"),
    walkRight: [
      loadImage("https://i.imgur.com/qM1XrtL.png"),
      loadImage("https://i.imgur.com/t3jv99x.png"),
      loadImage("https://i.imgur.com/wqccJTb.png"),
    ],
    walkLeft: [
      loadImage("https://i.imgur.com/XBJQfeI.png"),
      loadImage("https://i.imgur.com/rmmMdWn.png"),
      loadImage("https://i.imgur.com/AtcROTZ.png"),
    ],
  };
}

function setup() {
  createCanvas(4224, 1024);
  player = new Player();
  creature = new Creature();
  bgX = 0;
  window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }
  });
}

function draw() {
  background(0);

  image(bgImage, bgX, 0, bgImage.width, height);
  image(floorImage, bgX, height - 50, bgImage.width, 50);

  player.show();
  player.move();

  checkForJump();

  updateBackground();

  creature.show();
  creature.move();
}

function updateBackground() {
  const buffer = 500;

  if (player.x > viewWidth - buffer) {
    if (bgX > -(bgImage.width - viewWidth)) {
      bgX -= player.moveSpeed;
      player.x -= player.moveSpeed;
      creature.x -= player.moveSpeed; // Add this line to update the creature's position
    }
  } else if (player.x < buffer) {
    if (bgX < 0) {
      bgX += player.moveSpeed;
      player.x += player.moveSpeed;
      creature.x += player.moveSpeed; // Add this line to update the creature's position
    }
  }
}

function checkForJump() {
  if (keyIsDown(87) && player.onGround) {
    player.jump();
  }
  if (keyIsDown(LEFT_ARROW)) {
    player.moveLeft();
  } else if (keyIsDown(RIGHT_ARROW)) {
    player.moveRight();
  } else {
    player.state = "stand";
  }
}

class Player {
  constructor() {
    this.x = 50;
    this.y = height - floorImage.height - playerImages.standRight.height - 20;
    this.velocity = 0;
    this.gravity = 0.5;
    this.onGround = true;
    this.moveSpeed = 5;
    this.direction = "right";
    this.state = "stand";
    this.walkFrame = 0;
    this.walkFrameCounter = 0;
  }

  show() {
    if (this.state === "stand") {
      image(
        this.direction === "right"
          ? playerImages.standRight
          : playerImages.standLeft,
        this.x,
        this.y
      );
    } else if (this.state === "jump") {
      image(
        this.direction === "right"
          ? playerImages.jumpRight
          : playerImages.jumpLeft,
        this.x,
        this.y
      );
    } else if (this.state === "walk") {
      image(
        this.direction === "right"
          ? playerImages.walkRight[this.walkFrame]
          : playerImages.walkLeft[this.walkFrame],
        this.x,
        this.y
      );
    }
  }

  updateWalkFrame() {
    this.walkFrameCounter++;
    if (this.walkFrameCounter >= 10) {
      this.walkFrame = (this.walkFrame + 1) % 3;
      this.walkFrameCounter = 3;
    }
  }

  move() {
    this.y += this.velocity;
    this.velocity += this.gravity;

    const groundLevel = height - 20 - playerImages.standRight.height;
    this.y = constrain(this.y, 0, groundLevel);

    if (this.y === groundLevel) {
      this.onGround = true;
      this.state = "stand";
    } else {
      this.onGround = false;
    }
  }

  jump() {
    if (this.onGround) {
      this.velocity = -7;
      this.state = "jump";
    }
  }

  moveLeft() {
    this.direction = "left";
    if (this.onGround) {
      this.state = "walk";
      this.updateWalkFrame();
    }
    this.x -= this.moveSpeed;
  }

  moveRight() {
    this.direction = "right";
    if (this.onGround) {
      this.state = "walk";
      this.updateWalkFrame();
    }
    this.x += this.moveSpeed;
  }

  collidesWith(orb) {
    let playerWidth = playerImages.standRight.width;
    let playerHeight = playerImages.standRight.height;

    return (
      this.x < orb.x + orb.size &&
      this.x + playerWidth > orb.x &&
      this.y < orb.y + orb.size &&
      this.y + playerHeight > orb.y
    );
  }
}

class Creature {
  constructor() {
    this.x = bgImage.width * 0.6;
    this.y = height - 20 - creatureImage.height;
    this.velocity = 0;
    this.gravity = 0.5;
    this.moveSpeed = 5;
    this.jumpTimer = 0;
    this.jumpInterval = 120;
  }

  show() {
    image(creatureImage, this.x, this.y);
  }

  move() {
    this.y += this.velocity;
    this.velocity += this.gravity;

    const groundLevel = height - 20 - creatureImage.height;
    this.y = constrain(this.y, 0, groundLevel);

    this.jumpTimer++;

    if (this.jumpTimer >= this.jumpInterval) {
      this.jumpTimer = 0;
      this.jump();
    }
  }

  jump() {
    this.velocity = -8;
    this.x -= this.moveSpeed * 2;
  }
}
