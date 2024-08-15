import { Component, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { Backdrop } from "../shared/backdrop/backdrop";
import { ImageTileData } from "../shared/image-tile/image-tile.component";
import { ImageViewerModalComponent } from "../shared/image-viewer-modal/image-viewer-modal.component";
import { PerlinNoiseBackdrop } from "../shared/backdrop/PerlinNoiseBackdrop";
import {
  ImageDeliveryService,
  CLOUDFRONT_BASE_URL,
} from "../services/image-delivery.service";
import { DropdownLinkData } from "../shared/dropdown-link-selector/dropdown-link-selector.component";
import { WalkingNoiseBackdrop } from "../shared/backdrop/WalkingNosieBackdrop";

export type ImageJson = {
  img_path: string;
  placeholder_path: string;
  directories: string[];
  img: {};
};

@Component({
  selector: "x-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"],
})
export class GalleryComponent implements OnInit {
  @ViewChild("imageViewerModal") imageViewerModal: ImageViewerModalComponent;

  public bgAnimation: Backdrop = new WalkingNoiseBackdrop();

  public imageDataJSON: ImageJson;
  public imageFolders: string[];
  public imageFolderLinks: DropdownLinkData[];
  public imageTileDataSet: Map<string, ImageTileData[]>;

  public currentImageFolder: string;
  public currentImageSourceUrl: string;

  public isModalOpen: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
    private readonly imageDeliveryService: ImageDeliveryService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe((params) => {
      this.currentImageFolder = params["folder"];
      if (this.currentImageFolder)
        this.titleService.setTitle(
          this.imageDeliveryService.formatFolderName(this.currentImageFolder) +
            " | Gallery",
        );
    });
    this.imageDataJSON = await this.imageDeliveryService.getImageJson();
    this.imageFolders = this.imageDeliveryService.imageFolders;
    this.imageFolderLinks = this.imageDeliveryService.imageFolderLinks;
    this.imageDeliveryService.currentImageFolder = this.currentImageFolder;
    this.parseImageDataSet();
  }

  private parseImageDataSet(): void {
    const imageSet: {} = this.imageDataJSON.img;
    const imageTileData = new Map<string, ImageTileData[]>();

    this.imageFolders.forEach((folder: string) => {
      const imageTilesForThisFolder: ImageTileData[] = [];
      const imagesInFolder = (imageSet as any)[folder] as ImageTileData[];

      imagesInFolder?.forEach((image: ImageTileData) => {
        image.onClick = () => this.onImageTileClick(image.img_src);
        image.placeholder_src = CLOUDFRONT_BASE_URL + image.placeholder_src;
        image.img_src = CLOUDFRONT_BASE_URL + image.img_src;
        imageTilesForThisFolder.push(image);
      });
      imageTileData.set(folder, imageTilesForThisFolder);
    });
    this.imageTileDataSet = imageTileData;
  }

  private onImageTileClick(fullResolutionImageSource: string): void {
    this.currentImageSourceUrl = fullResolutionImageSource;
    this.imageViewerModal.openModal();
  }
}
