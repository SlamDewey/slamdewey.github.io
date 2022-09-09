import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from './site-header/site-header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SiteHeaderComponent
  ],
  imports: [
    CommonModule, RouterModule
  ],
  exports: [
    SiteHeaderComponent
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
