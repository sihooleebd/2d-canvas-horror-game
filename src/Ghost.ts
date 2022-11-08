import Co from './Constant';

type PointT = {
  x: number;
  y: number;
};

class Ghost {
  x = 0;
  y = 0;
  keyPoints: PointT[] = [];
  prevKeyPointIdx = 0;
  image: HTMLImageElement = new Image();
  ghostImgId = 0;
  xDiff = 0;
  yDiff = 0;
  speed = 0;
  damage = 0;
  constructor(
    keyPoints: PointT[],
    ghostImgId: number,
    speed: number,
    damage: number,
  ) {
    if (keyPoints.length < 2) {
      console.error('KEYPOINTS SHORTER THAN 2. ABORTING...');
      return;
    }
    this.keyPoints = keyPoints;
    this.x = this.keyPoints[0].x;
    this.y = this.keyPoints[0].y;
    this.prevKeyPointIdx = 0;
    this.ghostImgId = ghostImgId;
    this.recalculateXYDiff();
    this.speed = speed;
    this.damage = damage;
    if (this.ghostImgId == 1) {
      this.image.src = require(`../static/img/ghosts/ghost1.png`);
      this.image.width = 70;
      this.image.height = (this.image.width * 99) / 33;
    } else if (this.ghostImgId == 2) {
      this.image.src = require(`../static/img/ghosts/ghost2.png`);
      this.image.width = 60;
      this.image.height = (this.image.width * 78) / 27;
    } else if (this.ghostImgId == 3) {
      this.image.src = require(`../static/img/ghosts/ghost3.png`);
      this.image.width = 130;
      this.image.height = (this.image.width * 46) / 75;
    } else if (this.ghostImgId == 4) {
      this.image.src = require(`../static/img/ghosts/ghost4.png`);
      this.image.width = 70;
      this.image.height = (this.image.width * 95) / 52;
    } else {
      this.image.src = require(`../static/img/ghosts/ghost5.png`);
      this.image.width = 70;
      this.image.height = (this.image.width * 98) / 53;
    }
  }

  recalculateXYDiff() {
    this.xDiff = this.calculateDiff(
      this.keyPoints[(this.prevKeyPointIdx + 1) % this.keyPoints.length].x,
      this.keyPoints[this.prevKeyPointIdx].x,
    );
    this.yDiff = this.calculateDiff(
      this.keyPoints[(this.prevKeyPointIdx + 1) % this.keyPoints.length].y,
      this.keyPoints[this.prevKeyPointIdx].y,
    );
  }
  calculateDiff(a: number, b: number) {
    return (a - b) / 100;
  }

  calculateDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  }
  move() {
    if (this.x + this.xDiff * this.speed < Co.GAME_WIDTH) {
      this.x += this.xDiff * this.speed;
    }
    if (this.y + this.yDiff * this.speed < Co.GAME_HEIGHT) {
      this.y += this.yDiff * this.speed;
    }
    // console.log('pos', this.x, this.y);
    if (
      this.calculateDistance(
        this.x,
        this.y,
        this.keyPoints[(this.prevKeyPointIdx + 1) % this.keyPoints.length].x,
        this.keyPoints[(this.prevKeyPointIdx + 1) % this.keyPoints.length].y,
      ) <= Co.GHOST_RADAR_PROXIMITY
    ) {
      // console.log('CHANGING');
      this.prevKeyPointIdx++;
      this.prevKeyPointIdx %= this.keyPoints.length;
      if (this.prevKeyPointIdx == this.keyPoints.length) {
        this.prevKeyPointIdx = 0;
      }
      this.recalculateXYDiff();
    }
  }
  render(ctx: CanvasRenderingContext2D) {
    // console.log('image', this.image.src);
    // ctx.beginPath();
    // ctx.fillStyle = '#0f0';
    // ctx.strokeStyle = '#0f0';
    // ctx.beginPath();
    ctx.save();
    ctx.translate(this.x, this.y);
    // console.log(this.image.width, this.image.height);
    ctx.drawImage(
      this.image,
      -this.image.width / 2,
      -this.image.height / 2,
      this.image.width,
      this.image.height,
    );
    ctx.restore();
    // ctx.arc(this.x, this.y, Co.TEST_GHOST_PLAYER_SIZE, 0, 2 * Math.PI);
    // ctx.stroke();
    // ctx.fill();
    // ctx.closePath();
  }
}

export default Ghost;
