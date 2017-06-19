/* eslint-env browser */
/* eslint-disable no-console */
/* eslint-disable sort-keys */
console.log("Hello world");

const btnPlay = document.getElementById("btnPlay");
const btnPause = document.getElementById("btnPause");
const btnDebug = document.getElementById("btnDebug");

btnPlay.onclick = () => {
  btnPlay.style.display = "none";
  btnDebug.setAttribute("disabled", "");
  btnPause.style.display = "inline-block";
};

btnPause.onclick = () => {
  btnPlay.style.display = "inline-block";
  btnDebug.removeAttribute("disabled");
  btnPause.style.display = "none";
};

btnDebug.onclick = () => {
  car2.accelerate();
};

btnPause.onclick();

class CustomObject {
  checkRequiredProperties(...properties) {
    for (const property of properties) {
      if (!property) {
        const message = `Class ${this.constructor.name}
        requires property ${[property]}`;
        console.exception(message);
      }
    }
  }
}

class Street extends CustomObject {
  constructor(mainCanvas) {
    super();
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = 980;
    this.mainCanvas = mainCanvas;
    this.mainCanvas.context = mainCanvas.getContext("2d");
  }

  static get direction() {
    return {
      "direction": {
        "down": "down",
        "left": "left",
        "right": "right",
        "up": "up"
      }
    };
  }
  isRightDirection() { return this.streetDirection === Street.direction.right; }
  isLeftDirection() { return this.streetDirection === Street.direction.left; }
  isHorizontalDirection() {
    return this.isRightDirection() || this.isLeftDirection();
  }
  drawOuterBorder() {
    const STREET_BORDER = "10px solid #7f7f7f";

    if (this.isHorizontalDirection()) {
      this.mainCanvas.style.borderTop = STREET_BORDER;
      this.mainCanvas.style.borderBottom = STREET_BORDER;
    } else {
      this.mainCanvas.style.borderLeft = STREET_BORDER;
      this.mainCanvas.style.borderRight = STREET_BORDER;
    }
  }
  drawSeparatorLines() {
    const size = 25;
    const space = 45;

    const { context } = this;

    context.lineWidth = 2;
    context.strokeStyle = "#fff";
    let streetSize = this.canvas.height;
    if (this.isHorizontalDirection()) {
      streetSize = this.canvas.width;
    }
    for (let i = 1; i < this.totalLanes; i += 1) {
      for (let j = 0; j <= streetSize / space; j += 1) {
        const laneAxis = this.laneSize * i;
        const initialPoint = j * space;
        const endPoint = j * space + size;

        if (this.isHorizontalDirection()) {
          context.moveTo(initialPoint, laneAxis);
          context.lineTo(endPoint, laneAxis);
        } else {
          context.moveTo(laneAxis, initialPoint);
          context.lineTo(laneAxis, endPoint);
        }
        context.stroke();
      }
    }
  }
  drawCached() {
    this.mainCanvas.context.drawImage(this.canvas, 0, 0);
  }
  draw() {
    if (this.isHorizontalDirection()) {
      this.mainCanvas.height = this.laneSize * this.totalLanes;
    } else {
      this.mainCanvas.width = this.laneSize * this.totalLanes;
    }

    this.drawOuterBorder();
    this.drawSeparatorLines();
    this.drawCached();
  }
  reset() {
    const canvas = this.mainCanvas;
    canvas.context.clearRect(0, 0, canvas.width, canvas.height);
    this.drawCached();
  }
}

class Car {
  constructor(street) {
    this.width = 81;
    this.height = 40;
    this.image = new Image();
    this.src = "car-base.png";
    this.street = street;
    this.image.onload = () => {
      const { context } = this.street.mainCanvas;
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    };
  }

  draw(x, y) {
    this.x = x;
    this.y = y;
    this.image.src = this.src;
  }

  accelerate(speed = 40) {
    this.street.reset();
    this.x -= speed;
    this.image.src = this.src;
  }
}

const mainCanvas = document.getElementById("mainCanvas");
const street = new Street(mainCanvas);
street.laneSize = 50;
street.totalLanes = 2;
street.streetDirection = Street.direction.right;
street.draw();

const car = new Car(street);
car.draw(12, 4);
//car.accelerate();

const car2 = new Car(street);
car2.draw(960, 4);

// setInterval(() => console.log("eey"), 1000);
