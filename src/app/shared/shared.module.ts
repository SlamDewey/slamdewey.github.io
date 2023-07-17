import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from './site-header/site-header.component';
import { RouterModule } from '@angular/router';
import { ImageTileComponent } from './image-tile/image-tile.component';
import { ImageViewerModalComponent } from './image-viewer-modal/image-viewer-modal.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { BackdropComponent } from './backdrop/backdrop.component';
import { BackdropTileComponent } from './backdrop-tile/backdrop-tile.component';

@NgModule({
  declarations: [
    SiteHeaderComponent,
    BackdropComponent,
    ImageTileComponent,
    ImageViewerModalComponent,
    SpinnerComponent,
    BackdropTileComponent
  ],
  imports: [
    CommonModule, RouterModule
  ],
  exports: [
    SiteHeaderComponent,
    BackdropComponent,
    ImageTileComponent,
    ImageViewerModalComponent,
    SpinnerComponent,
    BackdropTileComponent
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
