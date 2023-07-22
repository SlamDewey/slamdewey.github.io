import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleryComponent } from './gallery/gallery.component';
import { HomeComponent } from './home/home.component';
import { ProjectsComponent } from './projects/projects.component';
import { NewtonsfractalComponent } from './projects/pages/newtonsfractal/newtonsfractal.component';
import { FragmentwriterComponent } from './projects/pages/fragmentwriter/fragmentwriter.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'gallery',
    component: GalleryComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'projects',
    children: [
      {
        path: 'newtonsfractal',
        component: NewtonsfractalComponent
      },
      {
        path: 'fragmentwriter',
        component: FragmentwriterComponent
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
