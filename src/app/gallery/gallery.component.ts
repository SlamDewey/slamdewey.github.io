import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as imageDataJSONraw from '../images.json';
import { Backdrop } from '../shared/backdrop/backdrop';
import { BallPitAnimatedBackground } from '../shared/backdrop/BallPitAnimatedBackground';
import { ImageTileData } from '../shared/image-tile/image-tile.component';
import { ImageViewerModalComponent } from '../shared/image-viewer-modal/image-viewer-modal.component';

@Component({
  selector: 'x-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  @ViewChild('imageViewerModal') imageViewerModal: ImageViewerModalComponent;

  public bgAnimation: Backdrop = new BallPitAnimatedBackground();

  public imageDataJSON = (imageDataJSONraw as any).default;

  public imageFolders: string[] = Object.keys(this.imageDataJSON.img);
  public imageTileDataSet: Map<string, ImageTileData[]>;

  public currentImageFolder: string = this.imageFolders[0];
  public currentImage: string;

  public isModalOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title
  ) {
    this.titleService.setTitle('Gallery');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentImageFolder = params['folder'];
    });
    if (this.currentImageFolder)
      this.titleService.setTitle(this.currentImageFolder + " | Gallery");

    this.parseImageDataSet();
  }

  private parseImageDataSet(): void {
    const imageSet = this.imageDataJSON.img;

    this.imageTileDataSet = new Map<string, ImageTileData[]>();

    this.imageFolders.forEach((folder: string) => {
      const folderImageSet: ImageTileData[] = [];
      imageSet[folder].forEach((image: ImageTileData) => {
        image.onClick = () => this.onImageTileClick(image.img_src);
        folderImageSet.push(image);
      });
      this.imageTileDataSet.set(folder, folderImageSet);
    });
  }

  private onImageTileClick(fullResolutionImageSource: string): void {
    this.currentImage = '../' + fullResolutionImageSource;
    this.imageViewerModal.openModal();
  }

  public onFolderSelect(newFolder: string) {
    this.currentImageFolder = newFolder;
  }
}
