import { Coordinate } from './coordinate';
import { TileMap } from './tilemap';

export type NoiseVariables = {
  seed: number | undefined;
  octaves: number;
  frequency: number;
  persistence: number;
  lacunarity: number;
};

export type MapGenerationAlgorithm = <C extends Coordinate>(request: MapGenerationRequest<C>) => Promise<void>;

export interface MapGenerationRequest<C extends Coordinate> {
  columns: number;
  columnHeight: number;
  noiseVariables: NoiseVariables;
  waterPercentage: number;
  algorithm: MapGenerationAlgorithm;
  callback: (response: MapGenerationResponse<C>) => void;
  error?: (error: Error) => void;
  onStatusChange?: (...status: any) => void;
}

export type MapGenerationResponse<C extends Coordinate> = {
  columns: number;
  columnHeight: number;
  tileMap: TileMap<C>;
};
