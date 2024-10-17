import { Component, ViewEncapsulation, ElementRef, ViewChild, Input, HostListener, OnDestroy } from '@angular/core';
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

  @Input() backdrop: Backdrop;
  @Input() shouldPauseAnimation: boolean;
  @Input() isServingAsBackdrop: boolean = true;

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
    this.backdrop.onDestroy();
    this.resizeObserver?.disconnect();
  }

  ngAfterViewInit(): void {
    this.canvasElement = this.bgCanvas.nativeElement;
    const contextString = this.backdrop.contextString();

    const context = this.canvasElement.getContext(contextString);
    if (!context) {
      throw new Error(`Failed to create context: ${contextString}`);
    }
    this.ctx = context;

    this.backdrop.initializeContext(this.ctx);
    this.backdrop.setSize(this.canvasElement.width, this.canvasElement.height);
    this.backdrop.initialize();

    this.resizeObserver = new ResizeObserver((entries) => this.onResize(entries));
    this.resizeObserver.observe(this.isServingAsBackdrop ? document.body : this.canvasElement);

    // schedule first animation frame
    this.renderInterval = window.requestAnimationFrame(this.renderLoop.bind(this));
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const rect = this.canvasElement.getBoundingClientRect();
    this.backdrop.mousePosition.x = e.clientX - rect.left;
    this.backdrop.mousePosition.y = rect.height - (e.clientY - rect.top);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(e: Event) {
    const deltaOffset = new Vector2(
      window.scrollX - this.backdrop.mouseOffset.x,
      window.scrollY - this.backdrop.mouseOffset.y
    );
    this.backdrop.mouseOffset.x = window.scrollX;
    this.backdrop.mouseOffset.y = window.scrollY;

    this.backdrop.mousePosition.x += deltaOffset.x;
    this.backdrop.mousePosition.y += deltaOffset.y;
  }

  public renderLoop(): void {
    this.renderInterval = window.requestAnimationFrame(this.renderLoop.bind(this));

    if (this.shouldPauseAnimation || !this.backdrop.isInitialized) return;

    this.backdrop.clear();
    this.backdrop.tick();
  }

  private onResize(entries: ResizeObserverEntry[]) {
    if (this.isServingAsBackdrop) {
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

    this.backdrop.setSize(this.InternalCanvasRenderSize.x, this.InternalCanvasRenderSize.y);
    this.backdrop.initialize();
  }
}
