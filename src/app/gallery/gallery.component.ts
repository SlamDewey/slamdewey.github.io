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
import { GalleryImageData, GalleryRouteQueryParams, ImageJson } from '../types/gallery';
import { env } from '../../environments/environment';
import { BackdropComponent } from '../components/backdrop/backdrop.component';
import { InfoBannerComponent } from '../components/info-banner/info-banner.component';

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
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class GalleryComponent implements OnInit {
  @ViewChild('imageViewerModal') imageViewerModal: ImageViewerModalComponent;

  public bgAnimation: Backdrop = new WalkingNoiseBackdrop();

  public imageDataJSON: ImageJson;
  public imageFolders: string[];
  public imageFolderLinks: DropdownLinkData[];
  public imageTileDataSet: Map<string, ImageTileData[]>;

  public currentImageFolder: string;
  public currentImageSourceUrl: string;

  public isModalOpen: boolean = false;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly titleService = inject(Title);

  ngOnInit() {
    this.activatedRoute.data.subscribe({
      next: ({ imageJson }) => {
        this.imageDataJSON = imageJson;
        this.imageFolders = imageJson.directories;
        this.imageFolderLinks = this.imageFolders.map((f) => {
          return {
            text: this.formatFolderName(f),
            url: '/gallery',
            queryParams: {
              folder: f,
            },
          };
        });
        this.currentImageFolder = this.imageFolders[0];
        this.parseImageDataSet();
      },
      error: (e) => {
        console.error(e);
      },
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      const { folder } = params as GalleryRouteQueryParams;
      if (folder) {
        this.currentImageFolder = folder;
        this.titleService.setTitle(this.formatFolderName(folder) + ' | Gallery');
        console.log('setting title to: ', this.formatFolderName(folder) + ' | Gallery');
      } else {
        this.currentImageFolder = '';
        this.titleService.setTitle('Gallery');
        console.log('defaulted title');
      }
    });
  }

  private parseImageDataSet(): void {
    const imageSet = this.imageDataJSON.img;
    const imageTileData = new Map<string, ImageTileData[]>();

    this.imageFolders.forEach((folder: string) => {
      const imagesInFolder = imageSet[folder];
      const imageTilesForThisFolder = imagesInFolder.map((image: GalleryImageData) => {
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
