import { Vector2 } from '../shapes/coordinate';
import { TileTerrain } from '../shapes/tilemap';

export type FillStyle = string | CanvasGradient | CanvasPattern;
export type FillStyleFn = (ctx: CanvasRenderingContext2D) => FillStyle;

export const TileTerrainFillStyles: Map<TileTerrain, FillStyleFn> = new Map([
  ['void', () => 'rgb(0, 0, 0, 0)'],
  ['test', () => 'red'],
]);

export const drawPolygon = (
  ctx: CanvasRenderingContext2D,
  vertices: Vector2[],
  fillStyle: FillStyle,
  position: Vector2
) => {
  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.translate(position.x, position.y);
  ctx.moveTo(vertices[0].x, vertices[0].y);
  ctx.beginPath();
  vertices.forEach((vertex) => {
    ctx.lineTo(vertex.x, vertex.y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};
