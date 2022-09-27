import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as imageDataJSONraw from '../images.json';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  imageDataJSON = (imageDataJSONraw as any).default;
  imageSet = this.imageDataJSON.img;
  imageFolders: string[] = Object.keys(this.imageSet);
  currentImageFolder: string = this.imageFolders[0];
  isModalOpen: boolean = false;
  screenSize = {
    width: 0,
    height: 0
  };
  currentImage = {
    title: "",
    caption: "",
    src: ""
  }
  zoomOptions = {
    scale: 1,
    panning: false,
    pointX: 0,
    pointY: 0,
    start: { x: 0, y: 0 }
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentImageFolder = params['folder'];
    });
  }


  onFolderSelect(newFolder: string) {
    this.currentImageFolder = newFolder;
  }

  setCurrentImage(src: string, title?: string, caption?: string) {
    this.currentImage.src = src;
    if (title !== undefined)
      this.currentImage.title = title;
    if (caption !== undefined)
      this.currentImage.caption = caption;
  }

  openModal(): void {
    this.isModalOpen = true;
  }
  closeModal(): void {
    this.isModalOpen = false;
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
