import { Component, OnInit, HostListener } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
    this.screenSize.width = window.innerWidth;
    this.screenSize.height = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onResize($event: Event) {
    this.screenSize.width = window.innerWidth;
    this.screenSize.height = window.innerHeight;
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

  onModalWheel(e: WheelEvent) {
    e.preventDefault();
    var xs = (e.clientX - this.zoomOptions.pointX) / this.zoomOptions.scale;
    var ys = (e.clientY - this.zoomOptions.pointY) / this.zoomOptions.scale;
    var delta = e.deltaY;
    (delta < 0) ? (this.zoomOptions.scale *= 1.2) : (this.zoomOptions.scale /= 1.2);
    //this.zoomOptions.pointX = e.clientX - xs * this.zoomOptions.scale;
    //this.zoomOptions.pointY = e.clientY - ys * this.zoomOptions.scale;
  }
  onModalMouseDown(e: MouseEvent) {
    e.preventDefault();
    this.zoomOptions.start = {
      x: e.clientX - this.zoomOptions.pointX,
      y: e.clientY - this.zoomOptions.pointY
    };
    this.zoomOptions.panning = true;
  }
  onModalMouseUp(e: MouseEvent) {
    e.preventDefault();
    this.zoomOptions.panning = false;
  }
  onModalMouseMove(e: MouseEvent) {
    e.preventDefault();
    if (!this.zoomOptions.panning)
      return;

    this.zoomOptions.pointX = (e.clientX - this.zoomOptions.start.x);
    this.zoomOptions.pointY = (e.clientY - this.zoomOptions.start.y);
  }
}
