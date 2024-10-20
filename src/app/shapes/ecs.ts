/**
 * this is a simple ts port of my custom ECS
 */

import { Vector2 } from './coordinate';

export class EcsTransform {
  public parent: EcsTransform | undefined;
  private children: Set<EcsTransform> = new Set();
  public position: Vector2 = new Vector2();
  public scale: number = 1;
  public rotation: number = 0;

  public forward(): Vector2 {
    return new Vector2(Math.cos(this.rotation), Math.sin(this.rotation));
  }

  public addChild(child: EcsTransform) {
    this.children.add(child);
  }

  public removeChild(child: EcsTransform) {
    this.children.delete(child);
  }

  public onDestroy() {
    this.parent?.removeChild(this);
    this.children.forEach((child) => {
      child.parent = undefined;
    });
  }

  public getTransformationMatrix(): DOMMatrix {
    return new DOMMatrix()
      .translate(this.position.x, this.position.y)
      .rotate(0, 0, this.rotation)
      .scale(this.scale, this.scale, this.scale);
  }
}

export class EcsComponent {
  private _isActive: boolean = true;
  public entity: EcsEntity | undefined;
  public transform: EcsTransform | undefined;

  public isActive(): boolean {
    return this._isActive;
  }
  public setActive(state: boolean) {
    this._isActive = state;
    if (state) {
      this.onActivate();
    } else {
      this.onDeactivate();
    }
  }

  public onActivate(): void {}
  public onDeactivate(): void {}
  public onAddedToScene(): void {}
  public onRemovedFromScene(): void {}
  public onAddedToEntity(): void {}
  public onRemovedFromEntity(): void {}

  public onDrawGizmos(): void {}
  public update(_deltaTime: number): void {}
  public lateUpdate(): void {}
  public onDestroy(): void {}
}

export abstract class EcsRenderableComponent extends EcsComponent {
  public abstract render(_ctx: RenderingContext): void;
}

export class EcsEntity {
  public name: string;
  public transform: EcsTransform = new EcsTransform();
  public components: Set<EcsComponent> = new Set();
  private _isActive: boolean = true;
  public scene: EcsScene<RenderingContext> | undefined;

  constructor(name: string) {
    this.name = name;
  }

  public addComponent<T extends EcsComponent>(component: T): this {
    component.entity = this;
    component.transform = this.transform;
    this.components.add(component);
    this.scene?.add(component);
    component.onAddedToEntity();
    return this;
  }

  public removeComponent<T extends EcsComponent>(component: T): this {
    this.components.delete(component);
    this.scene?.remove(component);
    component.onRemovedFromEntity();
    component.entity = component.transform = undefined;
    return this;
  }

  public isActive(): boolean {
    return this._isActive;
  }

  public setActive(state: boolean) {
    this._isActive = state;
    this.components?.forEach((component) => {
      component.setActive(state);
    });
  }

  public getComponent<T extends EcsComponent>(type: new (...args: any[]) => T): T | undefined {
    const iterator = this.components.values();
    let component = iterator.next();
    while (component !== undefined) {
      if (component instanceof type) {
        return component as T;
      } else {
        component = iterator.next();
      }
    }
    return undefined;
  }

  public getComponents<T extends EcsComponent>(type: new (...args: any[]) => T): T[] {
    const iterator = this.components.values();
    let component = iterator.next()?.value;
    const result: T[] = [];
    while (component !== undefined) {
      if (component instanceof type) {
        result.push(component as T);
      }
      component = iterator.next()?.value;
    }
    return result;
  }

  public onDestroy() {
    const iterator = this.components.values();
    let component = iterator.next()?.value;
    while (component !== undefined) {
      component.onDestroy();
      component = iterator.next()?.value;
    }
    this.transform.onDestroy();
  }
}

export class EcsCamera extends EcsComponent {
  protected readonly MinZoom: number = 1;
  public readonly viewPort: Vector2;
  private readonly origin: Vector2;
  private _zoom = this.MinZoom;

  constructor(viewPort: Vector2) {
    super();
    this.origin = new Vector2(viewPort.x / 2, viewPort.y / 2);
    this.viewPort = viewPort;
  }

  public getViewMatrix(): DOMMatrix {
    const identity = new DOMMatrix();
    if (!this.transform) {
      return identity;
    }
    return identity
      .translate(-this.transform.position.x, -this.transform.position.y)
      .translate(this.origin.x, this.origin.y)
      .rotate(0, 0, this.transform.rotation)
      .scale(this._zoom, this._zoom, this._zoom);
  }

  public getZoom(): number {
    return this._zoom;
  }

  public updateZoom(updateFn: (currentZoom: number) => number) {
    this.setZoom(updateFn(this._zoom));
  }

  public setZoom(zoom: number): void {
    zoom = Math.max(zoom, this.MinZoom);
    this._zoom = zoom;
  }
}

/**
 * no lights, no collision detection, no problem!
 */
export abstract class EcsScene<ctx extends RenderingContext> {
  public name: string;
  /**
   * must be manually assigned to the camera you wish to use
   */
  public camera: EcsCamera | undefined;

  protected readonly entities: Set<EcsEntity> = new Set();
  protected readonly components: Set<EcsComponent> = new Set();
  protected readonly renderables: Set<EcsRenderableComponent> = new Set();

  constructor(name: string) {
    this.name = name;
  }

  public update(deltaTime: number): void {
    this.components.forEach((c) => c.update(deltaTime));
  }

  public lateUpdate() {
    this.components.forEach((c) => c.lateUpdate());
  }

  public abstract render(ctx: ctx): void;

  public add(item: EcsComponent | EcsEntity): void {
    if (item instanceof EcsEntity) {
      this.addEntity(item);
    } else {
      this.addComponent(item);
    }
  }
  public remove(item: EcsComponent | EcsEntity): void {
    if (item instanceof EcsEntity) {
      this.removeEntity(item);
    } else {
      this.removeComponent(item);
    }
  }

  private addComponent<T extends EcsComponent>(c: T): void {
    this.components.add(c);
    if (c instanceof EcsRenderableComponent) {
      this.renderables.add(c);
    }
    c.onAddedToScene();
  }
  private addEntity<T extends EcsEntity>(e: T) {
    this.entities.add(e);
    e.scene = this;
    e.components.forEach((c) => this.addComponent(c));
  }

  private removeComponent<T extends EcsComponent>(c: T): void {
    this.components.delete(c);
    if (c instanceof EcsRenderableComponent) {
      this.renderables.delete(c);
    }
    c.onRemovedFromScene();
  }
  private removeEntity<T extends EcsEntity>(e: T) {
    this.entities.delete(e);
    e.scene = undefined;
    e.components.forEach((c) => this.removeComponent(c));
  }
}
