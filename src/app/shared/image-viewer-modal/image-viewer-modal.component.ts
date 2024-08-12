import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

export interface ZoomOptions {
  scale: number;
  panning: boolean;
  pointX: number;
  pointY: number;
  start: { x: number; y: number };
}

@Component({
  selector: "x-image-viewer-modal",
  templateUrl: "./image-viewer-modal.component.html",
  styleUrls: ["./image-viewer-modal.component.scss"],
})
export class ImageViewerModalComponent implements OnInit {
  @Input() imageSource: string;
  @Output() onOpen: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  public shouldDisplaySpinner: boolean = false;

  public zoomOptions: ZoomOptions;
  public isModalOpen: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.resetZoomOptions();
  }

  private resetZoomOptions() {
    this.zoomOptions = {
      scale: 1,
      panning: false,
      pointX: 0,
      pointY: 0,
      start: { x: 0, y: 0 },
    };
  }

  public checkIfImageLoadingComplete(event: Event) {
    const element: any = event.target;
    if (!element || !(element instanceof HTMLImageElement)) {
      return;
    }
    const imgElement: HTMLImageElement = element;
    if (imgElement.complete && imgElement.naturalWidth !== 0) {
      this.onImageLoad();
    }
  }

  public onImageLoad() {
    this.shouldDisplaySpinner = false;
  }

  public openModal(): void {
    this.isModalOpen = true;
    this.shouldDisplaySpinner = true;
    this.onOpen.emit();
  }

  public closeModal(): void {
    this.isModalOpen = false;
    this.shouldDisplaySpinner = false;
    this.resetZoomOptions();
    this.onClose.emit();
  }

  public zoomIn(): void {
    this.zoomOptions.scale *= 1.2;
    this.zoomOptions.pointX *= 1.2;
    this.zoomOptions.pointY *= 1.2;
  }
  public zoomOut(): void {
    this.zoomOptions.scale /= 1.2;
    this.zoomOptions.pointX /= 1.2;
    this.zoomOptions.pointY /= 1.2;
  }

  public onModalWheel(e: WheelEvent): void {
    e.preventDefault();
    e.deltaY < 0 ? this.zoomIn() : this.zoomOut();
  }
  public onModalMouseDown(e: MouseEvent): void {
    e.preventDefault();
    this.zoomOptions.start = {
      x: e.clientX - this.zoomOptions.pointX,
      y: e.clientY - this.zoomOptions.pointY,
    };
    this.zoomOptions.panning = true;
  }
  public onModalMouseUp(e: MouseEvent): void {
    e.preventDefault();
    this.zoomOptions.panning = false;
  }
  public onModalMouseMove(e: MouseEvent): void {
    e.preventDefault();
    if (!this.zoomOptions.panning) return;

    this.zoomOptions.pointX = e.clientX - this.zoomOptions.start.x;
    this.zoomOptions.pointY = e.clientY - this.zoomOptions.start.y;
  }
}
