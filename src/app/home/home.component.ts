import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Backdrop } from '../shared/backdrop/backdrop';
import { Waves } from '../shared/backdrop/WavesAnimatedBackground';
import { ShaderTestAnimatedBackground } from '../shared/backdrop/ShaderTestAnimatedBackground';

@Component({
  selector: 'x-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  public bgAnimation: Backdrop = new ShaderTestAnimatedBackground();

  constructor(private titleService: Title) {
    this.titleService.setTitle('Jared Massa | Software Engineer');
  }

  ngOnInit(): void { }

}
