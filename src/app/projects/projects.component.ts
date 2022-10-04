import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  constructor(private titleService: Title) {
    this.titleService.setTitle('Hobbies & Projects');
  }

  ngOnInit(): void {
  }

}
