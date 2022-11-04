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
    ctx.beginPath();
    ctx.fillStyle = '#0f0';
    ctx.strokeStyle = '#0f0';
    ctx.beginPath();
    ctx.arc(this.x, this.y, Co.TEST_GHOST_PLAYER_SIZE, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}

export default Ghost;
