import { Injectable } from "@angular/core";
import { ImageTileData } from "../shared/image-tile/image-tile.component";
import { DropdownLinkData } from "../shared/dropdown-link-selector/dropdown-link-selector.component";

export type ImageJson = {
  img_path: string;
  placeholder_path: string;
  directories: string[];
  img: {};
};

export const CLOUDFRONT_BASE_URL = "https://d2oyxbjapvi4dv.cloudfront.net/";
const IMAGES_JSON_URI = "images.json";

@Injectable({
  providedIn: "root",
})
export class ImageDeliveryService {
  public imageDataJSON: ImageJson;
  public imageFolders: string[];
  public currentImageFolder: string;
  public imageFolderLinks: DropdownLinkData[];
  public imageTileDataSet: Map<string, ImageTileData[]>;

  public async getImageJson(): Promise<ImageJson> {
    if (!this.imageDataJSON) {
      await this.fetchImageData();
    }
    return this.imageDataJSON;
  }

  private async fetchImageData(): Promise<void> {
    const url = CLOUDFRONT_BASE_URL + IMAGES_JSON_URI;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Origin: "https://slamdewey.github.io/",
        },
      });
      this.imageDataJSON = await response.json();
      this.imageFolders = this.imageDataJSON.directories;
      this.currentImageFolder = this.imageFolders[0];
      this.imageFolderLinks = this.imageFolders.map((f) => {
        return {
          text: this.formatFolderName(f),
          url: `/gallery?folder=${f}`,
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  public formatFolderName(folderName: string): string {
    const noSpecialChar = folderName.replace(/[^a-zA-Z0-9]/g, " ");
    if (noSpecialChar.length < 1) return noSpecialChar.charAt(0).toUpperCase();
    return noSpecialChar.charAt(0).toUpperCase() + noSpecialChar.slice(1);
  }
}
