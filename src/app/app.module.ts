import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { SharedModule } from './shared/shared.module';
import { ProjectsComponent } from './projects/projects.component';
import { BackdropTestComponent } from './backdroptest/backdroptest.component';
import { PagesModule } from './projects/pages/pages.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GalleryComponent,
    ProjectsComponent,
    BackdropTestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    PagesModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
