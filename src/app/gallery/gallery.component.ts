import { Component, inject, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Backdrop } from '../components/backdrop/backdrop';
import { ImageTileComponent, ImageTileData } from '../components/image-tile/image-tile.component';
import { ImageViewerModalComponent } from '../components/image-viewer-modal/image-viewer-modal.component';
import {
  DropdownLinkData,
  DropdownLinkSelectorComponent,
} from '../components/dropdown-link-selector/dropdown-link-selector.component';
import { WalkingNoiseBackdrop } from '../components/backdrop/WalkingNosieBackdrop';
import { GalleryImageData, GalleryRouteQueryParams, ImagesJson } from '../shapes/gallery';
import { env } from '../../environments/environment';
import { BackdropComponent } from '../components/backdrop/backdrop.component';
import { InfoBannerComponent } from '../components/info-banner/info-banner.component';
import * as imagesJsonModule from '../../../images.json';
import { SkeletonLoaderComponent } from '../components/skeleton-loader/skeleton-loader.component';

const imagesJson = (imagesJsonModule as any).default as ImagesJson;

@Component({
  selector: 'x-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  imports: [
    BackdropComponent,
    InfoBannerComponent,
    DropdownLinkSelectorComponent,
    ImageTileComponent,
    ImageViewerModalComponent,
    SkeletonLoaderComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class GalleryComponent implements OnInit {
  @ViewChild('imageViewerModal') imageViewerModal: ImageViewerModalComponent;

  public bgAnimation: Backdrop = new WalkingNoiseBackdrop();

  public imageFolders: string[];
  public imageFolderLinks: DropdownLinkData[];
  public imageTileDataSet: Map<string, ImageTileData[]>;

  public currentImageFolder: string;
  public currentImageSourceUrl: string;

  public isModalOpen: boolean = false;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly titleService = inject(Title);

  constructor() {
    this.imageFolders = imagesJson.directories;
    this.imageFolderLinks = imagesJson.directories.map((f) => ({
      text: this.formatFolderName(f),
      url: '/gallery',
      queryParams: {
        folder: f,
      },
    }));
    this.currentImageFolder = this.imageFolders[0];
    this.parseImageDataSet();
  }

  ngOnInit() {
    this.titleService.setTitle('Gallery');

    this.activatedRoute.queryParams.subscribe((params) => {
      const { folder } = params as GalleryRouteQueryParams;
      if (folder) {
        this.currentImageFolder = folder;
        this.titleService.setTitle(this.formatFolderName(folder) + ' | Gallery');
      } else {
        this.currentImageFolder = '';
        this.titleService.setTitle('Gallery');
      }
    });
  }

  private parseImageDataSet(): void {
    const imageSet = imagesJson.img;
    const imageTileData = new Map<string, ImageTileData[]>();

    this.imageFolders.forEach((folder: string) => {
      const imageTilesForThisFolder = imageSet[folder].map((image: GalleryImageData) => {
        return {
          ...image,
          placeholder_src: env.imageCdnUrl + image.placeholder_src,
          img_src: env.imageCdnUrl + image.img_src,
          onClick: () => this.onImageTileClick(env.imageCdnUrl + image.img_src),
        } as ImageTileData;
      });
      imageTileData.set(folder, imageTilesForThisFolder);
    });
    this.imageTileDataSet = imageTileData;
  }

  private onImageTileClick(fullResolutionImageSource: string): void {
    this.currentImageSourceUrl = fullResolutionImageSource;
    this.imageViewerModal.openModal();
  }

  public formatFolderName(folderName: string): string {
    const noSpecialChar = folderName.replace(/[^a-zA-Z0-9]/g, ' ');
    if (noSpecialChar.length < 1) return noSpecialChar.charAt(0).toUpperCase();
    return noSpecialChar.charAt(0).toUpperCase() + noSpecialChar.slice(1);
  }
}
