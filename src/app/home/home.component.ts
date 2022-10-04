import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Backdrop } from '../shared/backdrop/backdrop';
import { BallPitAnimatedBackground } from '../shared/backdrop/BallPitAnimatedBackground';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public bgAnimation: Backdrop = new BallPitAnimatedBackground();

  constructor(private titleService: Title) {
    this.titleService.setTitle('Jared Massa | Software Engineer');
  }

  ngOnInit(): void { }

}
