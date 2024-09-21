import { Route } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { NewtonsfractalComponent } from './projects/pages/newtonsfractal/newtonsfractal.component';
import { FragmentwriterComponent } from './projects/pages/fragmentwriter/fragmentwriter.component';
import { ImageJsonResolver } from './gallery/image-json.resolver';

export type FaviconStorage = {
  faviconPath: string;
};

export const routes: (Route & FaviconStorage)[] = [
  {
    path: '',
    component: HomeComponent,
    faviconPath: 'home-favicon.ico',
  },
  {
    path: 'gallery',
    component: GalleryComponent,
    faviconPath: 'photo-favicon.ico',
    resolve: {
      imageJson: ImageJsonResolver,
    },
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    faviconPath: 'project-favicon.ico',
  },
  {
    path: 'projects',
    children: [
      {
        path: 'newtonsfractal',
        title: "Newton's Fractal, animated",
        component: NewtonsfractalComponent,
      },
      {
        path: 'fragmentwriter',
        title: 'Web based GLSL Fragment Shader Editor',
        component: FragmentwriterComponent,
      },
    ],
    faviconPath: 'projects-favicon.ico',
  },
  {
    path: '**',
    pathMatch: 'full',
    component: HomeComponent,
    faviconPath: '',
  },
];
