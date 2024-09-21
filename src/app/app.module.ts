import { NgModule } from "@angular/core";
import { BrowserModule, Title } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { GalleryComponent } from "./gallery/gallery.component";
import { SharedModule } from "./components/shared.module";
import { ProjectsComponent } from "./projects/projects.component";
import { PagesModule } from "./projects/pages/pages.module";
import { FaviconService } from "./services/favicon.service";
import { provideHttpClient, withFetch } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GalleryComponent,
    ProjectsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, SharedModule, PagesModule],
  providers: [Title, FaviconService, provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
