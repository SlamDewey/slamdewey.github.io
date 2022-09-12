import { makeBindingParser } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import * as imageDataJSONraw from '../images.json';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  imageDataJSON = (imageDataJSONraw as any).default;
  imageSet = this.imageDataJSON.img;

  constructor() { }

  ngOnInit(): void {
    console.log(this.imageDataJSON);
  }

}
