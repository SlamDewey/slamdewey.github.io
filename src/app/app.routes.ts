import { Route } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { FragmentwriterComponent } from './projects/pages/fragmentwriter/fragmentwriter.component';
import { UnitTaskingComponent } from './projects/pages/unittasking/unittasking.component';

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
        path: 'fragmentwriter',
        title: 'Web based GLSL Fragment Shader Editor',
        component: FragmentwriterComponent,
      },
      {
        path: 'unittasking',
        title: 'Web based GLSL Fragment Shader Editor',
        component: UnitTaskingComponent,
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
