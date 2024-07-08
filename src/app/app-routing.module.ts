import { NgModule } from "@angular/core";
import { Route, RouterModule, Routes } from "@angular/router";
import { GalleryComponent } from "./gallery/gallery.component";
import { HomeComponent } from "./home/home.component";
import { ProjectsComponent } from "./projects/projects.component";
import { NewtonsfractalComponent } from "./projects/pages/newtonsfractal/newtonsfractal.component";
import { FragmentwriterComponent } from "./projects/pages/fragmentwriter/fragmentwriter.component";

export type FaviconStorage = {
  faviconPath: string;
};

export const routes: (Route & FaviconStorage)[] = [
  {
    path: "",
    component: HomeComponent,
    title: "Jared Massa | Software Engineer",
    faviconPath: "home-favicon.ico",
  },
  {
    path: "gallery",
    component: GalleryComponent,
    title: "Gallery",
    faviconPath: "photo-favicon.ico",
  },
  {
    path: "projects",
    component: ProjectsComponent,
    title: "Projects",
    faviconPath: "project-favicon.ico",
  },
  {
    path: "projects",
    children: [
      {
        path: "newtonsfractal",
        title: "Newton's Fractal, animated",
        component: NewtonsfractalComponent,
      },
      {
        path: "fragmentwriter",
        title: "Web based GLSL Fragment Shader Editor",
        component: FragmentwriterComponent,
      },
    ],
    faviconPath: "projects-favicon.ico",
  },
  {
    path: "**",
    pathMatch: "full",
    component: HomeComponent,
    faviconPath: "",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
