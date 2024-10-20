import { drawPolygon, FillStyleFn, TileTerrainFillStyles } from '../util/rendering';
import { AxialCoordinate, Coordinate, Vector2 } from './coordinate';
import { EcsRenderableComponent } from './ecs';

export const ALL_TILE_TERRAINS = ['void', 'test', 'ocean', 'ocean_shelf', 'shore', 'grass'] as const;
export type TileTerrain = (typeof ALL_TILE_TERRAINS)[number];

export const ALL_TILE_FEATURES = ['none', 'hill'];
export type TileFeature = (typeof ALL_TILE_FEATURES)[number];

export interface Tile<C extends Coordinate> {
  position: C;
  terrainType: TileTerrain;
  feature: TileFeature | undefined;
  isPassable: boolean;
  speedModifier: number;
  getNeighborOffsets: () => C[];
  getNeighborHashes: () => number[];
}

export class SquareTile implements Tile<Vector2> {
  private static readonly neighborOffsets = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ] as Vector2[];

  public getNeighborOffsets(): Vector2[] {
    return SquareTile.neighborOffsets;
  }

  public getNeighborHashes(): number[] {
    return SquareTile.neighborOffsets.map((offset: Vector2) => {
      return Coordinate.getHashCode(Vector2.plus(this.position, offset));
    });
  }

  position: Vector2;
  terrainType: TileTerrain;
  feature: TileFeature | undefined;
  isPassable: boolean;
  speedModifier: number;
}

export class HexTile implements Tile<AxialCoordinate> {
  public static readonly graphicalWidth = 15;
  public static readonly graphicalHeight = 13;
  private static readonly tileCenterOffset: Vector2 = new Vector2(
    HexTile.graphicalWidth / 2,
    HexTile.graphicalHeight / 2
  );
  private static readonly neighborOffsets = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
  ] as AxialCoordinate[];

  public getNeighborOffsets(): AxialCoordinate[] {
    return HexTile.neighborOffsets;
  }

  public getNeighborHashes(): number[] {
    return HexTile.neighborOffsets.map((offset: AxialCoordinate) => {
      return Coordinate.getHashCode(AxialCoordinate.plus(this.position, offset));
    });
  }

  public static TileToWorld(coord: AxialCoordinate, getTileCenter: boolean = true) {
    const pos = new Vector2().set([
      ((coord.q * HexTile.graphicalWidth) / 2) * (3 / 2),
      (coord.q * HexTile.graphicalHeight) / 2 + (coord.r + 0.5) * HexTile.graphicalHeight,
    ]);
    return getTileCenter ? Vector2.plus(pos, HexTile.tileCenterOffset) : pos;
  }

  position: AxialCoordinate;
  terrainType: TileTerrain;
  feature: TileFeature | undefined;
  isPassable: boolean;
  speedModifier: number;
}

export abstract class TileMap<C extends Coordinate> extends EcsRenderableComponent {
  public readonly columns: number;
  public readonly columnHeight: number;
  protected readonly numTiles: number;

  constructor(columns: number, columnHeight: number) {
    super();
    this.columns = columns;
    this.columnHeight = columnHeight;
    this.numTiles = columns * columnHeight;
  }

  public abstract setTiles(tileSet?: Tile<C>[]): void;
  public abstract getTileAt(coordinate: C): Tile<C> | undefined;
}

export class HexTileMap extends TileMap<AxialCoordinate> {
  private readonly graphicalWidth: number;
  private readonly graphicalHeight: number;
  private readonly hexTilePolygon: Vector2[];

  private tileSet: Set<HexTile>;
  private tileLookupByCoordinateHash: Map<number, HexTile>;

  constructor(columns: number, columnHeight: number) {
    super(columns, columnHeight);
    this.graphicalWidth = ((columns * 3 + 1) * HexTile.graphicalWidth) / 4;
    this.graphicalHeight = (columnHeight * 2 + 1) * (HexTile.graphicalHeight / 2);
    this.hexTilePolygon = this.createHexTilePolygon();

    this.tileSet = new Set();
    this.tileLookupByCoordinateHash = new Map<number, HexTile>();
  }

  public setTiles(tileSet?: HexTile[]): void {
    if (tileSet?.length != this.numTiles) {
      throw new Error(`Can't setTiles with tileSet of size ${tileSet?.length}.  Expecting length of: ${this.numTiles}`);
    }
    this.tileSet = new Set(tileSet);
    this.tileLookupByCoordinateHash = new Map<number, HexTile>();
    this.tileSet?.forEach((tile) => {
      this.tileLookupByCoordinateHash.set(tile.position.getHashCode(), tile);
    });
  }

  getTileAt(coordinate: AxialCoordinate): HexTile | undefined {
    return this.tileLookupByCoordinateHash.get(coordinate.getHashCode());
  }

  private createHexTilePolygon() {
    const radius = HexTile.graphicalWidth / 2;
    const inset = 0;
    const size = radius - inset;
    const step = (Math.PI * 2) / 6;
    const points: Vector2[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = step * i;
      points.push(new Vector2(size * Math.cos(angle), size * Math.sin(angle)));
    }
    return points;
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this.tileSet.forEach((tile: HexTile) => {
      const fillStyleFn: FillStyleFn = TileTerrainFillStyles.get(tile.terrainType)!;
      const fillStyle = fillStyleFn(ctx);
      const position = HexTile.TileToWorld(tile.position, true);
      drawPolygon(ctx, this.hexTilePolygon, fillStyle, position);
      // draw feature?
    });
  }
}
