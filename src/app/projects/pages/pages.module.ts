import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewtonsfractalComponent } from './newtonsfractal/newtonsfractal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FragmentwriterComponent } from './fragmentwriter/fragmentwriter.component';


@NgModule({
  declarations: [
    NewtonsfractalComponent,
    FragmentwriterComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    NewtonsfractalComponent
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
