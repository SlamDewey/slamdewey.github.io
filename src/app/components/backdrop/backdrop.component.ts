import {
  Component,
  ViewEncapsulation,
  ElementRef,
  HostListener,
  OnDestroy,
  input,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Backdrop } from './backdrop';
import { Vector2 } from 'src/app/shapes/coordinate';

@Component({
  selector: 'x-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackdropComponent implements OnDestroy {
  backdrop = input.required<Backdrop>();
  shouldPauseAnimation = input<boolean>(false);
  fullscreen = input<boolean>(false);

  bgCanvas = viewChild.required<ElementRef>('bgCanvas');

  public static isWebGlEnabled: boolean;

  private canvasBufferSize = new Vector2();
  private canvasElement: HTMLCanvasElement;
  private ctx: RenderingContext;
  private renderInterval: number;
  private resizeObserver: ResizeObserver;

  constructor() {
    const e = document.createElement('canvas');
    BackdropComponent.isWebGlEnabled =
      !!window.WebGLRenderingContext ||
      !!e.getContext('webgl') ||
      !!e.getContext('experimental-webgl');
    e.remove();
  }

  ngAfterViewInit(): void {
    const backdrop = this.backdrop();
    const contextId = backdrop.contextId();
    this.canvasElement = this.bgCanvas().nativeElement;

    const context = this.canvasElement.getContext(contextId);
    if (!context) {
      throw new Error(`Failed to create context: ${contextId}`);
    }
    this.ctx = context;

    backdrop.initializeContext(this.ctx);
    backdrop.setSize(this.canvasElement.width, this.canvasElement.height);
    backdrop.initialize();

    this.resizeObserver = new ResizeObserver(this.onResize.bind(this));
    this.resizeObserver.observe(this.canvasElement);

    this.renderInterval = window.requestAnimationFrame(this.renderLoop.bind(this));
  }

  ngOnDestroy() {
    window.cancelAnimationFrame(this.renderInterval);
    this.resizeObserver?.disconnect();
    this.backdrop().onDestroy();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const backdrop = this.backdrop();
    const rect = this.canvasElement.getBoundingClientRect();
    backdrop.mousePosition.set([e.clientX - rect.left, rect.height - (e.clientY - rect.top)]);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const backdrop = this.backdrop();
    const deltaOffset = new Vector2(
      window.scrollX - backdrop.scrollOffset.x,
      window.scrollY - backdrop.scrollOffset.y
    );
    backdrop.mousePosition = Vector2.minus(backdrop.mousePosition, deltaOffset);
    backdrop.scrollOffset.set([window.scrollX, window.scrollY]);
  }

  public renderLoop(): void {
    this.renderInterval = window.requestAnimationFrame(this.renderLoop.bind(this));
    if (this.shouldPauseAnimation()) {
      return;
    }
    this.backdrop().clear();
    this.backdrop().tick();
  }

  @HostListener('mousewheel', ['$event'])
  public onSroll(e: WheelEvent) {}

  private onResize(entries: ResizeObserverEntry[]) {
    const backdrop = this.backdrop();
    const canvas = this.ctx.canvas;
    let newWidth: number, newHeight: number;

    if (this.fullscreen()) {
      newWidth = window.innerWidth;
      newHeight = window.innerHeight;
    } else {
      newWidth = entries[0].contentRect.width;
      newHeight = entries[0].contentRect.height;
    }

    if (newWidth === this.canvasBufferSize.x && newHeight === this.canvasBufferSize.y) {
      return;
    }

    this.canvasBufferSize.set([newWidth, newHeight]);

    [canvas.width, canvas.height] = [newWidth, newHeight];
    backdrop.setSize(newWidth, newHeight);
    backdrop.initialize();
  }
}
