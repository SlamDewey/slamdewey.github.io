import { AfterViewInit, Component, HostListener, inject, OnInit } from '@angular/core';
import { BackdropComponent, EcsSceneBackdrop } from 'src/app/components/backdrop';
import { MapGeneratorService } from 'src/app/services/map-generator.service';
import { AxialCoordinate, Vector2 } from 'src/app/shapes/coordinate';
import { EcsEntity } from 'src/app/shapes/ecs';
import { MapGenerationRequest, MapGenerationResponse, NoiseVariables } from 'src/app/shapes/map-generation';
import { HexTileMap } from 'src/app/shapes/tilemap';
import { Unit } from 'src/app/shapes/unit-tasking';
import { SpecularHexMapGenerator } from 'src/app/util/map-generation';

export const ZoomScalar = 100;

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
  public backdrop = new EcsSceneBackdrop();
  public tileMapEntity = new EcsEntity('HexMap');
  public tileMap: HexTileMap | undefined;

  constructor() {
    this.backdrop.scene.add(this.tileMapEntity);
  }

  ngAfterViewInit() {
    const req = {
      columns: 10,
      columnHeight: 10,
      algorithm: SpecularHexMapGenerator,
      noiseVariables: {} as NoiseVariables,
      waterPercentage: 0.5,
      onStatusChange: console.log,
      callback: this.setTileMap.bind(this),
      error: console.error,
    } as MapGenerationRequest<AxialCoordinate>;

    this.mapService.generateTileMap(req);
  }

  @HostListener('mousewheel', ['$event'])
  public onSroll(e: WheelEvent) {
    this.backdrop.scene.camera?.updateZoom((zoom) => zoom - e.deltaY / ZoomScalar);
  }

  setTileMap(res: MapGenerationResponse<AxialCoordinate>) {
    if (this.tileMap) {
      this.tileMapEntity.removeComponent(this.tileMap);
    }
    this.tileMapEntity.addComponent(res.tileMap);
    this.tileMap = res.tileMap as HexTileMap;
  }
}
