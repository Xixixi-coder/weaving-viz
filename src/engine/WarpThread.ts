import { smoothNoise } from '../utils/math';

export interface WarpPoint {
  x: number;
  y: number;
  originalX: number;
  prevX: number;
}

export class WarpThread {
  id: number;
  type: string;
  points: WarpPoint[];
  color: string;
  hoverColor: string;
  thickness: number;
  stiffness: number;
  damping: number;
  isHovered: boolean;
  isDragging: boolean;
  dragPointIndex: number;
  noiseSeed: number;

  constructor(
    id: number,
    type: string,
    x: number,
    canvasHeight: number,
    pointCount: number,
    color: string,
    hoverColor: string,
    thickness: number
  ) {
    this.id = id;
    this.type = type;
    this.color = color;
    this.hoverColor = hoverColor;
    this.thickness = thickness;
    this.stiffness = 0.03;
    this.damping = 0.92;
    this.isHovered = false;
    this.isDragging = false;
    this.dragPointIndex = -1;
    this.noiseSeed = Math.random() * 1000;

    this.points = [];
    const spacing = canvasHeight / (pointCount - 1);
    for (let i = 0; i < pointCount; i++) {
      this.points.push({
        x,
        y: i * spacing,
        originalX: x,
        prevX: x,
      });
    }
  }

  update(time: number, mouseX: number, mouseY: number) {
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];

      if (this.isDragging && Math.abs(i - this.dragPointIndex) < 5) {
        const influence = 1 - Math.abs(i - this.dragPointIndex) / 5;
        const targetX = p.originalX + (mouseX - this.points[this.dragPointIndex].originalX) * influence;
        p.x = targetX;
        p.prevX = targetX;
        continue;
      }

      const velocity = (p.x - p.prevX) * this.damping;
      p.prevX = p.x;

      const spring = (p.originalX - p.x) * this.stiffness;
      const noiseOffset = smoothNoise(time * 0.5 + i * 0.3, this.noiseSeed) * 1.5;

      p.x += velocity + spring + noiseOffset;
    }

    for (let iter = 0; iter < 2; iter++) {
      for (let i = 1; i < this.points.length; i++) {
        const prev = this.points[i - 1];
        const curr = this.points[i];
        const diff = curr.x - prev.x;
        if (Math.abs(diff) > 15) {
          const correction = (diff - Math.sign(diff) * 15) * 0.5;
          prev.x += correction;
          curr.x -= correction;
        }
      }
    }
  }

  startDrag(mouseY: number) {
    this.isDragging = true;
    const canvasH = this.points[this.points.length - 1].y;
    this.dragPointIndex = Math.round((mouseY / canvasH) * (this.points.length - 1));
    this.dragPointIndex = Math.max(0, Math.min(this.points.length - 1, this.dragPointIndex));
  }

  stopDrag() {
    this.isDragging = false;
    this.dragPointIndex = -1;
  }

  getXAtY(y: number): number {
    const canvasH = this.points[this.points.length - 1].y;
    const t = y / canvasH;
    const idx = t * (this.points.length - 1);
    const i = Math.floor(idx);
    const f = idx - i;
    if (i >= this.points.length - 1) return this.points[this.points.length - 1].x;
    return this.points[i].x * (1 - f) + this.points[i + 1].x * f;
  }

  hitTest(mx: number, my: number, threshold: number = 20): boolean {
    const x = this.getXAtY(my);
    return Math.abs(mx - x) < threshold;
  }

  getCurrentColor(): string {
    return this.isHovered || this.isDragging ? this.hoverColor : this.color;
  }

  getCurrentThickness(): number {
    return this.isHovered || this.isDragging ? this.thickness + 2 : this.thickness;
  }
}
