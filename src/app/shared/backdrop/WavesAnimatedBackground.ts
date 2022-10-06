import { Backdrop, Vector2 } from "./backdrop";
import alea from 'alea';
import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D(alea('seed'));

export class Waves extends Backdrop {
  public config = {
    colorSchema: [
      'black',
      'blue',
      'red',
    ]
    /**
    colorSchema: [
      '#FA7921',
      '#fb9550',
      '#EC8743',
      '#D67330',
      '#FF9249',
      '#EE7B2E',
      '#DD6E25',
      '#E48749'
    ]
     */
  }

  public timestamp = 0;

  public wCenterX: number;
  public wCenterY: number;
  public wHypot: number;
  public wMin: number;

  public angle: number = Math.PI * 0.25;
  public layers = this.getLayers();

  protected init(): void {
    this.wCenterX = this.width / 2;
    this.wCenterY = this.height / 2;
    this.wHypot = Math.hypot(this.width, this.height);
    this.wMin = Math.min(this.width, this.height);
  }

  private getLayers() {
    const layers = [];
    const numLayers = this.config.colorSchema.length;

    for (let lid = 0; lid <= numLayers; lid++) {
      layers.push({
        id: lid, // used for noise offset
        progress: 1 - (lid / numLayers),
        color: this.config.colorSchema[lid]
      });
    }
    return layers;
  }

  private drawLayer(ctx: CanvasRenderingContext2D, layer: any) {
    const segmentBaseSize = 10;
    const segmentCount = Math.round(this.wHypot / segmentBaseSize);
    const segmentSize = this.wHypot / segmentCount;
    const waveAmplitude = segmentSize * 4;
    const noiseZoom = 0.03;

    ctx.save();
    ctx.translate(this.wCenterX, this.wCenterY);
    ctx.rotate(Math.sin(this.angle));

    ctx.beginPath();
    ctx.moveTo(-this.wHypot / 2, (this.wHypot / 2) - (this.wHypot * layer.progress));
    ctx.lineTo(-this.wHypot / 2, this.wHypot / 2);
    ctx.lineTo(this.wHypot / 2, this.wHypot / 2);
    ctx.lineTo(this.wHypot / 2, (this.wHypot / 2) - (this.wHypot * layer.progress));

    for (let sid = 1; sid <= segmentCount; sid++) {
      const n = noise3D(sid * noiseZoom, sid * noiseZoom, layer.id + this.timestamp);
      const heightOffset = n * waveAmplitude;

      ctx.lineTo((this.wHypot / 2) - (sid * segmentSize), this.wHypot / 2 - (this.wHypot * layer.progress) + heightOffset);
    }

    ctx.closePath();
    ctx.fillStyle = layer.color;
    ctx.fill();
    ctx.restore();
  }

  update(deltaTime: number) {
    const prevTimestamp = this.timestamp * 5000

    if (this) {
      let shiftNeeded = false;
      this.timestamp = deltaTime / 5000;

      this.layers.forEach(layer => {
        layer.progress += deltaTime / 20;

        if (layer.progress > 1 + (1 / (this.layers.length))) {
          layer.progress = 0;
          shiftNeeded = true;
        }
      })

      if (shiftNeeded) {
        this.layers.push(this.layers.shift() ?? { id: 0, progress: 0, color: 'black' });
      }
    }
  }

  draw(deltaTime: number) {
    this.layers.forEach(layer => this.drawLayer(this.ctx, layer))
  }
}
