import { Component, Input } from '@angular/core';

export class ImageTileData {
  public title?: string;
  public caption?: string;
  public img_src: string;
  public placeholder_src: string;
  public onClick: (event: MouseEvent) => void;
}

@Component({
  selector: 'x-image-tile',
  templateUrl: './image-tile.component.html',
  styleUrls: ['./image-tile.component.scss']
})
export class ImageTileComponent {

  @Input() imageTileData: ImageTileData;

}
