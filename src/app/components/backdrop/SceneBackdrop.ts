import { TileMap } from 'src/app/shapes/tilemap';
import { Backdrop } from './backdrop';
import { Coordinate, Vector2 } from 'src/app/shapes/coordinate';
import { Unit } from 'src/app/shapes/unit-tasking';
import { EcsCamera, EcsEntity, EcsScene } from 'src/app/shapes/ecs';

class Canvas2DEcsScene extends EcsScene<CanvasRenderingContext2D> {
  public override render(ctx: CanvasRenderingContext2D): void {
    this.renderables.forEach((c) => {
      ctx.save();
      if (c.transform) {
        ctx.setTransform(c.transform.getTransformationMatrix());
        // TODO: what is going on with the way the tilemap renders?
      }
      c.render(ctx);
      ctx.restore();
    });
  }
}

export class MapAndUnitBackdrop<C extends Coordinate> extends Backdrop {
  private scene: Canvas2DEcsScene;
  private tileMap: TileMap<C>;
  private units: Unit[];

  constructor() {
    super();
    this.scene = new Canvas2DEcsScene('test scene');
  }

  public setTileMap(newTileMap: TileMap<C>) {
    let entity;
    if (this.tileMap && this.tileMap.entity) {
      entity = this.tileMap.entity;
      entity.removeComponent(this.tileMap);
      entity.addComponent(newTileMap);
    } else {
      entity = new EcsEntity('Map Entity').addComponent(newTileMap);
      this.scene.add(entity);
    }
    this.tileMap = newTileMap;
  }

  override init(): void {
    /**
     * Every time we init here, we must re-create the camera, as the view port could have changed.
     * View port change is actually the most likely scenario to re-call this init.
     */
    const viewport = new Vector2(this.width, this.height);
    const newCamera = new EcsCamera(viewport);
    const activeCamera = this.scene.camera;
    let activeCameraEntity = activeCamera?.entity;
    if (activeCamera && activeCameraEntity) {
      activeCameraEntity.removeComponent(activeCamera);
      activeCameraEntity.addComponent(newCamera);
    } else {
      activeCameraEntity = new EcsEntity('Main Camera').addComponent(newCamera);
      this.scene.add(activeCameraEntity);
    }
    // start using new camera:
    this.scene.camera = newCamera;
  }

  update(deltaTime: number): void {
    this.scene.update(deltaTime);
    this.scene.lateUpdate();
    if (this.scene.camera?.transform?.position) {
      const t = 0.05;
      this.scene.camera.transform.position = Vector2.plus(this.scene.camera.transform.position, new Vector2(t, t));
    }
  }

  private renderGrid() {
    const interval = 100;
    const dimension = 5;
    const uvGradient = this.ctx.createLinearGradient(
      -dimension * interval,
      -dimension * interval,
      dimension * interval,
      dimension * interval
    );
    uvGradient.addColorStop(0, 'green');
    uvGradient.addColorStop(1, 'red');
    for (let x = -dimension; x < dimension; x++) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = uvGradient;
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(x * interval, -dimension * interval);
      this.ctx.lineTo(x * interval, dimension * interval);
      this.ctx.stroke();
    }

    for (let y = -dimension; y < dimension; y++) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = uvGradient;
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(-dimension * interval, y * interval);
      this.ctx.lineTo(dimension * interval, y * interval);
      this.ctx.stroke();
    }
  }

  /**
   * this override of clear does not allow for camera rotations!
   */
  public override clear(): void {
    if (this.scene.camera && this.scene.camera.transform) {
      const viewPort = this.scene.camera.viewPort;
      const pos = this.scene.camera.transform.position;
      this.ctx.clearRect(pos.x - viewPort.x / 2, pos.y - viewPort.y / 2, viewPort.x, viewPort.y);
    } else {
      super.clear();
    }
  }

  draw(): void {
    if (this.scene.camera) {
      this.ctx.setTransform(this.scene.camera.getViewMatrix());
    }
    this.scene.render(this.ctx);

    this.renderGrid();
  }
}
