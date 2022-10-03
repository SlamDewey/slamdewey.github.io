import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from './site-header/site-header.component';
import { RouterModule } from '@angular/router';
import { BackdropComponent } from './backdrop/backdrop.component';

@NgModule({
  declarations: [
    SiteHeaderComponent,
    BackdropComponent
  ],
  imports: [
    CommonModule, RouterModule
  ],
  exports: [
    SiteHeaderComponent, BackdropComponent
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
