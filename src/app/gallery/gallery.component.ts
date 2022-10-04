import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as imageDataJSONraw from '../images.json';
import { Backdrop } from '../shared/backdrop/backdrop';
import { BallPitAnimatedBackground } from '../shared/backdrop/BallPitAnimatedBackground';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  public bgAnimation: Backdrop = new BallPitAnimatedBackground();

  public imageDataJSON = (imageDataJSONraw as any).default;
  public imageSet = this.imageDataJSON.img;
  public imageFolders: string[] = Object.keys(this.imageSet);
  public currentImageFolder: string = this.imageFolders[0];

  public shouldDisplaySpinner: boolean = false;
  public isModalOpen: boolean = false;

  public screenSize = {
    width: 0,
    height: 0
  };
  public currentImage = {
    title: "",
    caption: "",
    src: "",
    placeholder_src: ""
  }
  public zoomOptions = {
    scale: 1,
    panning: false,
    pointX: 0,
    pointY: 0,
    start: { x: 0, y: 0 }
  };

  constructor(private route: ActivatedRoute,
    private titleService: Title) {
    this.titleService.setTitle('Gallery');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentImageFolder = params['folder'];
    });
    if (this.currentImageFolder)
      this.titleService.setTitle(this.currentImageFolder + " | Gallery");
  }

  public onFolderSelect(newFolder: string) {
    this.currentImageFolder = newFolder;
  }

  public setCurrentImage(src: string, placeholder_src: string, title?: string, caption?: string) {
    this.currentImage.src = src;
    this.currentImage.placeholder_src = placeholder_src;
    if (title !== undefined)
      this.currentImage.title = title;
    if (caption !== undefined)
      this.currentImage.caption = caption;
  }

  public checkIfImageLoadingComplete(event: Event) {
    const element: any = event.target;
    if (!element || !(element instanceof HTMLImageElement))
      return;
    const imgElement: HTMLImageElement = element;
    if (imgElement.complete && imgElement.naturalWidth !== 0)
      this.onImageLoad();
  }

  public onImageLoad() {
    this.shouldDisplaySpinner = false;
  }

  public openModal(): void {
    this.isModalOpen = true;
    this.shouldDisplaySpinner = true;
  }
  public closeModal(): void {
    this.isModalOpen = false;
    this.shouldDisplaySpinner = false;
    this.zoomOptions = {
      scale: 1,
      panning: false,
      pointX: 0,
      pointY: 0,
      start: { x: 0, y: 0 }
    };
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
    (e.deltaY < 0) ? this.zoomIn() : this.zoomOut();
  }
  public onModalMouseDown(e: MouseEvent): void {
    e.preventDefault();
    this.zoomOptions.start = {
      x: e.clientX - this.zoomOptions.pointX,
      y: e.clientY - this.zoomOptions.pointY
    };
    this.zoomOptions.panning = true;
  }
  public onModalMouseUp(e: MouseEvent): void {
    e.preventDefault();
    this.zoomOptions.panning = false;
  }
  public onModalMouseMove(e: MouseEvent): void {
    e.preventDefault();
    if (!this.zoomOptions.panning)
      return;

    this.zoomOptions.pointX = (e.clientX - this.zoomOptions.start.x);
    this.zoomOptions.pointY = (e.clientY - this.zoomOptions.start.y);
  }
}
