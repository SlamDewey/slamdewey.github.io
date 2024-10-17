import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { BackdropComponent, MapAndUnitBackdrop } from 'src/app/components/backdrop';
import { MapGeneratorService } from 'src/app/services/map-generator.service';
import { AxialCoordinate } from 'src/app/shapes/coordinate';
import { MapGenerationRequest, MapGenerationResponse, NoiseVariables } from 'src/app/shapes/map-generation';
import { Unit } from 'src/app/shapes/unit-tasking';
import { SpecularHexMapGenerator } from 'src/app/util/map-generation';

@Component({
  selector: 'x-unittasking',
  templateUrl: './unittasking.component.html',
  styleUrls: ['./unittasking.component.scss'],
  standalone: true,
  imports: [BackdropComponent],
})
export class UnitTaskingComponent implements AfterViewInit {
  private readonly mapService = inject(MapGeneratorService);

  public units: Unit[];
  public backdrop = new MapAndUnitBackdrop();

  ngAfterViewInit() {
    const req = {
      columns: 10,
      columnHeight: 10,
      algorithm: SpecularHexMapGenerator,
      noiseVariables: {} as NoiseVariables,
      waterPercentage: 0.5,
      onStatusChange: console.log,
      callback: (res: MapGenerationResponse<AxialCoordinate>) => this.backdrop.setTileMap(res.tileMap),
      error: console.error,
    } as MapGenerationRequest<AxialCoordinate>;

    this.mapService.generateTileMap(req);
  }
}
