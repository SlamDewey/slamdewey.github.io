import { TileMap } from 'src/app/shapes/tilemap';
import { Backdrop } from './backdrop';
import { Coordinate, Vector2 } from 'src/app/shapes/coordinate';
import { Unit } from 'src/app/shapes/unit-tasking';
import { EcsCamera, EcsEntity, EcsScene } from 'src/app/shapes/ecs';

class Canvas2DEcsScene extends EcsScene<CanvasRenderingContext2D> {
  public override render(ctx: CanvasRenderingContext2D): void {
    const cameraTransform = ctx.getTransform();
    ctx.save();
    this.renderables.forEach((c) => {
      const componentTransform = c.transform?.getTransformationMatrix() ?? new DOMMatrix();
      ctx.setTransform(cameraTransform.multiply(componentTransform));
      c.render(ctx);
      ctx.restore();
    });
  }
}

export class EcsSceneBackdrop extends Backdrop {
  public scene: Canvas2DEcsScene;
  public cameraEntity: EcsEntity;
  private activeCamera: EcsCamera | undefined;

  constructor() {
    super();
    this.scene = new Canvas2DEcsScene('EcsSceneBackdrop Scene');
    this.cameraEntity = new EcsEntity('Main Camera');
  }

  override init(): void {
    /**
     * Every time we init here, we must re-create the camera, as the view port could have changed.
     * View port change is actually the most likely scenario to re-call this init.
     */
    const viewport = new Vector2(this.width, this.height);
    const newCamera = new EcsCamera(viewport);

    if (this.activeCamera) {
      this.cameraEntity.removeComponent(this.activeCamera);
    }
    this.cameraEntity.addComponent(newCamera);
    this.activeCamera = newCamera;
    this.scene.camera = newCamera;
  }

  update(deltaTime: number): void {
    this.scene.update(deltaTime);
    this.scene.lateUpdate();
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
      this.ctx.strokeStyle = x == 0 ? 'white' : uvGradient;
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(x * interval, -dimension * interval);
      this.ctx.lineTo(x * interval, dimension * interval);
      this.ctx.stroke();
    }

    for (let y = -dimension; y < dimension; y++) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = y == 0 ? 'white' : uvGradient;
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
    this.renderGrid();
    this.scene.render(this.ctx);
  }
}
