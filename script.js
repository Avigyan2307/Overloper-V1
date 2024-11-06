//punt 1 is bijna af, moet nog wel zorgen dat als de appel geraakt wordt je een leven eraf krijgt
//punt 2 Brent mee bezig
//punt 3 (2 moet afgerond zijn)
//punt 4 (2 moet afgerond zijn)
//punt 5 (2 moet afgerond zijn)
//punt 6 Avigyan mee bezig
//punt 7 (6 moet afgerond zijn)
//punt 8 is af
//punt 9 is af
//punt 10 455
//punt 11 (bonus)
//kijk classroom voor opdrachten


var levens = 3;

var raster = {
  aantalRijen: 12,
  aantalKolommen: 18,
  celGrootte: null,

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  },
  teken() {
    push();
    noFill();
    stroke('grey');
    for (rij = 0; rij < this.aantalRijen; rij++) {
      for (kolom = 0; kolom < this.aantalKolommen; kolom++) {
        rect(kolom * this.celGrootte, rij * this.celGrootte, this.celGrootte, this.celGrootte);
      }
    }
    pop();
  }
};

var rodeAppel = {
  x: null,
  y: null,
  toon() {
    image(rodeAppelImage, this.x, this.y, raster.celGrootte, raster.celGrootte)
  }
};

var groeneAppel = {
  x: null,
  y: null,
  snelheidX: 50,
  snelheidY: 50,
  demping: 1.0,


  beweeg() {
    this.x += this.snelheidX;
    this.y += this.snelheidY;

    console.log("X:", this.x, "Y:", this.y);


    if (this.x <= 0 || this.x >= canvas.width - raster.celGrootte) {
      this.snelheidX *= -this.demping;
    }

    if (this.y <= 0 || this.y >= canvas.height - raster.celGrootte) {
      this.snelheidY *= -this.demping;
    }
  },
  toon() {
    image(groeneAppelImage, this.x, this.y, raster.celGrootte, raster.celGrootte)
  }

};

class Bom {
  constructor() {
    this.snelheidY = floor(random())
    this.x = floor(random(raster.aantalKolommen * 0.5,raster.aantalKolommen))*raster.celGrootte;
    this.y = floor(random(raster.aantalRijen * 0.5,raster.aantalRijen))*raster.celGrootte;
  }  
  
  beweeg() {
    this.x += this.snelheidx;
    this.y += this.snelheidey;

   
    if (this.x <= 0 || this.x >= canvas.width - raster.celGrootte) {
      this.snelheidx *= -1; 
    }
    if (this.y <= 0 || this.y >= canvas.height - raster.celGrootte) {
      this.snelheidey *= -1;
    }
  }

  toon() {
    image(bomImage, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

var bommenArray = [];



class Jos {
  constructor() {
    this.x = 400;
    this.y = 900;
    this.animatie = [];
    this.frameNummer = 3;
    this.stapGrootte = null;
    this.gehaald = false;
  }

  beweeg() {
    if (keyIsDown(65)) { // A
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) { // D
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) { // W
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) { // S
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x, 0, canvas.width);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      levens--;
      return true;
    }
    else {
      return false;
    }
  }

  toon() {
    image(this.animatie[this.frameNummer], this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

class Vijand {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1, 2)) * this.stapGrootte;
    this.y += floor(random(-1, 2)) * this.stapGrootte;

    this.x = constrain(this.x, 0, canvas.width - raster.celGrootte);
    this.y = constrain(this.y, 0, canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite, this.x, this.y, raster.celGrootte, raster.celGrootte);
  }
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
  groeneAppelImage = loadImage("images/sprites/appel_1.png")
  rodeAppelImage = loadImage("images/sprites/appel_2.png")
  bomImage = loadImage("images/sprites/bom.png")
}

function setup() {
  canvas = createCanvas(900, 600); //grootte speelveld (1880, 1100 is perfect)
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  textSize(90);
  raster.berekenCelGrootte();

  rodeAppel.x = floor(random(1, raster.aantalKolommen)) * raster.celGrootte;
  rodeAppel.y = floor(random(1, raster.aantalRijen)) * raster.celGrootte;

  groeneAppel.x = floor(random(1, raster.aantalKolommen - 1)) * raster.celGrootte; //mogelijke x coördinaten waar de groene appel terecht komt
  groeneAppel.y = floor(random(1, raster.aantalRijen - 1)) * raster.celGrootte;



  for (var b = 0;b < 5;b++) {
    bommenArray.push(new Bom(bomImage,0));
  }
  
  eve = new Jos();
  eve.stapGrootte = 1 * raster.celGrootte;
  for (var b = 0; b < 6; b++) {
    var frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }

  alice = new Vijand(700, 200);
  alice.stapGrootte = 1 * eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");
}

function draw() {
  background(brug);
  text("levens: " + levens, 0, 0);
  raster.teken();


  rodeAppel.toon();
  groeneAppel.beweeg();
  groeneAppel.toon();

  for (var b = 0;b < bommenArray.length;b++) {
    bommenArray[b].toon();
  }
    
  eve.beweeg();
  alice.beweeg();
  eve.toon();
  alice.toon();

  if (eve.wordtGeraakt(alice)) {
    background('red');
    fill('white');
    text("je hebt verloren", 30, 300);
    noLoop();
  }

  if (eve.gehaald) {
    background('green');
    fill('white');
    text("Je hebt gewonnen!", 30, 300);
    noLoop();
  }
}

