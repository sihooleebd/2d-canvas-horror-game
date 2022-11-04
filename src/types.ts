type PointT = {
  x: number;
  y: number;
};

type GhostT = {
  pos: PointT;
  speed: number;
  keyPoints: PointT[];
  prevKeyPoint: number;
};

type PlayerT = {
  pos: PointT;
  speed: number;
};
