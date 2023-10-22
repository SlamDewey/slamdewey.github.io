import { Component, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import * as imageDataJSONraw from "../images.json";
import { Backdrop } from "../shared/backdrop/backdrop";
import { ImageTileData } from "../shared/image-tile/image-tile.component";
import { ImageViewerModalComponent } from "../shared/image-viewer-modal/image-viewer-modal.component";
import { DropdownLinkData } from "../shared/dropdown-link-selector/dropdown-link-selector.component";
import { PerlinNoiseBackdrop } from "../shared/backdrop/PerlinNoiseBackdrop";

@Component({
  selector: "x-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"],
})
export class GalleryComponent implements OnInit {
  @ViewChild("imageViewerModal") imageViewerModal: ImageViewerModalComponent;

  public bgAnimation: Backdrop = new PerlinNoiseBackdrop();

  public imageDataJSON = (imageDataJSONraw as any).default;

  public imageFolders: string[] = Object.keys(this.imageDataJSON.img);
  public imageFolderLinks: DropdownLinkData[] = this.imageFolders.map((f) => {
    return {
      text: this.formatFolderName(f),
      url: `/gallery?folder=${f}`,
    };
  });
  public imageTileDataSet: Map<string, ImageTileData[]>;

  public currentImageFolder: string = this.imageFolders[0];
  public currentImage: string;

  public isModalOpen: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly titleService: Title,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.currentImageFolder = params["folder"];
      if (this.currentImageFolder)
        this.titleService.setTitle(
          this.formatFolderName(this.currentImageFolder) + " | Gallery",
        );
    });

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
    this.currentImage = "../" + fullResolutionImageSource;
    this.imageViewerModal.openModal();
  }

  public formatFolderName(folderName: string): string {
    const noSpecialChar = folderName.replace(/[^a-zA-Z0-9]/g, " ");
    if (noSpecialChar.length < 1) return noSpecialChar.charAt(0).toUpperCase();
    return noSpecialChar.charAt(0).toUpperCase() + noSpecialChar.slice(1);
  }
}
