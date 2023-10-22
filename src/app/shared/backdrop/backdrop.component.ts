import {
  Component,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  Input,
  HostListener,
  OnDestroy,
} from "@angular/core";
import { Backdrop } from "./backdrop";

@Component({
  selector: "backdrop",
  templateUrl: "./backdrop.component.html",
  styleUrls: ["./backdrop.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class BackdropComponent implements OnDestroy {
  @ViewChild("bgCanvas") bgCanvas: ElementRef;

  @Input() backdrop: Backdrop;
  @Input() shouldPauseAnimation: boolean;
  @Input() isServingAsBackdrop: boolean = true;

  public static isWebGlEnabled: boolean;

  public RefreshRateMS = 1000 / 60;
  public InternalCanvasRenderSize: { X: number; Y: number };

  private canvasElement: HTMLCanvasElement;
  private ctx: RenderingContext;
  private renderInterval: number;
  private resizeObserver: ResizeObserver;

  constructor() {
    const e = document.createElement("canvas");
    BackdropComponent.isWebGlEnabled =
      !!window.WebGLRenderingContext ||
      !!e.getContext("webgl") ||
      !!e.getContext("experimental-webgl");
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

    this.resizeObserver = new ResizeObserver((entries) =>
      this.onResize(entries),
    );
    this.resizeObserver.observe(
      this.isServingAsBackdrop ? document.body : this.canvasElement,
    );
    // schedule first animation frame
    this.renderInterval = window.requestAnimationFrame(
      this.renderLoop.bind(this),
    );
  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(e: MouseEvent) {
    var rect = this.canvasElement.getBoundingClientRect();
    this.backdrop.mousePosition.x = e.clientX - rect.left;
    this.backdrop.mousePosition.y = rect.height - (e.clientY - rect.top);
  }

  public renderLoop(): void {
    this.renderInterval = window.requestAnimationFrame(
      this.renderLoop.bind(this),
    );

    if (this.shouldPauseAnimation || !this.backdrop.isInitialized) return;

    this.backdrop.clear();
    this.backdrop.tick();
  }

  private onResize(entries: ResizeObserverEntry[]) {
    if (this.isServingAsBackdrop) {
      this.InternalCanvasRenderSize = {
        X: entries[0].target.clientWidth,
        Y: Math.max(entries[0].target.clientHeight, window.innerHeight),
      };
    } else {
      this.InternalCanvasRenderSize = {
        X: entries[0].contentRect.width,
        Y: entries[0].contentRect.height,
      };
    }
    this.ctx.canvas.width = this.InternalCanvasRenderSize.X;
    this.ctx.canvas.height = this.InternalCanvasRenderSize.Y;

    this.backdrop.initialize(
      this.ctx,
      this.InternalCanvasRenderSize.X,
      this.InternalCanvasRenderSize.Y,
    );
  }
}
