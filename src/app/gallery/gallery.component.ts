import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { Backdrop } from "../components/backdrop/backdrop";
import { ImageTileData } from "../components/image-tile/image-tile.component";
import { ImageViewerModalComponent } from "../components/image-viewer-modal/image-viewer-modal.component";
import { DropdownLinkData } from "../components/dropdown-link-selector/dropdown-link-selector.component";
import { WalkingNoiseBackdrop } from "../components/backdrop/WalkingNosieBackdrop";
import { ImageJson } from "../types/gallery";
import { env } from "../../environments/environment";

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

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly titleService = inject(Title);

  async ngOnInit(): Promise<void> {
    this.activatedRoute.data.subscribe({
      next: ({ imageJson }) => {
        console.log(imageJson);
        this.imageDataJSON = imageJson;
        this.imageFolders = imageJson.directories;
        this.imageFolderLinks = this.imageFolders.map((f) => {
          return {
            text: this.formatFolderName(f),
            url: `/gallery?folder=${f}`,
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
      this.currentImageFolder = params["folder"];
      if (this.currentImageFolder)
        this.titleService.setTitle(
          this.formatFolderName(this.currentImageFolder) + " | Gallery",
        );
    });
  }

  private parseImageDataSet(): void {
    const imageSet = this.imageDataJSON.img;
    const imageTileData = new Map<string, ImageTileData[]>();

    this.imageFolders.forEach((folder: string) => {
      const imageTilesForThisFolder: ImageTileData[] = [];
      const imagesInFolder = imageSet[folder] as ImageTileData[];

      imagesInFolder?.forEach((image: ImageTileData) => {
        image.onClick = () => this.onImageTileClick(image.img_src);
        image.placeholder_src = env.imageCdnUrl + image.placeholder_src;
        image.img_src = env.imageCdnUrl + image.img_src;
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

  public formatFolderName(folderName: string): string {
    const noSpecialChar = folderName.replace(/[^a-zA-Z0-9]/g, " ");
    if (noSpecialChar.length < 1) return noSpecialChar.charAt(0).toUpperCase();
    return noSpecialChar.charAt(0).toUpperCase() + noSpecialChar.slice(1);
  }
}
