import { Component, ViewEncapsulation, ElementRef, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Backdrop } from './backdrop';

@Component({
  selector: 'backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['./backdrop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BackdropComponent implements OnInit, OnChanges {

  @ViewChild('bgCanvas') bgCanvas: ElementRef;

  @Input('backdrop') bgAnimation: Backdrop;
  @Input('shouldPauseAnimation') shouldPauseAnimation: boolean;

  public static isWebGlEnabled: boolean;

  public RefreshRateMS = 1000 / 90;
  public InternalCanvasRenderSize = {
    X: document.documentElement.scrollWidth,
    Y: Math.max(document.documentElement.scrollHeight, window.innerHeight)
  };

  private canvasElement: HTMLCanvasElement;
  private ctx: RenderingContext;
  private renderInterval: any;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.ctx)
      this.bgAnimation.initialize(this.ctx, this.InternalCanvasRenderSize.X, this.InternalCanvasRenderSize.Y);
  }

  ngOnDestroy() {
    clearInterval(this.renderInterval);
  }

  ngAfterViewInit(): void {
    // disable right click on canvas
    this.bgCanvas.nativeElement.addEventListener('contextmenu', (e: Event) => { e.preventDefault(); });

    this.canvasElement = this.bgCanvas.nativeElement;

    const e = document.createElement('canvas');
    BackdropComponent.isWebGlEnabled = (!!window.WebGLRenderingContext) || (!!e.getContext('webgl') || !!e.getContext('experimental-webgl'));

    const context = this.canvasElement.getContext(this.bgAnimation.contextString());

    if (!context) {
      throw new Error('Failed to get 2D context of Canvas');
    }

    this.ctx = context;

    this.InternalCanvasRenderSize.X = Math.max(document.documentElement.scrollHeight, window.innerWidth);
    this.InternalCanvasRenderSize.Y = Math.max(document.documentElement.scrollHeight, window.innerHeight);

    const resizeObserver = new ResizeObserver(entries => {
      this.InternalCanvasRenderSize.X = entries[0].target.clientWidth;
      this.InternalCanvasRenderSize.Y = Math.max(entries[0].target.clientHeight, window.innerHeight);

      this.ctx.canvas.width = this.InternalCanvasRenderSize.X;
      this.ctx.canvas.height = this.InternalCanvasRenderSize.Y;
      this.bgAnimation.initialize(this.ctx as CanvasRenderingContext2D, this.InternalCanvasRenderSize.X, this.InternalCanvasRenderSize.Y);
    });

    resizeObserver.observe(document.body);

    this.bgAnimation.initialize(this.ctx, this.InternalCanvasRenderSize.X, this.InternalCanvasRenderSize.Y);

    this.renderInterval = setInterval(async () => { await this.renderLoop() }, this.RefreshRateMS);
  }

  public renderLoop(): void {
    if (this.shouldPauseAnimation)
      return;
    this.bgAnimation.clear();
    this.bgAnimation.tick();
  }
}
