import { Injectable } from '@angular/core';
import { MapGenerationRequest } from '../shapes/map-generation';
import { Coordinate } from '../shapes/coordinate';

@Injectable({
  providedIn: 'root',
})
export class MapGeneratorService {
  async generateTileMap<C extends Coordinate>(request: MapGenerationRequest<C>): Promise<void> {
    try {
      return request.algorithm(request);
    } catch (e) {
      request.error?.(e as Error);
    }
  }
}
