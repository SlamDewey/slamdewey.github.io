import {
  Component,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  Input,
  HostListener,
  OnDestroy,
  output,
  input,
} from '@angular/core';
import { Backdrop } from './backdrop';
import { Vector2 } from 'src/app/shapes/coordinate';

@Component({
  selector: 'backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class BackdropComponent implements OnDestroy {
  @ViewChild('bgCanvas') bgCanvas: ElementRef;

  backdrop = input.required<Backdrop>();
  shouldPauseAnimation = input<boolean>(false);
  isServingAsBackdrop = input<boolean>(true);

  public static isWebGlEnabled: boolean;

  public InternalCanvasRenderSize = new Vector2();

  private canvasElement: HTMLCanvasElement;
  private ctx: RenderingContext;
  private renderInterval: number;
  private resizeObserver: ResizeObserver;

  constructor() {
    const e = document.createElement('canvas');
    BackdropComponent.isWebGlEnabled =
      !!window.WebGLRenderingContext || !!e.getContext('webgl') || !!e.getContext('experimental-webgl');
  }

  ngOnDestroy() {
    window.cancelAnimationFrame(this.renderInterval);
    this.backdrop().onDestroy();
    this.resizeObserver?.disconnect();
  }

  ngAfterViewInit(): void {
    const backdrop = this.backdrop();
    const contextString = backdrop.contextString();
    this.canvasElement = this.bgCanvas.nativeElement;

    const context = this.canvasElement.getContext(contextString);
    if (!context) {
      throw new Error(`Failed to create context: ${contextString}`);
    }
    this.ctx = context;

    backdrop.initializeContext(this.ctx);
    backdrop.setSize(this.canvasElement.width, this.canvasElement.height);
    backdrop.initialize();

    this.resizeObserver = new ResizeObserver((entries) => this.onResize(entries));
    this.resizeObserver.observe(this.isServingAsBackdrop() ? document.body : this.canvasElement);

    // schedule first animation frame
    this.renderInterval = window.requestAnimationFrame(this.renderLoop.bind(this));
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const backdrop = this.backdrop();
    const rect = this.canvasElement.getBoundingClientRect();
    backdrop.mousePosition.x = e.clientX - rect.left;
    backdrop.mousePosition.y = rect.height - (e.clientY - rect.top);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const backdrop = this.backdrop();
    const deltaOffset = new Vector2(window.scrollX - backdrop.mouseOffset.x, window.scrollY - backdrop.mouseOffset.y);
    backdrop.mouseOffset.x = window.scrollX;
    backdrop.mouseOffset.y = window.scrollY;

    backdrop.mousePosition.x += deltaOffset.x;
    backdrop.mousePosition.y += deltaOffset.y;
  }

  public renderLoop(): void {
    const backdrop = this.backdrop();
    this.renderInterval = window.requestAnimationFrame(this.renderLoop.bind(this));

    if (this.shouldPauseAnimation() || !backdrop.isInitialized) return;

    backdrop.clear();
    backdrop.tick();
  }

  private onResize(entries: ResizeObserverEntry[]) {
    const backdrop = this.backdrop();
    if (this.isServingAsBackdrop()) {
      this.InternalCanvasRenderSize.set([
        entries[0].target.clientWidth,
        Math.max(entries[0].target.clientHeight, window.innerHeight),
      ]);
    } else {
      this.InternalCanvasRenderSize.set([entries[0].contentRect.width, entries[0].contentRect.height]);
    }
    [this.ctx.canvas.width, this.ctx.canvas.height] = [
      this.InternalCanvasRenderSize.x,
      this.InternalCanvasRenderSize.y,
    ];
    backdrop.setSize(this.InternalCanvasRenderSize.x, this.InternalCanvasRenderSize.y);
    backdrop.initialize();
  }
}
